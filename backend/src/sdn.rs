use crate::mock;
use crate::models::{
    OdlNetworkTopology, OdlResponse, ServiceLink, ServiceNode, ServicePosition, TopologyResponse,
};
use axum::Json;
use std::collections::HashMap;

fn transform_odl(odl_data: &OdlNetworkTopology) -> TopologyResponse {
    let mut nodes = Vec::new();
    let mut links = Vec::new();

    if let Some(topo) = odl_data.topology.get(0) {
        if let Some(odl_nodes) = &topo.node {
            for (index, node) in odl_nodes.iter().enumerate() {
                let is_switch = node.node_id.starts_with("openflow:");
                let angle = index as f32;
                let mut metadata = HashMap::new();
                if let Some(tps) = &node.termination_point {
                    metadata.insert("ports".to_string(), serde_json::json!(tps.len()));
                }

                nodes.push(ServiceNode {
                    id: node.node_id.clone(),
                    name: if is_switch {
                        format!(
                            "Switch {}",
                            node.node_id.split(':').nth(1).unwrap_or("")
                        )
                    } else {
                        node.node_id.clone()
                    },
                    node_type: if is_switch {
                        "switch".to_string()
                    } else {
                        "host".to_string()
                    },
                    realm: "physical".to_string(),
                    layer: 1,
                    status: "healthy".to_string(),
                    position: ServicePosition {
                        x: angle.cos() * 10.0,
                        y: -10.0,
                        z: angle.sin() * 10.0,
                    },
                    risk_score: 0.1,
                    metadata,
                });
            }
        }

        if let Some(odl_links) = &topo.link {
            for link in odl_links {
                links.push(ServiceLink {
                    id: link.link_id.clone(),
                    from: link.source.node.clone(),
                    to: link.destination.node.clone(),
                    kind: "physical".to_string(),
                    realm: "physical".to_string(),
                });
            }
        }
    }

    TopologyResponse { nodes, links }
}

async fn fetch_odl_topology() -> TopologyResponse {
    let odl_url =
        std::env::var("ODL_URL").unwrap_or_else(|_| "http://localhost:8181".to_string());
    let client = reqwest::Client::new();

    match client
        .get(format!(
            "{}/restconf/operational/network-topology:network-topology",
            odl_url
        ))
        .basic_auth(
            std::env::var("ODL_USERNAME").unwrap_or_else(|_| "admin".to_string()),
            Some(&std::env::var("ODL_PASSWORD").unwrap_or_else(|_| "admin".to_string())),
        )
        .header("Accept", "application/json")
        .send()
        .await
    {
        Ok(resp) => {
            if let Ok(odl_resp) = resp.json::<OdlResponse>().await {
                return transform_odl(&odl_resp.network_topology);
            }
        }
        Err(_) => {}
    }

    mock::get_mock_topology()
}

async fn fetch_ryu_topology() -> TopologyResponse {
    let ryu_url =
        std::env::var("RYU_URL").unwrap_or_else(|_| "http://localhost:8080".to_string());
    let client = reqwest::Client::new();

    let mut nodes = Vec::new();
    let mut links = Vec::new();

    if let Ok(resp) = client
        .get(format!("{}/stats/switches", ryu_url))
        .send()
        .await
    {
        if let Ok(switches) = resp.json::<Vec<u64>>().await {
            for (idx, dpid) in switches.iter().enumerate() {
                nodes.push(ServiceNode {
                    id: format!("openflow:{}", dpid),
                    name: format!("Switch {}", dpid),
                    node_type: "switch".to_string(),
                    realm: "physical".to_string(),
                    layer: 1,
                    status: "healthy".to_string(),
                    position: ServicePosition {
                        x: (idx as f32) * 5.0,
                        y: -10.0,
                        z: 0.0,
                    },
                    risk_score: 0.1,
                    metadata: HashMap::new(),
                });
            }
        }
    }

    if let Ok(resp) = client
        .get(format!("{}/v1.0/topology/links", ryu_url))
        .send()
        .await
    {
        if let Ok(ryu_links) = resp.json::<Vec<serde_json::Value>>().await {
            for link in ryu_links {
                let src_dpid = link["src"]["dpid"].as_str().unwrap_or("");
                let dst_dpid = link["dst"]["dpid"].as_str().unwrap_or("");
                links.push(ServiceLink {
                    id: format!("link-{}-{}", src_dpid, dst_dpid),
                    from: format!("openflow:{}", src_dpid.trim_start_matches('0')),
                    to: format!("openflow:{}", dst_dpid.trim_start_matches('0')),
                    kind: "physical".to_string(),
                    realm: "physical".to_string(),
                });
            }
        }
    }

    if nodes.is_empty() {
        return mock::get_mock_topology();
    }

    TopologyResponse { nodes, links }
}

pub async fn fetch_sdn_topology() -> TopologyResponse {
    let sdn_type = std::env::var("SDN_TYPE").unwrap_or_else(|_| "ODL".to_string());
    if sdn_type == "RYU" {
        fetch_ryu_topology().await
    } else {
        fetch_odl_topology().await
    }
}

pub async fn get_sdn_topology() -> Json<TopologyResponse> {
    Json(fetch_sdn_topology().await)
}

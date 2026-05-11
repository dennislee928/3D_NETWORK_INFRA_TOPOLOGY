use axum::{
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing::info;

// --- Frontend Data Models ---

#[derive(Serialize, Deserialize, Debug, Clone)]
struct ServicePosition {
    x: f32,
    y: f32,
    z: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct ServiceNode {
    id: String,
    name: String,
    #[serde(rename = "type")]
    node_type: String,
    realm: String,
    layer: i32,
    status: String,
    position: ServicePosition,
    #[serde(rename = "riskScore")]
    risk_score: f32,
    metadata: HashMap<String, serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct ServiceLink {
    id: String,
    from: String,
    to: String,
    kind: String,
    realm: String,
}

#[derive(Serialize, Debug, Clone)]
struct TopologyResponse {
    nodes: Vec<ServiceNode>,
    links: Vec<ServiceLink>,
}

// --- ODL Data Models ---

#[derive(Deserialize, Debug)]
struct OdlNode {
    #[serde(rename = "node-id")]
    node_id: String,
    #[serde(rename = "termination-point")]
    termination_point: Option<Vec<serde_json::Value>>,
}

#[derive(Deserialize, Debug)]
struct OdlLink {
    #[serde(rename = "link-id")]
    link_id: String,
    source: OdlLinkEnd,
    destination: OdlLinkEnd,
}

#[derive(Deserialize, Debug)]
struct OdlLinkEnd {
    #[serde(rename = "source-node", alias = "dest-node")]
    node: String,
}

#[derive(Deserialize, Debug)]
struct OdlTopology {
    node: Option<Vec<OdlNode>>,
    link: Option<Vec<OdlLink>>,
}

#[derive(Deserialize, Debug)]
struct OdlResponse {
    #[serde(rename = "network-topology")]
    network_topology: OdlNetworkTopology,
}

#[derive(Deserialize, Debug)]
struct OdlNetworkTopology {
    topology: Vec<OdlTopology>,
}

// --- Logic ---

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
                        format!("Switch {}", node.node_id.split(':').nth(1).unwrap_or(""))
                    } else {
                        node.node_id.clone()
                    },
                    node_type: if is_switch { "switch".to_string() } else { "host".to_string() },
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

async fn get_sdn_topology() -> Json<TopologyResponse> {
    let sdn_type = std::env::var("SDN_TYPE").unwrap_or_else(|_| "ODL".to_string());
    
    if sdn_type == "RYU" {
        return get_ryu_topology().await;
    }

    let odl_url = std::env::var("ODL_URL").unwrap_or_else(|_| "http://localhost:8181".to_string());
    let client = reqwest::Client::new();

    match client
        .get(format!("{}/restconf/operational/network-topology:network-topology", odl_url))
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
                return Json(transform_odl(&odl_resp.network_topology));
            }
        }
        Err(_) => {}
    }

    Json(get_mock_topology())
}

async fn get_ryu_topology() -> Json<TopologyResponse> {
    let ryu_url = std::env::var("RYU_URL").unwrap_or_else(|_| "http://localhost:8080".to_string());
    let client = reqwest::Client::new();
    
    let mut nodes = Vec::new();
    let mut links = Vec::new();

    if let Ok(resp) = client.get(format!("{}/stats/switches", ryu_url)).send().await {
        if let Ok(switches) = resp.json::<Vec<u64>>().await {
            for (idx, dpid) in switches.iter().enumerate() {
                nodes.push(ServiceNode {
                    id: format!("openflow:{}", dpid),
                    name: format!("Switch {}", dpid),
                    node_type: "switch".to_string(),
                    realm: "physical".to_string(),
                    layer: 1,
                    status: "healthy".to_string(),
                    position: ServicePosition { x: (idx as f32) * 5.0, y: -10.0, z: 0.0 },
                    risk_score: 0.1,
                    metadata: HashMap::new(),
                });
            }
        }
    }

    if let Ok(resp) = client.get(format!("{}/v1.0/topology/links", ryu_url)).send().await {
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
        return Json(get_mock_topology());
    }

    Json(TopologyResponse { nodes, links })
}

fn get_mock_topology() -> TopologyResponse {
    let mut nodes = Vec::new();
    nodes.push(ServiceNode {
        id: "openflow:1".to_string(),
        name: "Mock Switch 1".to_string(),
        node_type: "switch".to_string(),
        realm: "physical".to_string(),
        layer: 1,
        status: "healthy".to_string(),
        position: ServicePosition { x: 0.0, y: -10.0, z: 0.0 },
        risk_score: 0.05,
        metadata: HashMap::new(),
    });
    TopologyResponse { nodes, links: Vec::new() }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let allowed_origins = std::env::var("ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:5173,http://localhost:3000".to_string());
    let origins: Vec<String> = allowed_origins.split(',').map(|s| s.trim().to_string()).collect();
    let cors = CorsLayer::new()
        .allow_origin(origins.iter().map(|s| s.parse::<axum::http::HeaderValue>().unwrap()).collect::<Vec<_>>())
        .allow_methods([axum::http::Method::GET, axum::http::Method::POST, axum::http::Method::OPTIONS])
        .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION]);
    let app = Router::new()
        .route("/", get(|| async { "SDN Adapter is running" }))
        .route("/health", get(|| async { "OK" }))
        .route("/api/v1/topology/sdn", get(get_sdn_topology))
        .layer(cors);

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|v| v.parse::<u16>().ok())
        .unwrap_or(4000);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("Rust SDN Adapter listening on {}", addr);
    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(l) => l,
        Err(e) => {
            tracing::error!("Failed to bind to {}: {}", addr, e);
            return;
        }
    };
    if let Err(e) = axum::serve(listener, app).await {
        tracing::error!("Server error: {}", e);
    }
}

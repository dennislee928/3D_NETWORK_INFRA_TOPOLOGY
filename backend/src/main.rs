use axum::{
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing::{info, warn};

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
        // Transform Nodes
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
                    layer: if is_switch { 1 } else { 2 },
                    status: "healthy".to_string(),
                    position: ServicePosition {
                        x: angle.cos() * 10.0,
                        y: -10.0,
                        z: angle.sin() * 10.0,
                    },
                    risk_score: 0.1, // Placeholder
                    metadata,
                });
            }
        }

        // Transform Links
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
    let odl_url = std::env::var("ODL_URL").unwrap_or_else(|_| "http://localhost:8181".to_string());
    let client = reqwest::Client::new();

    match client
        .get(format!("{}/restconf/operational/network-topology:network-topology", odl_url))
        .basic_auth("admin", Some("admin"))
        .header("Accept", "application/json")
        .send()
        .await
    {
        Ok(resp) => {
            if let Ok(odl_resp) = resp.json::<OdlResponse>().await {
                return Json(transform_odl(&odl_resp.network_topology));
            }
            warn!("Failed to parse ODL JSON, using mock data");
        }
        Err(e) => {
            warn!("Could not reach ODL: {}, using mock data", e);
        }
    }

    // Fallback Mock Data
    Json(get_mock_topology())
}

fn get_mock_topology() -> TopologyResponse {
    let mut nodes = Vec::new();
    let mut links = Vec::new();

    nodes.push(ServiceNode {
        id: "openflow:1".to_string(),
        name: "Switch 1".to_string(),
        node_type: "switch".to_string(),
        realm: "physical".to_string(),
        layer: 1,
        status: "healthy".to_string(),
        position: ServicePosition { x: 0.0, y: -10.0, z: 0.0 },
        risk_score: 0.05,
        metadata: HashMap::new(),
    });

    TopologyResponse { nodes, links }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(|| async { "SDN Adapter is running" }))
        .route("/health", get(|| async { "OK" }))
        .route("/api/v1/topology/sdn", get(get_sdn_topology))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    info!("Rust SDN Adapter listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

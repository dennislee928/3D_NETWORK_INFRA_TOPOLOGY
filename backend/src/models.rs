use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServicePosition {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServiceNode {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub node_type: String,
    pub realm: String,
    pub layer: i32,
    pub status: String,
    pub position: ServicePosition,
    #[serde(rename = "riskScore")]
    pub risk_score: f32,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServiceLink {
    pub id: String,
    pub from: String,
    pub to: String,
    pub kind: String,
    pub realm: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct TopologyResponse {
    pub nodes: Vec<ServiceNode>,
    pub links: Vec<ServiceLink>,
}

#[derive(Deserialize, Debug)]
pub struct OdlNode {
    #[serde(rename = "node-id")]
    pub node_id: String,
    #[serde(rename = "termination-point")]
    pub termination_point: Option<Vec<serde_json::Value>>,
}

#[derive(Deserialize, Debug)]
pub struct OdlLink {
    #[serde(rename = "link-id")]
    pub link_id: String,
    pub source: OdlLinkEnd,
    pub destination: OdlLinkEnd,
}

#[derive(Deserialize, Debug)]
pub struct OdlLinkEnd {
    #[serde(rename = "source-node", alias = "dest-node")]
    pub node: String,
}

#[derive(Deserialize, Debug)]
pub struct OdlTopology {
    pub node: Option<Vec<OdlNode>>,
    pub link: Option<Vec<OdlLink>>,
}

#[derive(Deserialize, Debug)]
pub struct OdlResponse {
    #[serde(rename = "network-topology")]
    pub network_topology: OdlNetworkTopology,
}

#[derive(Deserialize, Debug)]
pub struct OdlNetworkTopology {
    pub topology: Vec<OdlTopology>,
}

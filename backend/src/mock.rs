use crate::models::{ServiceNode, ServicePosition, TopologyResponse};
use std::collections::HashMap;

pub fn get_mock_topology() -> TopologyResponse {
    let mut nodes = Vec::new();
    nodes.push(ServiceNode {
        id: "openflow:1".to_string(),
        name: "Mock Switch 1".to_string(),
        node_type: "switch".to_string(),
        realm: "physical".to_string(),
        layer: 1,
        status: "healthy".to_string(),
        position: ServicePosition {
            x: 0.0,
            y: -10.0,
            z: 0.0,
        },
        risk_score: 0.05,
        metadata: HashMap::new(),
    });
    TopologyResponse {
        nodes,
        links: Vec::new(),
    }
}

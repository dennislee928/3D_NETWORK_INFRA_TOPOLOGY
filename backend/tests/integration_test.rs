use std::net::SocketAddr;
use tokio::net::TcpListener;

async fn spawn_app() -> SocketAddr {
    let app = backend::build_app();
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });
    addr
}

#[tokio::test]
async fn test_health() {
    let addr = spawn_app().await;
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("http://{}/health", addr))
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status(), 200);
    assert_eq!(resp.text().await.unwrap(), "OK");
}

#[tokio::test]
async fn test_topology_sdn() {
    let addr = spawn_app().await;
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("http://{}/api/v1/topology/sdn", addr))
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status(), 200);
    let body: serde_json::Value = resp.json().await.unwrap();
    assert!(
        body.get("nodes").is_some(),
        "Response should contain nodes"
    );
    assert!(
        body.get("links").is_some(),
        "Response should contain links"
    );
}

#[tokio::test]
async fn test_mock_data_fallback() {
    let addr = spawn_app().await;
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("http://{}/api/v1/topology/sdn", addr))
        .send()
        .await
        .unwrap();
    assert_eq!(resp.status(), 200);
    let body: serde_json::Value = resp.json().await.unwrap();
    let nodes = body["nodes"].as_array().unwrap();
    assert!(!nodes.is_empty(), "Should return mock nodes when SDN is unreachable");
}

#[tokio::test]
async fn test_cors_headers() {
    let addr = spawn_app().await;
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("http://{}/health", addr))
        .header("Origin", "http://localhost:5173")
        .send()
        .await
        .unwrap();
    assert!(
        resp.headers().get("access-control-allow-origin").is_some(),
        "CORS headers should be present"
    );
}

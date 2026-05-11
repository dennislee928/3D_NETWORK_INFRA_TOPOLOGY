pub mod auth;
pub mod cache;
pub mod metrics;
pub mod mock;
pub mod models;
pub mod rate_limiter;
pub mod sdn;
pub mod validation;
pub mod ws;

use axum::{middleware, routing::get, Extension, Router};
use std::net::SocketAddr;
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;
use tracing::info;

pub fn build_app() -> Router {
    let allowed_origins = std::env::var("ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:5173,http://localhost:3000".to_string());
    let origins: Vec<String> = allowed_origins
        .split(',')
        .map(|s| s.trim().to_string())
        .collect();
    let cors = CorsLayer::new()
        .allow_origin(
            origins
                .iter()
                .map(|s| s.parse::<axum::http::HeaderValue>().unwrap())
                .collect::<Vec<_>>(),
        )
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::OPTIONS,
        ])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ]);

    let (tx, _rx) = broadcast::channel::<String>(100);
    ws::spawn_topology_broadcast(tx.clone());

    let api_routes = Router::new()
        .route("/api/v1/topology/sdn", get(sdn::get_sdn_topology))
        .layer(middleware::from_fn(auth::auth_middleware))
        .layer(middleware::from_fn(validation::validation_middleware));

    Router::new()
        .route("/", get(|| async { "SDN Adapter is running" }))
        .route("/health", get(|| async { "OK" }))
        .route("/metrics", get(metrics::metrics_handler))
        .route("/ws/topology", get(ws::ws_handler))
        .merge(api_routes)
        .layer(Extension(tx))
        .layer(middleware::from_fn(metrics::metrics_middleware))
        .layer(cors)
        .layer(middleware::from_fn(rate_limiter::rate_limit_middleware))
}

pub async fn start() {
    tracing_subscriber::fmt::init();
    let app = build_app();

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

use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

pub async fn auth_middleware(
    req: Request,
    next: Next,
) -> Response {
    let api_token = match std::env::var("API_TOKEN") {
        Ok(t) if !t.is_empty() => t,
        _ => return next.run(req).await,
    };

    let auth_header = req
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if auth_header != format!("Bearer {}", api_token) {
        return (StatusCode::UNAUTHORIZED, "Unauthorized").into_response();
    }

    next.run(req).await
}

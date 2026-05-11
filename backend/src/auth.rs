use axum::http::{Request, Response, StatusCode};
use axum::middleware::Next;

pub async fn auth_middleware<B>(
    req: Request<B>,
    next: Next<B>,
) -> Result<Response<B>, StatusCode> {
    let api_token = match std::env::var("API_TOKEN") {
        Ok(t) if !t.is_empty() => t,
        _ => return Ok(next.run(req).await),
    };

    let auth_header = req
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if auth_header != format!("Bearer {}", api_token) {
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(next.run(req).await)
}

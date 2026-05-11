use axum::http::{Request, Response, StatusCode};
use axum::middleware::Next;

pub async fn validation_middleware<B>(
    req: Request<B>,
    next: Next<B>,
) -> Result<Response<B>, StatusCode> {
    let uri = req.uri().to_string();
    let uri_lower = uri.to_lowercase();

    if uri_lower.contains("..")
        || uri_lower.contains("%2e")
        || uri_lower.contains("~")
        || uri_lower.contains("//..")
    {
        return Err(StatusCode::BAD_REQUEST);
    }

    Ok(next.run(req).await)
}

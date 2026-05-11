use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

pub async fn validation_middleware(
    req: Request,
    next: Next,
) -> Response {
    let uri = req.uri().to_string();
    let uri_lower = uri.to_lowercase();

    if uri_lower.contains("..")
        || uri_lower.contains("%2e")
        || uri_lower.contains("~")
        || uri_lower.contains("//..")
    {
        return (StatusCode::BAD_REQUEST, "Bad Request").into_response();
    }

    next.run(req).await
}

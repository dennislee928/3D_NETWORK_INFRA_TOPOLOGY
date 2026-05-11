use axum::http::{Request, Response, StatusCode};
use axum::middleware::Next;
use std::sync::atomic::{AtomicI64, AtomicU64, Ordering};

static REQUEST_COUNT: AtomicU64 = AtomicU64::new(0);
static ACTIVE_CONNECTIONS: AtomicU64 = AtomicU64::new(0);
static LAST_REQUEST_TIMESTAMP: AtomicI64 = AtomicI64::new(0);

pub fn increment_request_count() {
    REQUEST_COUNT.fetch_add(1, Ordering::SeqCst);
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64;
    LAST_REQUEST_TIMESTAMP.store(now, Ordering::SeqCst);
}

pub fn increment_active_connections() {
    ACTIVE_CONNECTIONS.fetch_add(1, Ordering::SeqCst);
}

pub fn decrement_active_connections() {
    ACTIVE_CONNECTIONS.fetch_sub(1, Ordering::SeqCst);
}

pub async fn metrics_handler() -> String {
    let count = REQUEST_COUNT.load(Ordering::SeqCst);
    let active = ACTIVE_CONNECTIONS.load(Ordering::SeqCst);
    let last_ts = LAST_REQUEST_TIMESTAMP.load(Ordering::SeqCst);

    let last_human = if last_ts > 0 {
        chrono::DateTime::from_timestamp(last_ts, 0)
            .map(|dt| dt.format("%Y-%m-%d %H:%M:%S UTC").to_string())
            .unwrap_or_else(|| "error".to_string())
    } else {
        "never".to_string()
    };

    format!(
        "# HELP http_requests_total Total HTTP requests\n\
         # TYPE http_requests_total counter\n\
         http_requests_total {}\n\
         # HELP active_connections Current active connections\n\
         # TYPE active_connections gauge\n\
         active_connections {}\n\
         # HELP last_request_timestamp Last request timestamp\n\
         # TYPE last_request_timestamp gauge\n\
         last_request_timestamp {}\n\
         last_request_human {}\n",
        count, active, last_ts, last_human
    )
}

pub async fn metrics_middleware<B>(
    req: Request<B>,
    next: Next<B>,
) -> Result<Response<B>, StatusCode> {
    increment_request_count();
    Ok(next.run(req).await)
}

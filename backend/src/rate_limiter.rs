use axum::http::{Request, StatusCode};
use axum::response::{IntoResponse, Response};
use std::collections::HashMap;
use std::future::Future;
use std::pin::Pin;
use std::sync::{Mutex, OnceLock};
use std::task::{Context, Poll};
use std::time::{Duration, Instant};
use tower::{Layer, Service};

const MAX_REQUESTS: usize = 100;
const WINDOW_SECS: u64 = 60;

struct RateLimitStore {
    requests: HashMap<String, Vec<Instant>>,
    last_cleanup: Instant,
}

impl RateLimitStore {
    fn new() -> Self {
        Self {
            requests: HashMap::new(),
            last_cleanup: Instant::now(),
        }
    }

    fn check_and_record(&mut self, ip: &str) -> bool {
        let now = Instant::now();
        let window = Duration::from_secs(WINDOW_SECS);
        let entry = self.requests.entry(ip.to_string()).or_default();
        entry.retain(|t| now.saturating_duration_since(*t) < window);
        if entry.len() >= MAX_REQUESTS {
            false
        } else {
            entry.push(now);
            true
        }
    }

    fn cleanup_old(&mut self) {
        let now = Instant::now();
        if now.duration_since(self.last_cleanup).as_secs() < 60 {
            return;
        }
        self.last_cleanup = now;
        let window = Duration::from_secs(WINDOW_SECS);
        self.requests.retain(|_, times| {
            times.retain(|t| now.saturating_duration_since(*t) < window);
            !times.is_empty()
        });
    }
}

static STORE: OnceLock<Mutex<RateLimitStore>> = OnceLock::new();

fn get_store() -> &'static Mutex<RateLimitStore> {
    STORE.get_or_init(|| Mutex::new(RateLimitStore::new()))
}

#[derive(Clone)]
pub struct RateLimitLayer;

impl<S> Layer<S> for RateLimitLayer {
    type Service = RateLimitService<S>;

    fn layer(&self, inner: S) -> Self::Service {
        RateLimitService { inner }
    }
}

#[derive(Clone)]
pub struct RateLimitService<S> {
    inner: S,
}

impl<S> Service<Request<axum::body::Body>> for RateLimitService<S>
where
    S: Service<Request<axum::body::Body>, Response = Response> + Clone + Send + 'static,
    S::Future: Send,
{
    type Response = Response;
    type Error = S::Error;
    type Future =
        Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, req: Request<axum::body::Body>) -> Self::Future {
        let ip = req
            .headers()
            .get("X-Forwarded-For")
            .and_then(|v| v.to_str().ok())
            .and_then(|v| v.split(',').next().map(|s| s.trim().to_string()))
            .unwrap_or_else(|| "unknown".to_string());

        let allowed = {
            let mut store = match get_store().lock() {
                Ok(s) => s,
                Err(_) => return Box::pin(async { panic!("rate limiter lock error") }),
            };
            store.cleanup_old();
            store.check_and_record(&ip)
        };

        if allowed {
            let fut = self.inner.call(req);
            Box::pin(async move { fut.await })
        } else {
            let resp = (StatusCode::TOO_MANY_REQUESTS, "Too Many Requests").into_response();
            Box::pin(async move { Ok(resp) })
        }
    }
}

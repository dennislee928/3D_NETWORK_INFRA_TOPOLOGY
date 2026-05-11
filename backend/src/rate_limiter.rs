use axum::http::{Request, Response, StatusCode};
use axum::middleware::Next;
use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
use std::time::{Duration, Instant};

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
        entry.retain(|t| now.duration_since(*t).unwrap_or(Duration::ZERO) < window);
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
        self.requests
            .retain(|_, times| {
                times.retain(|t| now.duration_since(*t).unwrap_or(Duration::ZERO) < window);
                !times.is_empty()
            });
    }
}

static STORE: OnceLock<Mutex<RateLimitStore>> = OnceLock::new();

fn get_store() -> &'static Mutex<RateLimitStore> {
    STORE.get_or_init(|| Mutex::new(RateLimitStore::new()))
}

pub async fn rate_limit_middleware<B>(
    req: Request<B>,
    next: Next<B>,
) -> Result<Response<B>, StatusCode> {
    let ip = req
        .headers()
        .get("X-Forwarded-For")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.split(',').next().map(|s| s.trim().to_string()))
        .unwrap_or_else(|| "unknown".to_string());

    let mut store = get_store().lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    store.cleanup_old();

    if !store.check_and_record(&ip) {
        return Err(StatusCode::TOO_MANY_REQUESTS);
    }

    Ok(next.run(req).await)
}

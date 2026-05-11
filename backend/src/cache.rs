use crate::models::TopologyResponse;
use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

struct CacheEntry {
    data: TopologyResponse,
    inserted_at: Instant,
}

pub struct TopologyCache {
    store: Mutex<HashMap<String, CacheEntry>>,
}

impl TopologyCache {
    pub fn new() -> Self {
        Self {
            store: Mutex::new(HashMap::new()),
        }
    }

    pub fn get(&self, key: &str, ttl: Duration) -> Option<TopologyResponse> {
        let store = self.store.lock().ok()?;
        store.get(key).and_then(|entry| {
            if entry.inserted_at.elapsed() < ttl {
                Some(entry.data.clone())
            } else {
                None
            }
        })
    }

    pub fn set(&self, key: String, data: TopologyResponse) {
        if let Ok(mut store) = self.store.lock() {
            store.insert(
                key,
                CacheEntry {
                    data,
                    inserted_at: Instant::now(),
                },
            );
        }
    }

    pub fn cleanup(&self, ttl: Duration) {
        if let Ok(mut store) = self.store.lock() {
            store.retain(|_, entry| entry.inserted_at.elapsed() < ttl);
        }
    }
}

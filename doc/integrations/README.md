# Integrations — Axiom Topology

The Axiom Topology platform supports two integration mechanisms for extending
functionality and connecting to external monitoring/alerting systems:

- **Webhooks** — Outbound HTTP callbacks when events occur (alerts, topology changes, health status changes).
- **Plugins** — In-process extensions that run custom logic within the backend.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Axiom Topology Backend              │
│                                                   │
│  ┌──────────┐   ┌───────────┐   ┌────────────┐  │
│  │ Event     │──▶│ Webhook   │──▶│ Slack,     │  │
│  │ Emitter   │   │ Dispatcher│   │ PagerDuty, │  │
│  │           │   │           │   │ Custom URL │  │
│  └──────────┘   └───────────┘   └────────────┘  │
│                                                   │
│  ┌──────────┐   ┌───────────┐                    │
│  │ Plugin   │──▶│ Custom    │                    │
│  │ Manager  │   │ Logic     │                    │
│  └──────────┘   └───────────┘                    │
└─────────────────────────────────────────────────┘
```

## Adding a New Webhook

Webhooks are configured via environment variables or the ConfigMap:

```yaml
# Example webhook config
WEBHOOK_URLS=https://hooks.slack.com/services/xxx,your-pagerduty-url
WEBHOOK_EVENTS=alert,topology_change,health_status
```

### Webhook Payload Format

All webhooks POST a JSON payload conforming to the schema at
`webhook-schema.json`. The payload structure varies by event type.

## Webhook Examples

### Slack Notifier

```python
import requests
import json

def notify_slack(webhook_url, event):
    """Send a topology event to a Slack channel."""
    color = {"healthy": "#36a64f", "degraded": "#ffcc00", "down": "#ff0000"}
    status = event.get("status", "unknown")
    payload = {
        "attachments": [{
            "color": color.get(status, "#cccccc"),
            "title": f"Topology Alert: {event.get('node_name', 'Unknown')}",
            "text": (
                f"*Node:* {event.get('node_name')} ({event.get('node_id')})\n"
                f"*Status:* {status}\n"
                f"*Risk Score:* {event.get('risk_score', 'N/A')}\n"
                f"*Type:* {event.get('event_type')}"
            ),
            "footer": "Axiom Topology"
        }]
    }
    requests.post(webhook_url, json=payload)
```

### PagerDuty Integration

```python
import requests
import json

def notify_pagerduty(routing_key, event):
    """Trigger a PagerDuty incident from a topology event."""
    payload = {
        "routing_key": routing_key,
        "event_action": "trigger",
        "payload": {
            "summary": f"Topology Alert: {event.get('node_name')} is {event.get('status')}",
            "severity": "critical" if event.get("status") == "down" else "warning",
            "source": f"axiom-topology/{event.get('node_id')}",
            "custom_details": event
        }
    }
    requests.post(
        "https://events.pagerduty.com/v2/enqueue",
        json=payload
    )
```

## Plugin System

Plugins are shared libraries (`.so` / `.dylib`) that implement a simple interface.
Each plugin is loaded at startup and receives events through a registered callback.

### Plugin Interface (Rust)

```rust
#[derive(Serialize, Deserialize)]
pub struct PluginEvent {
    pub event_type: String,        // "alert" | "topology_change" | "health_status"
    pub timestamp: String,
    pub node_id: Option<String>,
    pub node_name: Option<String>,
    pub status: Option<String>,
    pub risk_score: Option<f32>,
    pub payload: serde_json::Value,
}

pub trait TopologyPlugin: Send + Sync {
    fn name(&self) -> &'static str;
    fn on_event(&self, event: &PluginEvent) -> Result<(), String>;
}
```

### Plugin Loading

```rust
// libloading example
let lib = unsafe { libloading::Library::new("plugins/my_plugin.dylib") }?;
let plugin: libloading::Symbol<fn() -> Box<dyn TopologyPlugin>> =
    unsafe { lib.get(b"create_plugin") }?;
let plugin_instance = plugin();
```

## Event Types

| Event Type       | Description                        | Trigger Condition               |
|------------------|------------------------------------|----------------------------------|
| `alert`          | A rule was triggered               | Risk score threshold exceeded   |
| `topology_change`| Topology structure changed         | Node added/removed, link changed|
| `health_status`  | Node health status changed         | Status transition (healthy↔degraded↔down) |

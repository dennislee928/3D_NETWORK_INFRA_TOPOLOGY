# Demo Data — Axiom Topology

This directory contains `demo-data.json`, a realistic pre-loaded topology dataset
used to showcase the Axiom Topology platform without requiring a live SDN controller (Ryu/ODL).

## How Demo Mode Works

Set the `DEMO_MODE=1` environment variable on the Rust backend to enable demo mode:

```bash
# Local development
DEMO_MODE=1 cargo run

# Docker Compose
DEMO_MODE=1 docker compose up -d
```

When `DEMO_MODE=1` is set:
1. The backend serves the seeded topology from `demo-data.json` instead of querying Ryu/ODL.
2. The frontend receives a rich 30+ node, 40+ link topology with realistic health metrics.
3. Risk scores fluctuate randomly every 5 seconds (simulating real-time monitoring).
4. The dashboard overview endpoint returns synthetic incident and command data.

## Loading Demo Data Manually

If not using `DEMO_MODE`, you can inject demo data via the API:

```bash
# POST the demo data to the backend (requires API token if auth is enabled)
curl -X POST http://localhost:4000/api/v1/demo/load \
  -H "Content-Type: application/json" \
  -d @doc/demo-data.json
```

## What You Will See

| Layer | Nodes | Description |
|-------|-------|-------------|
| Service (top) | 3 gateways, 2 brokers, 1 rule engine, 1 intel hub, 1 profile manager, 2 databases, 8 inference models | Application-layer services with health metrics, latency, error rates |
| Virtual (middle) | 3 OVS virtual switches | Software-defined virtual switching layer |
| Physical (bottom) | 5 physical switches, 2 controllers, 10 hosts | Hardware topology with bandwidth utilization and CPU metrics |

Key behaviors to observe:
- **Risk score animation**: Switch and rule-engine nodes change color over time
- **Status propagation**: Degraded nodes (sw-edge-01, ovs-virt-03, rule-engine-axiom) appear orange/red
- **Cross-layer links**: A logical link connects the Main API Gateway to OVS Virtual 02
- **Inference model variety**: 8 models with different latency and error profiles

## Data File Structure

```json
{
  "nodes": [
    { "id": "...", "name": "...", "type": "...", "layer": 1-3,
      "realm": "physical|virtual|service", "status": "healthy|degraded|down",
      "position": { "x": ..., "y": ..., "z": ... },
      "riskScore": 0.0-1.0,
      "health": { "latencyMs": ..., "errorRate": ..., "cpuUsage": ..., ... }
    }
  ],
  "links": [
    { "id": "...", "from": "...", "to": "...", "kind": "...",
      "realm": "...", "bandwidth": ..., "utilization": ... }
  ]
}
```

## Customizing Demo Data

Edit `doc/demo-data.json` to add/remove nodes and links. The format matches
the `TopologyResponse` schema documented in `doc/api-spec.yaml`.

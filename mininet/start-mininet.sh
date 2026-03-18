#!/bin/sh
set -eu

mkdir -p /var/run/openvswitch /var/log/openvswitch /var/lib/openvswitch

# Start the packaged OVS service to create the database/socket layout.
service openvswitch-switch start >/tmp/openvswitch-start.log 2>&1 || true

# Docker Desktop kernels usually do not expose the openvswitch module, so
# explicitly start ovs-vswitchd in userspace when the service script leaves it down.
if ! pidof ovs-vswitchd >/dev/null 2>&1; then
    ovs-vswitchd unix:/var/run/openvswitch/db.sock --pidfile --detach --log-file
fi

# If requested, auto-start Mininet topology and keep it running.
# Use env vars so this works both locally (docker-compose) and in CI.
if [ "${AUTO_MININET:-0}" = "1" ]; then
    RYU_HOST="${RYU_HOST:-ryu}"
    RYU_OF_PORT="${RYU_OF_PORT:-6633}"
    MININET_TOPO="${MININET_TOPO:-tree,depth=5,fanout=5}"
    RYU_REST_PORT="${RYU_REST_PORT:-8080}"

    #region agent log
    ts="$(date +%s000 2>/dev/null || true)"
    if [ -n "${ts}" ]; then
        printf '%s\n' "{\"sessionId\":\"b8e93d\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H1\",\"location\":\"mininet/start-mininet.sh:26\",\"message\":\"Auto-starting Mininet topology\",\"data\":{\"ryuHost\":\"${RYU_HOST}\",\"ryuOfPort\":${RYU_OF_PORT},\"mininetTopo\":\"${MININET_TOPO}\",\"ryuRest\":\"http://${RYU_HOST}:${RYU_REST_PORT}\"},\"timestamp\":${ts}}" >> "/Users/dennis_leedennis_lee/Documents/GitHub/3D_NETWORK_INFRA_TOPOLOGY/.cursor/debug-b8e93d.log" 2>/dev/null || true
    fi
    #endregion agent log

    # Optional runtime verification (best-effort; no secrets).
    curl -fsS "http://${RYU_HOST}:${RYU_REST_PORT}/v1.0/topology/nodes" >/tmp/ryu-topology-nodes.json 2>/dev/null || true
    curl -fsS "http://${RYU_HOST}:${RYU_REST_PORT}/v1.0/topology/links" >/tmp/ryu-topology-links.json 2>/dev/null || true

    exec mn --controller="remote,ip=${RYU_HOST},port=${RYU_OF_PORT}" --topo="${MININET_TOPO}"
fi

exec "$@"

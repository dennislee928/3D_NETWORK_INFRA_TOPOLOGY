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

    # Optional runtime verification (best-effort; no secrets).
    curl -fsS "http://${RYU_HOST}:${RYU_REST_PORT}/v1.0/topology/nodes" >/tmp/ryu-topology-nodes.json 2>/dev/null || true
    curl -fsS "http://${RYU_HOST}:${RYU_REST_PORT}/v1.0/topology/links" >/tmp/ryu-topology-links.json 2>/dev/null || true

    exec mn --controller="remote,ip=${RYU_HOST},port=${RYU_OF_PORT}" --topo="${MININET_TOPO}"
fi

exec "$@"

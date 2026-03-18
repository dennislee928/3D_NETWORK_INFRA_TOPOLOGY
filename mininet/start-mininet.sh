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

exec "$@"

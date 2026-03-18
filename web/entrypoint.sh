#!/bin/sh
set -eu

# Ensure we always have a concrete URL for proxy_pass so nginx won't treat
# ${SDN_ADAPTER_URL} as an nginx variable when envsubst doesn't replace it.
if [ -z "${SDN_ADAPTER_URL:-}" ]; then
  if [ -n "${SDN_ADAPTER_HOSTPORT:-}" ]; then
    SDN_ADAPTER_URL="http://${SDN_ADAPTER_HOSTPORT}"
  else
    SDN_ADAPTER_URL="http://127.0.0.1:10000"
  fi
fi
export SDN_ADAPTER_URL

envsubst '$SDN_ADAPTER_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'


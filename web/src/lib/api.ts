

import type { DashboardOverviewResponse } from "../types/dashboard";
import type { TopologyResponse } from "../types/topology";

interface RawTopologyResponse {
  nodes: Array<{
    id: string;
    name: string;
    type: TopologyResponse["nodes"][number]["type"];
    layer: number;
    status: TopologyResponse["nodes"][number]["status"];
    risk_score?: number;
    position?: { x: number; y: number; z: number };
    health?: {
      latency_ms?: number;
      error_rate?: number;
      last_deploy?: string;
      region?: string;
      incident_count?: number;
      command_count?: number;
    };
  }>;
  links: TopologyResponse["links"];
}

// #region agent log
function agentLog(hypothesisId: string, location: string, message: string, data: Record<string, unknown>) {
  fetch("http://127.0.0.1:7293/ingest/66d8e5aa-62df-4dc2-b960-1a0de6597420", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "b61a46"
    },
    body: JSON.stringify({
      sessionId: "b61a46",
      runId: "pre-fix-fe",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now()
    })
  }).catch(() => {});
}
// #endregion

function baseUrl() {
  return "https://axiom-rule-siem-engine-0z43.onrender.com";
}

function apiUrl(path: string) {
  const prefix = baseUrl();
  const versionedPath = `/api/v1${path}`;
  return prefix ? `${prefix}${versionedPath}` : versionedPath;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  agentLog("A", "web/src/lib/api.ts:fetchJson", "request_start", {
    path,
    url: apiUrl(path),
    hasInit: Boolean(init)
  });
  const response = await fetch(apiUrl(path), {
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  agentLog("A", "web/src/lib/api.ts:fetchJson", "response", {
    path,
    url: apiUrl(path),
    ok: response.ok,
    status: response.status
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getDashboardOverview() {
  return fetchJson<DashboardOverviewResponse>("/dashboard/overview");
}

export async function getSDNTopology(): Promise<TopologyResponse> {
  const configuredAdapterUrl = (import.meta as any).env?.VITE_SDN_ADAPTER_URL as string | undefined;
  const adapterUrl = configuredAdapterUrl ?? ((import.meta as any).env?.DEV ? "http://localhost:4000" : "");
  const topologyUrl = adapterUrl ? `${adapterUrl}/api/v1/topology/sdn` : "/api/v1/topology/sdn";
  
  try {
    agentLog("B", "web/src/lib/api.ts:getSDNTopology", "request_start", {
      adapterUrl,
      url: topologyUrl
    });
    const response = await fetch(topologyUrl);
    if (response.ok) {
      const json = await response.json();
      agentLog("B", "web/src/lib/api.ts:getSDNTopology", "response_ok", {
        status: response.status,
        nodes: Array.isArray((json as any)?.nodes) ? (json as any).nodes.length : null,
        links: Array.isArray((json as any)?.links) ? (json as any).links.length : null
      });
      return json;
    }
    agentLog("B", "web/src/lib/api.ts:getSDNTopology", "response_not_ok", {
      status: response.status
    });
  } catch (e) {
    agentLog("B", "web/src/lib/api.ts:getSDNTopology", "fetch_failed", {
      error: e instanceof Error ? e.message : String(e)
    });
    console.warn("SDN Adapter not reachable, using fallback mock data.");
  }

  // Fallback Mock Data
  return {
    nodes: [
      {
        id: "sdn-controller",
        name: "ODL Controller",
        type: "controller",
        layer: 0,
        realm: "physical",
        status: "healthy",
        position: { x: 0, y: -8, z: 0 },
        metadata: { version: "Boron-SR4", role: "leader" }
      },
      {
        id: "sw-core-01",
        name: "Core Switch 01",
        type: "switch",
        layer: 1,
        realm: "physical",
        status: "healthy",
        position: { x: -5, y: -4, z: 0 },
        riskScore: 0.12,
        health: { bandwidthUsage: 0.45, cpuUsage: 0.3 }
      },
      {
        id: "sw-core-02",
        name: "Core Switch 02",
        type: "switch",
        layer: 1,
        realm: "physical",
        status: "healthy",
        position: { x: 5, y: -4, z: 0 },
        riskScore: 0.08,
        health: { bandwidthUsage: 0.38, cpuUsage: 0.25 }
      },
      {
        id: "sw-edge-01",
        name: "Edge Switch 01",
        type: "switch",
        layer: 2,
        realm: "physical",
        status: "degraded",
        position: { x: -8, y: -2, z: 5 },
        riskScore: 0.55,
        health: { bandwidthUsage: 0.88, cpuUsage: 0.72 }
      },
      {
        id: "ovs-virt-01",
        name: "OVS Virtual 01",
        type: "switch",
        layer: 3,
        realm: "virtual",
        status: "healthy",
        position: { x: -10, y: 2, z: 8 },
        riskScore: 0.2
      }
    ],
    links: [
      { id: "link-c-s1", from: "sdn-controller", to: "sw-core-01", kind: "logical", realm: "physical" },
      { id: "link-c-s2", from: "sdn-controller", to: "sw-core-02", kind: "logical", realm: "physical" },
      { id: "link-s1-s2", from: "sw-core-01", to: "sw-core-02", kind: "physical", realm: "physical" },
      { id: "link-s1-e1", from: "sw-core-01", to: "sw-edge-01", kind: "physical", realm: "physical" },
      { id: "link-e1-v1", from: "sw-edge-01", to: "ovs-virt-01", kind: "logical", realm: "virtual" }
    ]
  };
}

export async function getTopologyServices() {
  agentLog("A", "web/src/lib/api.ts:getTopologyServices", "request_start", {
    url: apiUrl("/topology/services")
  });
  const raw = await fetchJson<RawTopologyResponse>("/topology/services");
  agentLog("A", "web/src/lib/api.ts:getTopologyServices", "response_ok", {
    nodes: raw?.nodes?.length ?? null,
    links: raw?.links?.length ?? null
  });

  return {
    nodes: raw.nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      layer: node.layer,
      status: node.status,
      riskScore: node.risk_score,
      position: node.position,
      health: node.health
        ? {
            latencyMs: node.health.latency_ms,
            errorRate: node.health.error_rate,
            lastDeploy: node.health.last_deploy,
            region: node.health.region,
            incidentCount: node.health.incident_count,
            commandCount: node.health.command_count
          }
        : undefined
    })),
    links: raw.links
  } satisfies TopologyResponse;
}

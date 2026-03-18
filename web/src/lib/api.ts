

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

function baseUrl() {
  return "https://axiom-rule-siem-engine-0z43.onrender.com";
}

function apiUrl(path: string) {
  const prefix = baseUrl();
  const versionedPath = `/api/v1${path}`;
  return prefix ? `${prefix}${versionedPath}` : versionedPath;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getDashboardOverview() {
  return fetchJson<DashboardOverviewResponse>("/dashboard/overview");
}

export async function getTopologyServices() {
  const raw = await fetchJson<RawTopologyResponse>("/topology/services");

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

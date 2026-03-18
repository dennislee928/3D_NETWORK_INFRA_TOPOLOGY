export type ServiceStatus = "healthy" | "degraded" | "down";

export type ServiceType =
  | "gateway"
  | "rule-engine"
  | "inference"
  | "db"
  | "queue"
  | "agent"
  | "switch"
  | "host"
  | "controller"
  | "other";

export type TopologyRealm = "physical" | "virtual" | "service";

export interface ServiceHealth {
  latencyMs?: number;
  errorRate?: number;
  lastDeploy?: string;
  region?: string;
  incidentCount?: number;
  commandCount?: number;
  cpuUsage?: number;
  memoryUsage?: number;
  bandwidthUsage?: number;
}

export interface ServicePosition {
  x: number;
  y: number;
  z: number;
}

export interface ServiceNode {
  id: string;
  name: string;
  type: ServiceType;
  layer: number;
  realm?: TopologyRealm;
  status: ServiceStatus;
  health?: ServiceHealth;
  riskScore?: number;
  position?: ServicePosition;
  metadata?: Record<string, string | number | boolean>;
}

export type LinkKind = "http" | "amqp" | "mqtt" | "inference" | "db" | "stream" | "physical" | "logical";

export interface ServiceLink {
  id: string;
  from: string;
  to: string;
  kind: LinkKind;
  realm?: TopologyRealm;
  bandwidth?: number;
  utilization?: number;
}

export interface TopologyResponse {
  nodes: ServiceNode[];
  links: ServiceLink[];
}

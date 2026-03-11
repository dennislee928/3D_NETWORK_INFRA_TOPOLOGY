export type ServiceStatus = "healthy" | "degraded" | "down";

export type ServiceType =
  | "gateway"
  | "rule-engine"
  | "inference"
  | "db"
  | "queue"
  | "agent"
  | "other";

export interface ServiceHealth {
  latencyMs?: number;
  errorRate?: number;
  lastDeploy?: string;
  region?: string;
  incidentCount?: number;
  commandCount?: number;
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
  status: ServiceStatus;
  health?: ServiceHealth;
  riskScore?: number;
  position?: ServicePosition;
}

export type LinkKind = "http" | "amqp" | "mqtt" | "inference" | "db" | "stream";

export interface ServiceLink {
  id: string;
  from: string;
  to: string;
  kind: LinkKind;
}

export interface TopologyResponse {
  nodes: ServiceNode[];
  links: ServiceLink[];
}

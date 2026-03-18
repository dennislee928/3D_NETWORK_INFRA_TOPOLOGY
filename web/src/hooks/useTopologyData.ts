import { useEffect, useState } from "react";
import { getTopologyServices } from "../lib/api";
import type { ServiceLink, ServiceNode, TopologyResponse } from "../types/topology";

export interface TopologyState {
  nodes: ServiceNode[];
  links: ServiceLink[];
  loading: boolean;
  error: string | null;
  /** True when showing FALLBACK_TOPOLOGY (API error or API returned 0 services). */
  usingMockData: boolean;
}

const FALLBACK_TOPOLOGY: TopologyResponse = {
  nodes: [
    {
      id: "edge-gateway",
      name: "Edge Gateway",
      type: "gateway",
      layer: 1,
      status: "healthy",
      position: { x: -10, y: 0, z: 0 }
    },
    {
      id: "ingest-gateway",
      name: "Ingest Gateway",
      type: "gateway",
      layer: 1,
      status: "healthy",
      position: { x: -6, y: 0, z: -2 }
    },
    {
      id: "broker",
      name: "Message Broker",
      type: "queue",
      layer: 1,
      status: "healthy",
      position: { x: -2, y: 0, z: 2 }
    },
    {
      id: "axiom",
      name: "Axiom Rule Engine",
      type: "rule-engine",
      layer: 2,
      status: "degraded",
      riskScore: 0.62,
      position: { x: 0, y: 4, z: 0 },
      health: { latencyMs: 42, errorRate: 0.04, region: "core" }
    },
    {
      id: "intel-hub",
      name: "Intel Hub",
      type: "other",
      layer: 2,
      status: "healthy",
      position: { x: -6, y: 4, z: 4 }
    },
    {
      id: "profile-manager",
      name: "Profile Manager",
      type: "other",
      layer: 2,
      status: "healthy",
      position: { x: 6, y: 4, z: -4 }
    },
    {
      id: "inference-hmm-beth",
      name: "HMM BETH",
      type: "inference",
      layer: 3,
      status: "healthy",
      riskScore: 0.19,
      position: { x: -8, y: 8, z: 0 }
    },
    {
      id: "inference-iforest-kdd99",
      name: "IForest KDD99",
      type: "inference",
      layer: 3,
      status: "healthy",
      riskScore: 0.24,
      position: { x: -3, y: 8, z: -4 }
    },
    {
      id: "inference-lstm-cicids",
      name: "LSTM CICIDS",
      type: "inference",
      layer: 3,
      status: "healthy",
      riskScore: 0.21,
      position: { x: 3, y: 8, z: 4 }
    },
    {
      id: "inference-autoencoder-unsw",
      name: "AE UNSW",
      type: "inference",
      layer: 3,
      status: "healthy",
      riskScore: 0.18,
      position: { x: 8, y: 8, z: 0 }
    }
  ],
  links: [
    { id: "edge-ingest", from: "edge-gateway", to: "ingest-gateway", kind: "http" },
    { id: "ingest-broker", from: "ingest-gateway", to: "broker", kind: "amqp" },
    { id: "broker-axiom", from: "broker", to: "axiom", kind: "stream" },
    { id: "axiom-intel", from: "axiom", to: "intel-hub", kind: "http" },
    { id: "axiom-profile", from: "axiom", to: "profile-manager", kind: "http" },
    { id: "axiom-hmm", from: "axiom", to: "inference-hmm-beth", kind: "inference" },
    { id: "axiom-iforest", from: "axiom", to: "inference-iforest-kdd99", kind: "inference" },
    { id: "axiom-lstm", from: "axiom", to: "inference-lstm-cicids", kind: "inference" },
    { id: "axiom-ae", from: "axiom", to: "inference-autoencoder-unsw", kind: "inference" }
  ]
};

export function useTopologyData(): TopologyState {
  const [state, setState] = useState<TopologyState>({
    nodes: [],
    links: [],
    loading: true,
    error: null,
    usingMockData: false
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null, usingMockData: false }));
        const topology = await getTopologyServices();
        if (controller.signal.aborted) return;
        const noServices = !topology.nodes?.length && !topology.links?.length;
        if (noServices) {
          setState({
            nodes: FALLBACK_TOPOLOGY.nodes,
            links: FALLBACK_TOPOLOGY.links,
            loading: false,
            error: null,
            usingMockData: true
          });
        } else {
          setState({
            nodes: topology.nodes,
            links: topology.links,
            loading: false,
            error: null,
            usingMockData: false
          });
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : String(error);
        setState({
          nodes: FALLBACK_TOPOLOGY.nodes,
          links: FALLBACK_TOPOLOGY.links,
          loading: false,
          error: message,
          usingMockData: true
        });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return state;
}

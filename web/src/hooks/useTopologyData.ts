import { useEffect, useState } from "react";
import type { ServiceLink, ServiceNode, TopologyResponse } from "../types/topology";

interface TopologyState {
  nodes: ServiceNode[];
  links: ServiceLink[];
  loading: boolean;
  error: string | null;
}

const MOCK_TOPOLOGY: TopologyResponse = {
  nodes: [
    {
      id: "edge-gateway",
      name: "Edge Gateway",
      type: "gateway",
      layer: 1,
      status: "healthy",
      position: { x: -6, y: 0, z: 0 }
    },
    {
      id: "ingest-gateway",
      name: "Ingest Gateway",
      type: "gateway",
      layer: 1,
      status: "healthy",
      position: { x: -2, y: 0, z: 0 }
    },
    {
      id: "axiom",
      name: "Axiom Rule Engine",
      type: "rule-engine",
      layer: 2,
      status: "healthy",
      riskScore: 0.2,
      position: { x: 0, y: 4, z: 0 }
    },
    {
      id: "inference-hmm-beth",
      name: "HMM BETH",
      type: "inference",
      layer: 3,
      status: "healthy",
      riskScore: 0.1,
      position: { x: -5, y: 8, z: 0 }
    },
    {
      id: "inference-iforest-kdd99",
      name: "IForest KDD99",
      type: "inference",
      layer: 3,
      status: "healthy",
      position: { x: -1, y: 8, z: -3 }
    },
    {
      id: "inference-iforest-creditcard",
      name: "IForest CreditCard",
      type: "inference",
      layer: 3,
      status: "degraded",
      riskScore: 0.6,
      position: { x: 3, y: 8, z: -1 }
    },
    {
      id: "inference-lstm-cicids",
      name: "LSTM CICIDS",
      type: "inference",
      layer: 3,
      status: "healthy",
      position: { x: 5, y: 8, z: 2 }
    },
    {
      id: "inference-autoencoder-unsw",
      name: "AE UNSW",
      type: "inference",
      layer: 3,
      status: "healthy",
      position: { x: 1, y: 8, z: 4 }
    },
    {
      id: "supabase",
      name: "Supabase (Postgres)",
      type: "db",
      layer: 0,
      status: "healthy",
      position: { x: -4, y: -3, z: -2 }
    },
    {
      id: "mongodb",
      name: "MongoDB (Models)",
      type: "db",
      layer: 0,
      status: "healthy",
      position: { x: 4, y: -3, z: -2 }
    }
  ],
  links: [
    { id: "edge->ingest", from: "edge-gateway", to: "ingest-gateway", kind: "http" },
    { id: "ingest->axiom", from: "ingest-gateway", to: "axiom", kind: "http" },
    { id: "axiom->hmm", from: "axiom", to: "inference-hmm-beth", kind: "inference" },
    { id: "axiom->if-kdd", from: "axiom", to: "inference-iforest-kdd99", kind: "inference" },
    { id: "axiom->if-cc", from: "axiom", to: "inference-iforest-creditcard", kind: "inference" },
    { id: "axiom->lstm", from: "axiom", to: "inference-lstm-cicids", kind: "inference" },
    { id: "axiom->ae", from: "axiom", to: "inference-autoencoder-unsw", kind: "inference" },
    { id: "tp->supabase", from: "supabase", to: "axiom", kind: "db" },
    { id: "inf->mongo1", from: "inference-hmm-beth", to: "mongodb", kind: "db" },
    { id: "inf->mongo2", from: "inference-iforest-kdd99", to: "mongodb", kind: "db" },
    { id: "inf->mongo3", from: "inference-iforest-creditcard", to: "mongodb", kind: "db" },
    { id: "inf->mongo4", from: "inference-lstm-cicids", to: "mongodb", kind: "db" },
    { id: "inf->mongo5", from: "inference-autoencoder-unsw", to: "mongodb", kind: "db" }
  ]
};

export function useTopologyData(): TopologyState {
  const [state, setState] = useState<TopologyState>({
    nodes: [],
    links: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = import.meta.env.VITE_TOPOLOGY_API_URL?.trim();

    async function load() {
      if (!baseUrl) {
        // 無後端 API 時使用 mock 資料
        setState({ nodes: MOCK_TOPOLOGY.nodes, links: MOCK_TOPOLOGY.links, loading: false, error: null });
        return;
      }
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const resp = await fetch(`${baseUrl}/api/topology/services`, { signal: controller.signal });
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const json = (await resp.json()) as TopologyResponse;
        setState({ nodes: json.nodes ?? [], links: json.links ?? [], loading: false, error: null });
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : String(err);
        // 若呼叫失敗，退回 mock，但記錄錯誤
        setState({
          nodes: MOCK_TOPOLOGY.nodes,
          links: MOCK_TOPOLOGY.links,
          loading: false,
          error: message
        });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return state;
}


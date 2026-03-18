import { useEffect, useState } from "react";
import { getTopologyServices, getSDNTopology } from "../lib/api";
import type { ServiceLink, ServiceNode, TopologyResponse, TopologyRealm } from "../types/topology";

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

export interface TopologyState {
  nodes: ServiceNode[];
  links: ServiceLink[];
  loading: boolean;
  error: string | null;
  /** True when showing FALLBACK_TOPOLOGY (API error or API returned 0 services). */
  usingMockData: boolean;
}

const REALM_Y_OFFSET: Record<TopologyRealm, number> = {
  physical: -10,
  virtual: -2,
  service: 6
};

const FALLBACK_TOPOLOGY: TopologyResponse = {
  nodes: [
    {
      id: "edge-gateway",
      name: "Edge Gateway",
      type: "gateway",
      layer: 1,
      realm: "service",
      status: "healthy",
      position: { x: -10, y: 0, z: 0 }
    },
    {
      id: "ingest-gateway",
      name: "Ingest Gateway",
      type: "gateway",
      layer: 1,
      realm: "service",
      status: "healthy",
      position: { x: -6, y: 0, z: -2 }
    },
    {
      id: "broker",
      name: "Message Broker",
      type: "queue",
      layer: 1,
      realm: "service",
      status: "healthy",
      position: { x: -2, y: 0, z: 2 }
    },
    {
      id: "axiom",
      name: "Axiom Rule Engine",
      type: "rule-engine",
      layer: 2,
      realm: "service",
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
      realm: "service",
      status: "healthy",
      position: { x: -6, y: 4, z: 4 }
    },
    {
      id: "profile-manager",
      name: "Profile Manager",
      type: "other",
      layer: 2,
      realm: "service",
      status: "healthy",
      position: { x: 6, y: 4, z: -4 }
    },
    {
      id: "inference-hmm-beth",
      name: "HMM BETH",
      type: "inference",
      layer: 3,
      realm: "service",
      status: "healthy",
      riskScore: 0.19,
      position: { x: -8, y: 8, z: 0 }
    },
    {
      id: "inference-iforest-kdd99",
      name: "IForest KDD99",
      type: "inference",
      layer: 3,
      realm: "service",
      status: "healthy",
      riskScore: 0.24,
      position: { x: -3, y: 8, z: -4 }
    },
    {
      id: "inference-lstm-cicids",
      name: "LSTM CICIDS",
      type: "inference",
      layer: 3,
      realm: "service",
      status: "healthy",
      riskScore: 0.21,
      position: { x: 3, y: 8, z: 4 }
    },
    {
      id: "inference-autoencoder-unsw",
      name: "AE UNSW",
      type: "inference",
      layer: 3,
      realm: "service",
      status: "healthy",
      riskScore: 0.18,
      position: { x: 8, y: 8, z: 0 }
    }
  ],
  links: [
    { id: "edge-ingest", from: "edge-gateway", to: "ingest-gateway", kind: "http", realm: "service" },
    { id: "ingest-broker", from: "ingest-gateway", to: "broker", kind: "amqp", realm: "service" },
    { id: "broker-axiom", from: "broker", to: "axiom", kind: "stream", realm: "service" },
    { id: "axiom-intel", from: "axiom", to: "intel-hub", kind: "http", realm: "service" },
    { id: "axiom-profile", from: "axiom", to: "profile-manager", kind: "http", realm: "service" },
    { id: "axiom-hmm", from: "axiom", to: "inference-hmm-beth", kind: "inference", realm: "service" },
    { id: "axiom-iforest", from: "axiom", to: "inference-iforest-kdd99", kind: "inference", realm: "service" },
    { id: "axiom-lstm", from: "axiom", to: "inference-lstm-cicids", kind: "inference", realm: "service" },
    { id: "axiom-ae", from: "axiom", to: "inference-autoencoder-unsw", kind: "inference", realm: "service" }
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
        agentLog("A", "web/src/hooks/useTopologyData.ts:load", "load_start", {});
        
        // Start both fetches, but do NOT let a slow/unreachable Service topology block rendering SDN.
        const sdnPromise = getSDNTopology();
        const servicePromise = getTopologyServices()
          .then(v => ({ ok: true as const, value: v }))
          .catch(error => ({
            ok: false as const,
            error: error instanceof Error ? error.message : String(error)
          }));

        const sdnTopology = await sdnPromise;
        if (controller.signal.aborted) return;

        agentLog("B", "web/src/hooks/useTopologyData.ts:load", "sdn_ready", {
          sdnNodes: sdnTopology?.nodes?.length ?? null,
          sdnLinks: sdnTopology?.links?.length ?? null
        });

        // Render immediately with SDN + fallback services so the canvas is not blank.
        const baseNodes = FALLBACK_TOPOLOGY.nodes;
        const baseLinks = FALLBACK_TOPOLOGY.links;

        // Apply Y-axis offsets and set default realm
        const processedServiceNodes = baseNodes.map(node => ({
          ...node,
          realm: "service" as TopologyRealm,
          position: node.position ? {
            ...node.position,
            y: node.position.y + REALM_Y_OFFSET["service"]
          } : undefined
        }));

        const processedSdnNodes = sdnTopology.nodes.map(node => ({
          ...node,
          position: node.position ? {
            ...node.position,
            y: node.position.y + (REALM_Y_OFFSET[node.realm || "physical"])
          } : undefined
        }));

        // Combine all nodes and links
        const initialNodes = [...processedSdnNodes, ...processedServiceNodes];
        const initialLinks = [
          ...sdnTopology.links,
          ...baseLinks.map(l => ({ ...l, realm: l.realm || ("service" as TopologyRealm) })),
          // Cross-layer link: connect service gateway to virtual switch
          { id: "cross-layer-1", from: "edge-gateway", to: "ovs-virt-01", kind: "logical", realm: "virtual" } as ServiceLink
        ];

        agentLog("C", "web/src/hooks/useTopologyData.ts:load", "load_processed", {
          allNodes: initialNodes.length,
          allLinks: initialLinks.length,
          realmCounts: initialNodes.reduce(
            (acc, n) => {
              const r = (((n as any)?.realm as string | undefined) || "service") as string;
              acc[r] = (acc[r] ?? 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          )
        });

        setState({
          nodes: initialNodes,
          links: initialLinks,
          loading: false,
          error: null,
          usingMockData: true
        });

        // When service topology eventually resolves, merge it in (if any).
        const serviceResult = await servicePromise;
        if (controller.signal.aborted) return;

        if (!serviceResult.ok) {
          agentLog("A", "web/src/hooks/useTopologyData.ts:load", "service_failed_non_blocking", {
            error: serviceResult.error
          });
          return;
        }

        const serviceTopology = serviceResult.value;
        agentLog("A", "web/src/hooks/useTopologyData.ts:load", "service_ready", {
          serviceNodes: serviceTopology?.nodes?.length ?? null,
          serviceLinks: serviceTopology?.links?.length ?? null
        });

        const serviceNodes =
          serviceTopology.nodes?.length ? serviceTopology.nodes : FALLBACK_TOPOLOGY.nodes;
        const serviceLinks =
          serviceTopology.links?.length ? serviceTopology.links : FALLBACK_TOPOLOGY.links;

        const processedServiceNodes2 = serviceNodes.map(node => ({
          ...node,
          realm: "service" as TopologyRealm,
          position: node.position
            ? { ...node.position, y: node.position.y + REALM_Y_OFFSET["service"] }
            : undefined
        }));

        const mergedNodes = [...processedSdnNodes, ...processedServiceNodes2];
        const mergedLinks = [
          ...sdnTopology.links,
          ...serviceLinks.map(l => ({ ...l, realm: l.realm || ("service" as TopologyRealm) })),
          { id: "cross-layer-1", from: "edge-gateway", to: "ovs-virt-01", kind: "logical", realm: "virtual" } as ServiceLink
        ];

        agentLog("C", "web/src/hooks/useTopologyData.ts:load", "merged_ready", {
          allNodes: mergedNodes.length,
          allLinks: mergedLinks.length
        });

        setState({
          nodes: mergedNodes,
          links: mergedLinks,
          loading: false,
          error: null,
          usingMockData: !serviceTopology.nodes?.length
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : String(error);
        agentLog("A", "web/src/hooks/useTopologyData.ts:load", "load_failed", { error: message });
        
        // Even on error, we try to show something (SDN + Fallback)
        const sdn = await getSDNTopology().catch(() => ({ nodes: [], links: [] }));
        
        setState({
          nodes: [...sdn.nodes, ...FALLBACK_TOPOLOGY.nodes],
          links: [...sdn.links, ...FALLBACK_TOPOLOGY.links],
          loading: false,
          error: message,
          usingMockData: true
        });
      }
    }

    load();

    // Simulation: Dynamic monitoring of Risk Scores
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => {
          // Only simulate risk updates for switches and rule-engines
          if (node.type === "switch" || node.type === "rule-engine") {
            const currentRisk = node.riskScore || 0;
            const delta = (Math.random() - 0.5) * 0.1;
            const newRisk = Math.max(0, Math.min(1, currentRisk + delta));
            return {
              ...node,
              riskScore: newRisk,
              status: newRisk > 0.7 ? "down" : newRisk > 0.4 ? "degraded" : "healthy"
            };
          }
          return node;
        })
      }));
    }, 5000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return state;
}

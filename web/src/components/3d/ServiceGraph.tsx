import { Html } from "@react-three/drei";
import { useCallback, useMemo, useRef } from "react";
import type { ServiceNode as ServiceNodeType } from "../../types/topology";
import type { ServiceLink as ServiceLinkType } from "../../types/topology";
import { ServiceNode } from "./ServiceNode";
import { ServiceLink } from "./ServiceLink";

interface Props {
  nodes: ServiceNodeType[];
  links: ServiceLinkType[];
  loading: boolean;
  error: string | null;
  highlightedNodeIds?: Set<string>;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function ServiceGraph({ nodes, links, loading, error, highlightedNodeIds }: Props) {
  const prevNodesRef = useRef<ServiceNodeType[]>(nodes)
  const prevLinksRef = useRef<ServiceLinkType[]>(links)

  const stableNodes = useMemo(() => {
    if (deepEqual(prevNodesRef.current, nodes)) return prevNodesRef.current
    prevNodesRef.current = nodes
    return nodes
  }, [nodes])

  const stableLinks = useMemo(() => {
    if (deepEqual(prevLinksRef.current, links)) return prevLinksRef.current
    prevLinksRef.current = links
    return links
  }, [links])

  const hasHighlight = highlightedNodeIds !== undefined

  const positionedNodes: ServiceNodeType[] = useMemo(() => {
    if (!stableNodes.length) return [];
    const byLayer = new Map<number, ServiceNodeType[]>();
    for (const n of stableNodes) {
      const layer = n.layer ?? 0;
      const arr = byLayer.get(layer) ?? [];
      arr.push(n);
      byLayer.set(layer, arr);
    }
    const updated: ServiceNodeType[] = [];
    byLayer.forEach((arr, layer) => {
      const radius = 4 + layer * 3;
      const y = layer * 4;
      const count = arr.length;
      arr.forEach((n, idx) => {
        if (n.position) {
          updated.push(n);
          return;
        }
        const angle = (idx / Math.max(1, count)) * Math.PI * 2;
        updated.push({
          ...n,
          position: {
            x: Math.cos(angle) * radius,
            y,
            z: Math.sin(angle) * radius
          }
        });
      });
    });
    return updated;
  }, [stableNodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, ServiceNodeType>();
    for (const n of positionedNodes) {
      map.set(n.id, n);
    }
    return map;
  }, [positionedNodes]);

  const renderNode = useCallback((node: ServiceNodeType) => {
    const highlighted = !hasHighlight || (highlightedNodeIds?.has(node.id) ?? true)
    return <ServiceNode key={node.id} node={node} highlighted={highlighted} />
  }, [hasHighlight, highlightedNodeIds])

  const renderLink = useCallback((link: ServiceLinkType) => {
    return (
      <ServiceLink
        key={link.id}
        link={link}
        fromNode={nodeMap.get(link.from)}
        toNode={nodeMap.get(link.to)}
      />
    )
  }, [nodeMap])

  if (loading && !stableNodes.length) {
    return null;
  }

  return (
    <>
      <gridHelper args={[40, 40, "#1f2937", "#111827"]} position={[0, -0.01, 0]} />

      {error && (
        <Html position={[0, 14, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(127,29,29,0.9)",
              color: "#fee2e2",
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: 11,
              maxWidth: 320
            }}
          >
            Topology API failed, using mock data. Error: {error}
          </div>
        </Html>
      )}

      {positionedNodes.map(renderNode)}

      {stableLinks.map(renderLink)}
    </>
  );
}

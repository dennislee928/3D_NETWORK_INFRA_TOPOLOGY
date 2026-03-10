import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { useTopologyData } from "../../hooks/useTopologyData";
import type { ServiceNode as ServiceNodeType } from "../../types/topology";
import { ServiceNode } from "./ServiceNode";
import { ServiceLink } from "./ServiceLink";

export function ServiceGraph() {
  const { nodes, links, loading, error } = useTopologyData();

  const positionedNodes: ServiceNodeType[] = useMemo(() => {
    if (!nodes.length) return [];
    // 若節點未提供 position，依 layer 做簡易 layout
    const byLayer = new Map<number, ServiceNodeType[]>();
    for (const n of nodes) {
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
  }, [nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, ServiceNodeType>();
    for (const n of positionedNodes) {
      map.set(n.id, n);
    }
    return map;
  }, [positionedNodes]);

  if (loading && !nodes.length) {
    return null;
  }

  return (
    <>
      {/* ground plane for orientation */}
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
            拓樸 API 讀取失敗，已使用 mock 資料。錯誤：{error}
          </div>
        </Html>
      )}

      {positionedNodes.map(node => (
        <ServiceNode key={node.id} node={node} />
      ))}

      {links.map(link => (
        <ServiceLink
          key={link.id}
          link={link}
          fromNode={nodeMap.get(link.from)}
          toNode={nodeMap.get(link.to)}
        />
      ))}
    </>
  );
}


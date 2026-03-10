import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { ServiceLink, ServiceNode } from "../../types/topology";
import { useSelectionStore } from "../../state/useSelectionStore";

interface Props {
  link: ServiceLink;
  fromNode?: ServiceNode;
  toNode?: ServiceNode;
}

export function ServiceLink({ link, fromNode, toNode }: Props) {
  const { hoveredId, selectedId } = useSelectionStore();

  if (!fromNode || !toNode) return null;

  const from = fromNode.position ?? { x: 0, y: 0, z: 0 };
  const to = toNode.position ?? { x: 0, y: 0, z: 0 };

  const points = useMemo<[number, number, number][]>(() => {
    return [
      [from.x, from.y, from.z],
      [to.x, to.y, to.z]
    ];
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  const isHighlighted =
    hoveredId === fromNode.id ||
    hoveredId === toNode.id ||
    selectedId === fromNode.id ||
    selectedId === toNode.id;

  const color = useMemo(() => {
    switch (link.kind) {
      case "inference":
        return "#60a5fa";
      case "db":
        return "#fbbf24";
      case "http":
        return "#a855f7";
      case "stream":
        return "#22d3ee";
      case "amqp":
        return "#fb7185";
      case "mqtt":
        return "#34d399";
      default:
        return "#6b7280";
    }
  }, [link.kind]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={isHighlighted ? 3 : 1.5}
      dashed={link.kind === "stream"}
      dashSize={0.4}
      gapSize={0.3}
      transparent
      opacity={isHighlighted ? 1 : 0.55}
    />
  );
}


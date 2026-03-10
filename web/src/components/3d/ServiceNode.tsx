import { Html, Text } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import type { ServiceNode } from "../../types/topology";
import { useSelectionStore } from "../../state/useSelectionStore";

interface Props {
  node: ServiceNode;
}

export function ServiceNode({ node }: Props) {
  const { hoveredId, selectedId, setHovered, setSelected } = useSelectionStore();
  const isHovered = hoveredId === node.id;
  const isSelected = selectedId === node.id;

  const color = useMemo(() => {
    if (node.status === "down") return "#ef4444";
    if (node.status === "degraded") return "#f97316";
    // healthy base, modulated by riskScore
    const risk = node.riskScore ?? 0;
    if (risk > 0.7) return "#f97316";
    if (risk > 0.4) return "#84cc16";
    return "#22c55e";
  }, [node.status, node.riskScore]);

  const scale = isSelected ? 1.2 : isHovered ? 1.05 : 1;

  function handlePointerOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(node.id);
  }

  function handlePointerOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(null);
  }

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    setSelected(node.id === selectedId ? null : node.id);
  }

  const position = [node.position?.x ?? 0, node.position?.y ?? 0, node.position?.z ?? 0] as const;

  // choose geometry by type
  const radius = 0.6;

  return (
    <group position={position}>
      <mesh
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        {node.type === "gateway" && <boxGeometry args={[1.2, 0.6, 1.2]} />}
        {node.type === "rule-engine" && <cylinderGeometry args={[0.8, 0.8, 1, 16]} />}
        {node.type === "inference" && <sphereGeometry args={[radius, 24, 24]} />}
        {node.type === "db" && <cylinderGeometry args={[0.7, 0.7, 0.6, 20]} />}
        {node.type === "queue" && <torusGeometry args={[0.7, 0.2, 12, 32]} />}
        {node.type === "agent" && <octahedronGeometry args={[radius, 0]} />}
        {node.type === "other" && <sphereGeometry args={[radius, 16, 16]} />}
        <meshStandardMaterial
          color={color}
          emissive={isHovered || isSelected ? color : "#000000"}
          emissiveIntensity={isHovered ? 0.8 : isSelected ? 0.5 : 0.1}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* 3D label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.32}
        color="#e5e7eb"
        anchorX="center"
        anchorY="bottom"
        outlineColor="#020617"
        outlineWidth={0.02}
      >
        {node.name}
      </Text>

      {/* Optional HTML tooltip when hovered */}
      {isHovered && (
        <Html position={[0, 1.9, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 11,
              maxWidth: 220,
              border: "1px solid rgba(148,163,184,0.6)"
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{node.name}</div>
            <div style={{ opacity: 0.9 }}>type: {node.type}</div>
            <div style={{ opacity: 0.9 }}>status: {node.status}</div>
            {typeof node.riskScore === "number" && (
              <div style={{ opacity: 0.9 }}>riskScore: {(node.riskScore * 100).toFixed(0)}%</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}


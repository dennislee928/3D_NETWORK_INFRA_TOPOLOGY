import { useMemo } from "react";
import { useSelectionStore } from "../state/useSelectionStore";
import { useTopologyData } from "../hooks/useTopologyData";

export function ServiceDetailsPanel() {
  const { selectedId } = useSelectionStore();
  const { nodes } = useTopologyData();

  const node = useMemo(() => nodes.find(n => n.id === selectedId) ?? null, [nodes, selectedId]);

  if (!node) {
    return (
      <div>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>服務詳情</h2>
        <p style={{ opacity: 0.8, fontSize: 13 }}>在 3D 圖中點選任一節點以查看詳細資訊。</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>{node.name}</h2>
      <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8 }}>ID: {node.id}</div>

      <section style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7, margin: "0 0 4px" }}>
          基本資訊
        </h3>
        <table style={{ fontSize: 13, width: "100%", borderSpacing: 0 }}>
          <tbody>
            <tr>
              <td style={{ opacity: 0.7 }}>類型</td>
              <td>{node.type}</td>
            </tr>
            <tr>
              <td style={{ opacity: 0.7 }}>Layer</td>
              <td>{node.layer}</td>
            </tr>
            <tr>
              <td style={{ opacity: 0.7 }}>狀態</td>
              <td>{node.status}</td>
            </tr>
            {typeof node.riskScore === "number" && (
              <tr>
                <td style={{ opacity: 0.7 }}>風險分數</td>
                <td>{(node.riskScore * 100).toFixed(0)}%</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7, margin: "0 0 4px" }}>
          健康狀態
        </h3>
        {node.health ? (
          <table style={{ fontSize: 13, width: "100%", borderSpacing: 0 }}>
            <tbody>
              {typeof node.health.latencyMs === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>延遲</td>
                  <td>{node.health.latencyMs.toFixed(1)} ms</td>
                </tr>
              )}
              {typeof node.health.errorRate === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>錯誤率</td>
                  <td>{(node.health.errorRate * 100).toFixed(2)}%</td>
                </tr>
              )}
              {node.health.region && (
                <tr>
                  <td style={{ opacity: 0.7 }}>Region</td>
                  <td>{node.health.region}</td>
                </tr>
              )}
              {node.health.lastDeploy && (
                <tr>
                  <td style={{ opacity: 0.7 }}>最近部署</td>
                  <td>{node.health.lastDeploy}</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p style={{ opacity: 0.8, fontSize: 13 }}>尚無健康資訊（health）。</p>
        )}
      </section>

      <section>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7, margin: "0 0 4px" }}>
          位置 / Layer 視覺化
        </h3>
        <p style={{ opacity: 0.8, fontSize: 13 }}>
          3D 圖中此節點位於 Layer {node.layer}，代表{" "}
          {node.layer === 1
            ? "邊界 / Gateway 層"
            : node.layer === 2
            ? "規則引擎 / 決策層"
            : node.layer === 3
            ? "Inference / AI 模型層"
            : "資料 / 基礎設施層"}
          。
        </p>
      </section>
    </div>
  );
}


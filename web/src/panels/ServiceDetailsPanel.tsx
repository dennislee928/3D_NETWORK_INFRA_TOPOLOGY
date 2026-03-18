import { useMemo } from "react";
import { useSelectionStore } from "../state/useSelectionStore";
import type { ServiceNode } from "../types/topology";

interface Props {
  nodes: ServiceNode[];
}

export function ServiceDetailsPanel({ nodes }: Props) {
  const { selectedId } = useSelectionStore();

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
            {node.realm && (
              <tr>
                <td style={{ opacity: 0.7 }}>領域 (Realm)</td>
                <td>{node.realm}</td>
              </tr>
            )}
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
            {node.metadata && Object.entries(node.metadata).map(([key, value]) => (
              <tr key={key}>
                <td style={{ opacity: 0.7 }}>{key}</td>
                <td>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7, margin: "0 0 4px" }}>
          健康狀態 / 負載
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
              {typeof node.health.cpuUsage === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>CPU 負載</td>
                  <td>{(node.health.cpuUsage * 100).toFixed(1)}%</td>
                </tr>
              )}
              {typeof node.health.memoryUsage === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>記憶體</td>
                  <td>{(node.health.memoryUsage * 100).toFixed(1)}%</td>
                </tr>
              )}
              {typeof node.health.bandwidthUsage === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>頻寬佔用</td>
                  <td>{(node.health.bandwidthUsage * 100).toFixed(1)}%</td>
                </tr>
              )}
              {node.health.region && (
                <tr>
                  <td style={{ opacity: 0.7 }}>Region</td>
                  <td>{node.health.region}</td>
                </tr>
              )}
              {typeof node.health.incidentCount === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>Open incidents</td>
                  <td>{node.health.incidentCount}</td>
                </tr>
              )}
              {typeof node.health.commandCount === "number" && (
                <tr>
                  <td style={{ opacity: 0.7 }}>Pending commands</td>
                  <td>{node.health.commandCount}</td>
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
          分層視覺化 (Layer & Realm)
        </h3>
        <p style={{ opacity: 0.8, fontSize: 13 }}>
          此節點屬於 <strong>{node.realm?.toUpperCase() || "SERVICE"}</strong> 領域。
          在 3D 場景中，不同領域分布在不同高度：
          <br />
          - Service: 頂層 (Y &gt; 0)
          <br />
          - Virtual: 中層 (Y ≈ 0)
          <br />
          - Physical: 底層 (Y &lt; 0)
        </p>
      </section>
    </div>
  );
}

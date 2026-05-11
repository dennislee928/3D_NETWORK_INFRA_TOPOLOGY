import type { ServiceLink, ServiceNode } from "../../types/topology"
import { exportTopologyAsJson, exportTopologyScreenshot } from "../../lib/exportTopology"

interface Props {
  nodes: ServiceNode[]
  links: ServiceLink[]
}

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid rgba(137,181,167,0.18)",
  background: "rgba(2,10,16,0.78)",
  color: "#eff7f2",
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
}

export function ExportBar({ nodes, links }: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        style={btnStyle}
        onClick={() => exportTopologyScreenshot()}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(78,208,174,0.12)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(2,10,16,0.78)")}
      >
        Export PNG
      </button>
      <button
        style={btnStyle}
        onClick={() => exportTopologyAsJson(nodes, links)}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(78,208,174,0.12)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(2,10,16,0.78)")}
      >
        Export JSON
      </button>
    </div>
  )
}

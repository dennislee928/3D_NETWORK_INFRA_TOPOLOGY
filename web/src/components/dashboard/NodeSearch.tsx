import { useMemo, useRef, useState } from "react"
import type { ServiceNode } from "../../types/topology"
import { useSelectionStore } from "../../state/useSelectionStore"

interface Props {
  nodes: ServiceNode[]
}

export function NodeSearch({ nodes }: Props) {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const setSelected = useSelectionStore(s => s.setSelected)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const lower = query.toLowerCase()
    return nodes.filter(n =>
      n.name.toLowerCase().includes(lower) ||
      n.id.toLowerCase().includes(lower) ||
      n.type.toLowerCase().includes(lower) ||
      (n.realm && n.realm.toLowerCase().includes(lower))
    ).slice(0, 20)
  }, [nodes, query])

  function handleSelect(id: string) {
    setSelected(id)
    setQuery("")
    setFocused(false)
    inputRef.current?.blur()
  }

  return (
    <div className="node-search" style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        className="node-search__input"
        placeholder="Search nodes..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid rgba(137,181,167,0.18)",
          background: "rgba(2,10,16,0.78)",
          color: "#eff7f2",
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {focused && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 100,
            marginTop: 4,
            borderRadius: 10,
            border: "1px solid rgba(137,181,167,0.18)",
            background: "rgba(8,24,33,0.96)",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          {filtered.map(n => (
            <button
              key={n.id}
              onMouseDown={() => handleSelect(n.id)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 14px",
                border: "none",
                borderBottom: "1px solid rgba(137,181,167,0.08)",
                background: "transparent",
                color: "#eff7f2",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 13,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(78,208,174,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <strong>{n.name}</strong>
              <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 11 }}>
                {n.type} · {n.realm ?? "service"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

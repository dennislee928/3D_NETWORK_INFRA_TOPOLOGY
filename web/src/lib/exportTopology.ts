import type { ServiceLink, ServiceNode } from "../types/topology"

export function exportTopologyScreenshot(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas")
  if (!canvas) return
  const dataUrl = canvas.toDataURL("image/png")
  const anchor = document.createElement("a")
  anchor.href = dataUrl
  anchor.download = `topology-${Date.now()}.png`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export function exportTopologyAsJson(nodes: ServiceNode[], links: ServiceLink[]): void {
  const blob = new Blob([JSON.stringify({ nodes, links }, null, 2)], { type: "application/json" })
  const dataUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = dataUrl
  anchor.download = `topology-${Date.now()}.json`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(dataUrl)
}

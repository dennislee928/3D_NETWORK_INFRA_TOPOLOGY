import { useCallback, useEffect, useRef, useState } from "react"
import type { ServiceLink, ServiceNode } from "../types/topology"

interface WebSocketTopologyState {
  nodes: ServiceNode[]
  links: ServiceLink[]
  connected: boolean
  reconnectDelay: number
}

function adapterWsUrl(): string | null {
  const configured = (import.meta as any).env?.VITE_SDN_ADAPTER_URL as string | undefined
  const adapterUrl = configured ?? ((import.meta as any).env?.DEV ? "http://localhost:4000" : "")
  if (!adapterUrl) return null
  const host = adapterUrl.replace(/^http/, "ws")
  return `${host}/ws/topology`
}

const MAX_RECONNECT_DELAY = 30000

export function useWebSocketTopology(): WebSocketTopologyState & { reset: () => void } {
  const [state, setState] = useState<WebSocketTopologyState>({
    nodes: [],
    links: [],
    connected: false,
    reconnectDelay: 0,
  })
  const wsRef = useRef<WebSocket | null>(null)
  const delayRef = useRef(1000)
  const mountedRef = useRef(true)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const url = adapterWsUrl()

  const connect = useCallback(() => {
    if (!url) return

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      if (!mountedRef.current) return
      delayRef.current = 1000
      setState(prev => ({ ...prev, connected: true, reconnectDelay: 0 }))
    }

    ws.onmessage = (event) => {
      if (!mountedRef.current) return
      try {
        const data = JSON.parse(event.data)
        if (data && Array.isArray(data.nodes) && Array.isArray(data.links)) {
          setState({
            nodes: data.nodes as ServiceNode[],
            links: data.links as ServiceLink[],
            connected: true,
            reconnectDelay: 0,
          })
        }
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      if (!mountedRef.current) return
      setState(prev => ({ ...prev, connected: false }))
      scheduleReconnect()
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [url])

  const scheduleReconnect = useCallback(() => {
    if (!mountedRef.current) return
    const delay = delayRef.current
    setState(prev => ({ ...prev, reconnectDelay: delay }))
    reconnectTimerRef.current = setTimeout(() => {
      delayRef.current = Math.min(delayRef.current * 2, MAX_RECONNECT_DELAY)
      connect()
    }, delay)
  }, [connect])

  useEffect(() => {
    mountedRef.current = true
    connect()
    return () => {
      mountedRef.current = false
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [connect])

  const reset = useCallback(() => {
    delayRef.current = 1000
    if (wsRef.current) wsRef.current.close()
    connect()
  }, [connect])

  return { ...state, reset }
}

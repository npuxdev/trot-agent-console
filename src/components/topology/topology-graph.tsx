"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Cpu,
  Database,
  Globe,
  Server,
  Zap,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import {
  topologyEdges,
  topologyIncident,
  topologyLayout,
  topologyNodes,
  topologyTrustBoundaries,
} from "@/lib/mock-data/topology"
import type { TopologyEdge, TopologyNode, TopologyNodeType } from "@/lib/types"
import { cn } from "@/lib/utils"

const { nodeW: NODE_W, nodeH: NODE_H, width: VIEW_W, height: VIEW_H } =
  topologyLayout

const nodeTypeConfig: Record<
  TopologyNodeType,
  { icon: typeof Bot; color: string; bg: string }
> = {
  agent: { icon: Bot, color: "text-[#166534]", bg: "fill-[#f0fdf4]" },
  mcp: { icon: Server, color: "text-[#1e40af]", bg: "fill-[#eff6ff]" },
  model: { icon: Cpu, color: "text-[#7c3aed]", bg: "fill-[#f5f3ff]" },
  api: { icon: Zap, color: "text-[#b45309]", bg: "fill-[#fffbeb]" },
  database: { icon: Database, color: "text-[#0f766e]", bg: "fill-[#f0fdfa]" },
  external: { icon: Globe, color: "text-[#9f1239]", bg: "fill-[#fff1f2]" },
}

const statusStroke: Record<string, string> = {
  success: "#22c55e",
  healthy: "#22c55e",
  warning: "#eab308",
  degraded: "#ef4444",
}

const zoneStyles = {
  production: "fill-[#f0fdf4]/25 stroke-[#86efac]/35",
  restricted: "fill-[#eff6ff]/25 stroke-[#93c5fd]/35",
  external: "fill-[#fff1f2]/25 stroke-[#fda4af]/35",
}

/** Anchor on the node border closest to the peer */
function getAnchor(
  node: TopologyNode,
  peer: TopologyNode
): { x: number; y: number } {
  const cx = node.x + NODE_W / 2
  const cy = node.y + NODE_H / 2
  const px = peer.x + NODE_W / 2
  const py = peer.y + NODE_H / 2
  const dx = px - cx
  const dy = py - cy

  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      x: dx > 0 ? node.x + NODE_W : node.x,
      y: cy,
    }
  }
  return {
    x: cx,
    y: dy > 0 ? node.y + NODE_H : node.y,
  }
}

function edgePath(
  source: TopologyNode,
  target: TopologyNode,
  kind: TopologyEdge["kind"],
  index: number
) {
  const s = getAnchor(source, target)
  const t = getAnchor(target, source)
  const dx = t.x - s.x
  const dy = t.y - s.y

  if (kind === "a2a") {
    const lift = 48 + index * 12
    const midY = Math.min(s.y, t.y) - lift
    return `M ${s.x} ${s.y} Q ${(s.x + t.x) / 2} ${midY} ${t.x} ${t.y}`
  }

  if (Math.abs(dy) > Math.abs(dx)) {
    const spread = (index % 3 - 1) * 18
    const midY = (s.y + t.y) / 2
    return `M ${s.x} ${s.y} C ${s.x + spread} ${midY} ${t.x + spread} ${midY} ${t.x} ${t.y}`
  }

  const spread = (index % 3 - 1) * 14
  const midX = (s.x + t.x) / 2
  return `M ${s.x} ${s.y} C ${midX} ${s.y + spread} ${midX} ${t.y + spread} ${t.x} ${t.y}`
}

function EdgeLabel({
  edge,
  source,
  target,
}: {
  edge: TopologyEdge
  source: TopologyNode
  target: TopologyNode
}) {
  const s = getAnchor(source, target)
  const t = getAnchor(target, source)
  const label = edge.label ?? edge.latency
  if (!label) return null

  const mx = (s.x + t.x) / 2
  const my =
    (s.y + t.y) / 2 -
    (edge.kind === "a2a" ? 28 : Math.abs(t.y - s.y) > Math.abs(t.x - s.x) ? 0 : 10)
  const w = Math.max(label.length * 5.5 + 12, 40)

  return (
    <g pointerEvents="none">
      <rect
        x={mx - w / 2}
        y={my - 7}
        width={w}
        height={14}
        className="fill-background/95 stroke-border/50"
        strokeWidth={0.5}
      />
      <text
        x={mx}
        y={my + 3}
        textAnchor="middle"
        className="fill-muted-foreground text-[8px] font-medium"
      >
        {label}
      </text>
    </g>
  )
}

type TopologyGraphProps = {
  highlightIncident?: boolean
  selectedNodeId?: string | null
  onSelectNode?: (id: string | null) => void
}

export function TopologyGraph({
  highlightIncident = true,
  selectedNodeId,
  onSelectNode,
}: TopologyGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const nodeMap = useMemo(
    () => new Map(topologyNodes.map((n) => [n.id, n])),
    []
  )

  const incidentNodeIds = useMemo(
    () => new Set(topologyIncident.propagationPath),
    []
  )

  const activeId = selectedNodeId ?? hoveredNodeId

  const connectedNodeIds = useMemo(() => {
    if (!activeId) return new Set<string>()
    const ids = new Set<string>([activeId])
    topologyEdges.forEach((e) => {
      if (e.source === activeId) ids.add(e.target)
      if (e.target === activeId) ids.add(e.source)
    })
    return ids
  }, [activeId])

  const connectedEdgeIds = useMemo(() => {
    if (!activeId) return new Set<string>()
    return new Set(
      topologyEdges
        .filter((e) => e.source === activeId || e.target === activeId)
        .map((e) => e.id)
    )
  }, [activeId])

  const edgeIndexMap = useMemo(() => {
    const groups = new Map<string, TopologyEdge[]>()
    for (const edge of topologyEdges) {
      const key = [edge.source, edge.target].sort().join(":")
      const list = groups.get(key) ?? []
      list.push(edge)
      groups.set(key, list)
    }
    const indexMap = new Map<string, number>()
    groups.forEach((list) => list.forEach((e, i) => indexMap.set(e.id, i)))
    return indexMap
  }, [])

  const handleNodeClick = useCallback(
    (id: string) => {
      onSelectNode?.(selectedNodeId === id ? null : id)
    },
    [onSelectNode, selectedNodeId]
  )

  return (
    <Card className={cn(overviewCardClass, "overflow-hidden")}>
      <CardContent className="p-0">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full"
          role="img"
          aria-label="Agent ecosystem topology"
        >
          <defs>
            <marker
              id="arrow-normal"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0, 7 2.5, 0 5" fill="#cbd5e1" />
            </marker>
            <marker
              id="arrow-incident"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0, 7 2.5, 0 5" fill="#ef4444" />
            </marker>
          </defs>

          {/* Trust boundaries */}
          {topologyTrustBoundaries.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                className={cn(
                  "stroke-[1] stroke-dasharray-[5,4]",
                  zoneStyles[zone.level]
                )}
              />
              <text
                x={zone.x + 14}
                y={zone.y + 20}
                className="fill-muted-foreground/80 text-[9px] font-semibold tracking-[0.14em] uppercase"
              >
                {zone.label}
              </text>
            </g>
          ))}

          {/* Row guides within production zone */}
          <line
            x1={64}
            y1={168}
            x2={896}
            y2={168}
            className="stroke-border/30"
            strokeWidth={1}
            strokeDasharray="3,6"
          />

          {/* Edges — non-incident first, incident on top */}
          {[...topologyEdges]
            .sort((a, b) =>
              a.incidentPath === b.incidentPath ? 0 : a.incidentPath ? 1 : -1
            )
            .map((edge) => {
              const source = nodeMap.get(edge.source)
              const target = nodeMap.get(edge.target)
              if (!source || !target) return null

              const isIncident = highlightIncident && edge.incidentPath
              const isConnected = connectedEdgeIds.has(edge.id)
              const dimmed = activeId && !isConnected && !isIncident

              return (
                <g key={edge.id} opacity={dimmed ? 0.12 : 1}>
                  <path
                    d={edgePath(
                      source,
                      target,
                      edge.kind,
                      edgeIndexMap.get(edge.id) ?? 0
                    )}
                    fill="none"
                    stroke={
                      isIncident
                        ? "#ef4444"
                        : (statusStroke[edge.status] ?? "#cbd5e1")
                    }
                    strokeWidth={isIncident ? 2 : isConnected ? 1.75 : 1.25}
                    strokeDasharray={edge.kind === "a2a" ? "5,3" : undefined}
                    strokeOpacity={isIncident ? 1 : dimmed ? 1 : 0.7}
                    markerEnd={
                      isIncident ? "url(#arrow-incident)" : "url(#arrow-normal)"
                    }
                  />
                  {(isIncident || isConnected) && (
                    <EdgeLabel edge={edge} source={source} target={target} />
                  )}
                </g>
              )
            })}

          {/* Nodes */}
          {topologyNodes.map((node) => {
            const config = nodeTypeConfig[node.type]
            const isSelected = selectedNodeId === node.id
            const isHovered = hoveredNodeId === node.id
            const isIncident =
              highlightIncident && incidentNodeIds.has(node.id)
            const isConnected = activeId ? connectedNodeIds.has(node.id) : true
            const dimmed = activeId && !isConnected

            return (
              <g
                key={node.id}
                opacity={dimmed ? 0.2 : 1}
                className="cursor-pointer"
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {isIncident && (
                  <rect
                    x={node.x - 4}
                    y={node.y - 4}
                    width={NODE_W + 8}
                    height={NODE_H + 8}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeDasharray="4,3"
                    opacity={0.8}
                  />
                )}

                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  className={cn(config.bg, "stroke-background")}
                  stroke={statusStroke[node.status] ?? "#cbd5e1"}
                  strokeWidth={isSelected ? 2 : isHovered ? 1.75 : 1.25}
                />

                <rect
                  x={node.x}
                  y={node.y}
                  width={3}
                  height={NODE_H}
                  fill={statusStroke[node.status] ?? "#cbd5e1"}
                />

                <text
                  x={node.x + 11}
                  y={node.y + 19}
                  className="fill-foreground text-[11px] font-semibold"
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 11}
                  y={node.y + 33}
                  className="fill-muted-foreground text-[9px]"
                >
                  {node.subtitle}
                </text>
              </g>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}

export function TopologyLegend() {
  const items = [
    { label: "Agent", color: "#86efac" },
    { label: "MCP", color: "#93c5fd" },
    { label: "Model", color: "#c4b5fd" },
    { label: "Database", color: "#5eead4" },
    { label: "External", color: "#fda4af" },
    { label: "Incident path", color: "#ef4444", dashed: true },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1 text-[10px] text-muted-foreground">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-0.5 w-3.5",
              item.dashed && "border-t border-dashed border-[#ef4444] bg-transparent"
            )}
            style={item.dashed ? undefined : { backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
      <span className="text-muted-foreground/60">
        Metrics shown in inspector on select
      </span>
    </div>
  )
}

export function TopologyIncidentBanner() {
  return (
    <div className="flex items-start gap-3 border border-nest-red/30 bg-nest-red-light px-4 py-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-nest-red" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">
          Active incident: {topologyIncident.title}
        </p>
        <p className="text-xs text-muted-foreground">
          Blast radius: {topologyIncident.blastRadius.agents} agents,{" "}
          {topologyIncident.blastRadius.downstreamTraces} downstream traces ·
          Est. cost impact {topologyIncident.blastRadius.estimatedCost}
        </p>
      </div>
      <Link
        href={`/observability?trace=${topologyIncident.traceId}`}
        className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-nest-red hover:underline"
      >
        {topologyIncident.traceId}
        <ArrowUpRight className="size-3" />
      </Link>
    </div>
  )
}

export function TopologyInspector({ nodeId }: { nodeId: string | null }) {
  const node = nodeId
    ? topologyNodes.find((n) => n.id === nodeId)
    : undefined

  if (!node) {
    return (
      <Card className={overviewCardClass}>
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium">Node Inspector</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Select a node to view volume, latency, cost, and dependencies.
            Incident nodes are highlighted in red.
          </p>
        </CardContent>
      </Card>
    )
  }

  const inbound = topologyEdges.filter((e) => e.target === nodeId)
  const outbound = topologyEdges.filter((e) => e.source === nodeId)
  const config = nodeTypeConfig[node.type]
  const Icon = config.icon

  return (
    <Card className={overviewCardClass}>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center border border-border/60 bg-muted/40",
              config.color
            )}
          >
            <Icon className="size-4" />
          </span>
          <div>
            <p className="font-semibold">{node.label}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {node.type.replace("-", " ")} · {node.trustZone} zone
            </p>
          </div>
        </div>

        {node.metrics && (
          <div className="grid grid-cols-2 gap-2">
            {node.metrics.volume && (
              <div className="border border-border/60 bg-muted/30 px-2.5 py-2">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Volume
                </p>
                <p className="text-sm font-medium tabular-nums">
                  {node.metrics.volume}
                </p>
              </div>
            )}
            {node.metrics.latency && (
              <div className="border border-border/60 bg-muted/30 px-2.5 py-2">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Latency
                </p>
                <p className="text-sm font-medium tabular-nums">
                  {node.metrics.latency}
                </p>
              </div>
            )}
            {node.metrics.cost && (
              <div className="border border-border/60 bg-muted/30 px-2.5 py-2">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Cost
                </p>
                <p className="text-sm font-medium tabular-nums">
                  {node.metrics.cost}
                </p>
              </div>
            )}
            {node.metrics.errorRate && (
              <div className="border border-border/60 bg-muted/30 px-2.5 py-2">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Error rate
                </p>
                <p className="text-sm font-medium tabular-nums">
                  {node.metrics.errorRate}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Dependencies ({inbound.length + outbound.length})
          </p>
          {[...inbound, ...outbound].map((edge) => {
            const isOut = edge.source === nodeId
            const otherId = isOut ? edge.target : edge.source
            const other = topologyNodes.find((n) => n.id === otherId)
            return (
              <div
                key={edge.id}
                className={cn(
                  "flex items-center justify-between border px-2.5 py-1.5 text-xs",
                  edge.incidentPath
                    ? "border-nest-red/30 bg-nest-red-light"
                    : "border-border/60"
                )}
              >
                <span>
                  {isOut ? "→" : "←"} {other?.label ?? otherId}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {edge.latency ?? edge.kind}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function TopologyBlastRadius() {
  const { blastRadius, bottleneck, propagationPath } = topologyIncident

  return (
    <Card className={overviewCardClass}>
      <CardContent className="space-y-3 p-4">
        <p className="text-sm font-medium">Blast Radius Analysis</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-border/60 bg-muted/30 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">
              Agents affected
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {blastRadius.agents}
            </p>
          </div>
          <div className="border border-border/60 bg-muted/30 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">
              Downstream traces
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {blastRadius.downstreamTraces}
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase">
            Bottleneck
          </p>
          <p className="text-sm font-medium text-nest-red">
            {topologyNodes.find((n) => n.id === bottleneck)?.label ?? bottleneck}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase">
            Propagation path
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
            {propagationPath.map((id, i) => (
              <span key={id} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">→</span>}
                <span className="border border-nest-red/30 bg-nest-red-light px-1.5 py-0.5 font-medium">
                  {topologyNodes.find((n) => n.id === id)?.label ?? id}
                </span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

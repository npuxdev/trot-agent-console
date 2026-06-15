"use client"

import { useMemo } from "react"
import {
  Bot,
  Cpu,
  Database,
  Globe,
  Server,
  Shield,
  Zap,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import {
  topologyEdges,
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
  agent: { icon: Bot, color: "text-nest-green", bg: "fill-[#f8faf9]" },
  mcp: { icon: Server, color: "text-[#1e40af]", bg: "fill-[#eff6ff]" },
  model: { icon: Cpu, color: "text-[#7c3aed]", bg: "fill-[#f5f3ff]" },
  api: { icon: Zap, color: "text-[#b45309]", bg: "fill-[#fffbeb]" },
  database: { icon: Database, color: "text-[#0f766e]", bg: "fill-[#f0fdfa]" },
  external: { icon: Globe, color: "text-[#9f1239]", bg: "fill-[#fff1f2]" },
}

const zoneStyles = {
  production: "fill-[#f0fdf4]/25 stroke-[#86efac]/35",
  restricted: "fill-[#eff6ff]/25 stroke-[#93c5fd]/35",
  external: "fill-[#fff1f2]/25 stroke-[#fda4af]/35",
}

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
    return { x: dx > 0 ? node.x + NODE_W : node.x, y: cy }
  }
  return { x: cx, y: dy > 0 ? node.y + NODE_H : node.y }
}

function edgePath(
  source: TopologyNode,
  target: TopologyNode,
  kind: TopologyEdge["kind"],
  index: number
) {
  const s = getAnchor(source, target)
  const t = getAnchor(target, source)
  const dy = t.y - s.y
  const dx = t.x - s.x

  if (kind === "a2a") {
    const lift = 48 + index * 12
    const midY = Math.min(s.y, t.y) - lift
    return `M ${s.x} ${s.y} Q ${(s.x + t.x) / 2} ${midY} ${t.x} ${t.y}`
  }

  if (Math.abs(dy) > Math.abs(dx)) {
    const spread = ((index % 3) - 1) * 18
    const midY = (s.y + t.y) / 2
    return `M ${s.x} ${s.y} C ${s.x + spread} ${midY} ${t.x + spread} ${midY} ${t.x} ${t.y}`
  }

  const spread = ((index % 3) - 1) * 14
  const midX = (s.x + t.x) / 2
  return `M ${s.x} ${s.y} C ${midX} ${s.y + spread} ${midX} ${t.y + spread} ${t.x} ${t.y}`
}

type ReplayTopologyProps = {
  activeNodeIds: Set<string>
  activeEdgeIds: Set<string>
  mode?: "normal" | "failure" | "containment"
}

export function ReplayTopology({
  activeNodeIds,
  activeEdgeIds,
  mode = "normal",
}: ReplayTopologyProps) {
  const nodeMap = useMemo(
    () => new Map(topologyNodes.map((n) => [n.id, n])),
    []
  )

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

  const hasHighlights = activeEdgeIds.size > 0 || activeNodeIds.size > 0
  const edgeColor =
    mode === "containment" ? "#16a34a" : mode === "failure" ? "#dc2626" : "#cbd5e1"
  const edgeMarker =
    mode === "containment"
      ? "url(#replay-arrow-contained)"
      : mode === "failure"
        ? "url(#replay-arrow-active)"
        : "url(#replay-arrow-normal)"

  return (
    <Card className={cn(overviewCardClass, "overflow-hidden")}>
      <CardContent className="p-0">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full"
          role="img"
          aria-label="Incident replay topology"
        >
          <defs>
            <marker
              id="replay-arrow-normal"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0, 7 2.5, 0 5" fill="#cbd5e1" />
            </marker>
            <marker
              id="replay-arrow-active"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0, 7 2.5, 0 5" fill="#dc2626" />
            </marker>
            <marker
              id="replay-arrow-contained"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0, 7 2.5, 0 5" fill="#22c55e" />
            </marker>
          </defs>

          {/* Trust boundaries */}
          {topologyTrustBoundaries.map((zone) => (
            <g key={zone.id}>
              <g opacity={hasHighlights ? 0.35 : 1}>
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
              </g>
              <text
                x={zone.x + 14}
                y={zone.y + 20}
                className="text-[9px] font-semibold tracking-[0.14em] uppercase"
                fill={hasHighlights ? "rgba(17,24,39,0.35)" : "#64748b"}
              >
                {zone.label}
              </text>
            </g>
          ))}

          {/* Row guide */}
          <line
            x1={64}
            y1={168}
            x2={896}
            y2={168}
            className="stroke-border/30"
            strokeWidth={1}
            strokeDasharray="3,6"
          />

          {/* Edges */}
          {[...topologyEdges]
            .sort((a, b) => {
              const aActive = activeEdgeIds.has(a.id)
              const bActive = activeEdgeIds.has(b.id)
              return aActive === bActive ? 0 : aActive ? 1 : -1
            })
            .map((edge) => {
              const source = nodeMap.get(edge.source)
              const target = nodeMap.get(edge.target)
              if (!source || !target) return null

              const isActive = activeEdgeIds.has(edge.id)
              const dimmed = activeEdgeIds.size > 0 && !isActive

              return (
                <g key={edge.id} opacity={dimmed ? 0.15 : 1}>
                  <path
                    d={edgePath(
                      source,
                      target,
                      edge.kind,
                      edgeIndexMap.get(edge.id) ?? 0
                    )}
                    fill="none"
                    stroke={isActive ? edgeColor : "#cbd5e1"}
                    strokeWidth={isActive ? 2.5 : 1.25}
                    strokeDasharray={edge.kind === "a2a" ? "5,3" : undefined}
                    markerEnd={isActive ? edgeMarker : "url(#replay-arrow-normal)"}
                    className={cn(
                      "transition-all duration-500",
                      isActive && "replay-edge-active"
                    )}
                  />
                  {isActive && edge.label && (
                    <g pointerEvents="none">
                      {(() => {
                        const s = getAnchor(source, target)
                        const t = getAnchor(target, source)
                        const mx = (s.x + t.x) / 2
                        const my =
                          (s.y + t.y) / 2 -
                          (edge.kind === "a2a" ? 28 : 0)
                        const label = edge.label
                        const w = Math.max(label.length * 5.5 + 12, 40)
                        return (
                          <>
                            <rect
                              x={mx - w / 2}
                              y={my - 7}
                              width={w}
                              height={14}
                              fill="#fef2f2"
                              stroke="#fca5a5"
                              strokeWidth={0.5}
                            />
                            <text
                              x={mx}
                              y={my + 3}
                              textAnchor="middle"
                              className="text-[8px] font-semibold"
                              fill={mode === "containment" ? "#16a34a" : "#dc2626"}
                            >
                              {label}
                            </text>
                          </>
                        )
                      })()}
                    </g>
                  )}
                </g>
              )
            })}

          {/* Nodes */}
          {topologyNodes.map((node) => {
            const config = nodeTypeConfig[node.type]
            const isActive = activeNodeIds.has(node.id)
            const dimmed = activeNodeIds.size > 0 && !isActive

            return (
              <g key={node.id} className="transition-all duration-500">
                <g opacity={dimmed ? 0.2 : 1}>
                  {isActive && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width={NODE_W + 8}
                      height={NODE_H + 8}
                      fill="none"
                      stroke={mode === "containment" ? "#16a34a" : "#dc2626"}
                      strokeWidth={2}
                      strokeDasharray="4,3"
                      opacity={0.9}
                    />
                  )}

                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    className={config.bg}
                    stroke={isActive ? (mode === "containment" ? "#16a34a" : "#dc2626") : "#cbd5e1"}
                    strokeWidth={isActive ? 2 : 1.25}
                  />

                  <rect
                    x={node.x}
                    y={node.y}
                    width={3}
                    height={NODE_H}
                    fill={isActive ? (mode === "containment" ? "#16a34a" : "#dc2626") : "#cbd5e1"}
                  />
                </g>

                <text
                  x={node.x + 11}
                  y={node.y + 19}
                  className="text-[11px] font-semibold"
                  fill={dimmed ? "rgba(17,24,39,0.35)" : "#111827"}
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 11}
                  y={node.y + 33}
                  className="text-[9px]"
                  fill={dimmed ? "rgba(17,24,39,0.35)" : "#64748b"}
                >
                  {node.subtitle}
                </text>

                {/* Policy intervention marker */}
                {isActive && node.type === "agent" && (
                  <g>
                    <rect
                      x={node.x + NODE_W - 18}
                      y={node.y + 2}
                      width={16}
                      height={16}
                      fill="#f5f3ff"
                      stroke="#c4b5fd"
                      strokeWidth={0.5}
                    />
                    <Shield
                      x={node.x + NODE_W - 16}
                      y={node.y + 4}
                      width={12}
                      height={12}
                      className="text-[#7c3aed]"
                    />
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}

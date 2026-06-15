"use client"

import { Fragment, useState } from "react"
import { AlertTriangle } from "lucide-react"

import { ChevronRight } from "lucide-react"

import { AgentDetailSheet } from "@/components/agents/agent-detail-sheet"
import { McpServerDetailSheet } from "@/components/mcp-registry/mcp-server-detail-sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import { TableMetricCell } from "@/components/shared/table-metric-cell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, cardHoverClass, tableGroupCellClass, tableHeadClass, tableRowClickableClass } from "@/lib/card-styles"
import { getAgentById } from "@/lib/mock-data/agents"
import { mcpServers } from "@/lib/mock-data/mcp-servers"
import { cn } from "@/lib/utils"

export function McpServersGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {mcpServers.map((server) => (
          <Card
            key={server.id}
            onClick={() => setSelectedId(server.id)}
            className={cn(
              overviewCardClass,
              cardHoverClass,
              "cursor-pointer",
              server.status === "degraded" && "border-nest-orange/40"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold">
                  {server.name}
                </CardTitle>
                <StatusBadge status={server.status} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono font-medium text-muted-foreground">
                  MCP {server.version}
                </span>
                <span className="border border-border/70 bg-muted/50 px-1.5 py-0.5 font-medium text-muted-foreground">
                  {server.toolCount} tools
                </span>
                <span className="border border-border/70 bg-muted/50 px-1.5 py-0.5 font-medium text-muted-foreground">
                  {server.authMethod}
                </span>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {server.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">p95</p>
                  <TableMetricCell
                    value={server.latencyP95}
                    delta={server.latencyP95Delta}
                    className={cn(
                      "text-xs font-medium",
                      server.status === "degraded" && "text-nest-orange"
                    )}
                  />
                </div>
                <div>
                  <p className="text-muted-foreground">Cost / call</p>
                  <TableMetricCell
                    value={server.costPerCall}
                    delta={server.costPerCallDelta}
                    className="text-xs font-medium"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground">Agents</p>
                  <p className="font-medium tabular-nums">
                    {server.connectedAgentIds.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  Last synced{" "}
                  <span className="font-medium text-foreground">
                    {server.lastSync}
                  </span>
                </span>
                {server.lastIncidentTraceId && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-nest-orange">
                    <AlertTriangle className="size-3" />
                    Recent incident
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <McpServerDetailSheet
        serverId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  )
}

export function McpAgentsTable() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <Card className={overviewCardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Agent Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className={tableHeadClass}>
                  <th className="px-4 py-2.5">MCP Server</th>
                  <th className="px-4 py-2.5">Server Status</th>
                  <th className="px-4 py-2.5">Agent</th>
                  <th className="px-4 py-2.5">Team</th>
                  <th className="w-8 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {mcpServers.map((server) => (
                  <Fragment key={server.id}>
                    <tr>
                      <td colSpan={5} className={tableGroupCellClass}>
                        {server.name} · {server.connectedAgentIds.length} dependent
                        {server.connectedAgentIds.length === 1 ? "" : "s"}
                      </td>
                    </tr>
                    {server.connectedAgentIds.map((agentId) => {
                      const agent = getAgentById(agentId)
                      return (
                        <tr
                          key={`${server.id}-${agentId}`}
                          onClick={() => setSelectedId(agentId)}
                          className={tableRowClickableClass}
                        >
                          <td className="px-4 py-2.5 font-medium text-muted-foreground">
                            {server.name}
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge status={server.status} />
                          </td>
                          <td className="px-4 py-2.5">{agent?.name ?? agentId}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {agent?.team ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                          </td>
                        </tr>
                      )
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AgentDetailSheet
        agentId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  )
}

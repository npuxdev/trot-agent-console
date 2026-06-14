"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

import { ChevronRight } from "lucide-react"

import { AgentDetailSheet } from "@/components/agents/agent-detail-sheet"
import { McpServerDetailSheet } from "@/components/mcp-registry/mcp-server-detail-sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass } from "@/lib/card-styles"
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
              "cursor-pointer transition-shadow hover:shadow-[0_2px_4px_rgba(74,67,52,0.08),0_4px_16px_rgba(74,67,52,0.08)]",
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
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {server.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">p95</p>
                  <p
                    className={cn(
                      "font-medium tabular-nums",
                      server.status === "degraded" && "text-nest-orange"
                    )}
                  >
                    {server.latencyP95}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Timeout</p>
                  <p className="font-medium tabular-nums">
                    {server.timeoutThreshold}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Agents</p>
                  <p className="font-medium tabular-nums">
                    {server.connectedAgentIds.length}
                  </p>
                </div>
              </div>
              {server.lastIncidentTraceId && (
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-nest-orange">
                  <AlertTriangle className="size-3" />
                  Recent incident
                </p>
              )}
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

  const rows = mcpServers.flatMap((server) =>
    server.connectedAgentIds.map((agentId) => {
      const agent = getAgentById(agentId)
      return {
        serverId: server.id,
        serverName: server.name,
        serverStatus: server.status,
        agentId,
        agentName: agent?.name ?? agentId,
        agentTeam: agent?.team ?? "—",
      }
    })
  )

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
                  <th className="px-4 py-2.5 font-medium">MCP Server</th>
                  <th className="px-4 py-2.5 font-medium">Server Status</th>
                  <th className="px-4 py-2.5 font-medium">Agent</th>
                  <th className="px-4 py-2.5 font-medium">Team</th>
                  <th className="w-8 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.serverId}-${row.agentId}`}
                    onClick={() => setSelectedId(row.agentId)}
                    className="group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium">{row.serverName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.serverStatus} />
                    </td>
                    <td className="px-4 py-3">{row.agentName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.agentTeam}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                    </td>
                  </tr>
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

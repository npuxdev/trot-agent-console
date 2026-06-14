import { Network, Server, Timer } from "lucide-react"

import { SummaryStatCard } from "@/components/shared/summary-stat-card"
import { mcpServers } from "@/lib/mock-data/mcp-servers"

export function McpSummaryCards() {
  const degraded = mcpServers.filter((s) => s.status === "degraded").length
  const warning = mcpServers.filter((s) => s.status === "warning").length
  const healthy = mcpServers.filter((s) => s.status === "success").length

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryStatCard
        icon={<Server className="size-4 text-muted-foreground" />}
        label="Registered Servers"
        value={String(mcpServers.length)}
        subtext={`${healthy} healthy, ${warning} warning, ${degraded} degraded`}
      />
      <SummaryStatCard
        icon={<Network className="size-4 text-muted-foreground" />}
        label="Agent Connections"
        value={String(
          mcpServers.reduce((sum, s) => sum + s.connectedAgentIds.length, 0)
        )}
        subtext="Across all MCP servers"
      />
      <SummaryStatCard
        icon={<Timer className="size-4 text-muted-foreground" />}
        label="Avg p95 Latency"
        value="0.96s"
        subtext="Elevated due to CRM Search"
      />
    </div>
  )
}

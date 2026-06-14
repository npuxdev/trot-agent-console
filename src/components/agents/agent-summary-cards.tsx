import { Activity, Bot, Timer } from "lucide-react"

import { SummaryStatCard } from "@/components/shared/summary-stat-card"
import { agents } from "@/lib/mock-data/agents"

export function AgentSummaryCards() {
  const healthy = agents.filter((a) => a.status === "healthy").length
  const degraded = agents.filter((a) => a.status === "degraded").length
  const warning = agents.filter((a) => a.status === "warning").length

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryStatCard
        icon={<Bot className="size-4 text-muted-foreground" />}
        label="Total Agents"
        value={String(agents.length)}
        subtext={`${healthy} healthy, ${warning} warning, ${degraded} degraded`}
      />
      <SummaryStatCard
        icon={<Activity className="size-4 text-muted-foreground" />}
        label="Active in Production"
        value={String(agents.filter((a) => a.environment === "Production").length)}
        subtext="All agents deployed"
      />
      <SummaryStatCard
        icon={<Timer className="size-4 text-muted-foreground" />}
        label="Avg Latency"
        value="0.97s"
        subtext="Across all agents (24h)"
      />
    </div>
  )
}

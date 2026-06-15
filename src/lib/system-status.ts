import { agents } from "@/lib/mock-data/agents"
import { mcpServers } from "@/lib/mock-data/mcp-servers"

export type SystemLevel = "operational" | "degraded" | "critical"

export type SystemStatus = {
  level: SystemLevel
  environment: string
  label: string
  incidentCount: number
  impactedAgentCount: number
  primaryIncidentTraceId?: string
}

export function getSystemStatus(): SystemStatus {
  const incidentServers = mcpServers.filter(
    (server) => server.status === "degraded" || Boolean(server.lastIncidentTraceId)
  )

  const impactedAgentIds = new Set<string>()
  for (const server of incidentServers) {
    for (const agentId of server.connectedAgentIds) {
      impactedAgentIds.add(agentId)
    }
  }
  for (const agent of agents) {
    if (agent.status === "degraded") impactedAgentIds.add(agent.id)
  }

  const incidentCount = incidentServers.length
  const impactedAgentCount = impactedAgentIds.size
  const hasDegradedAgent = agents.some((agent) => agent.status === "degraded")

  const level: SystemLevel =
    incidentCount > 0 || hasDegradedAgent ? "degraded" : "operational"

  const labelByLevel: Record<SystemLevel, string> = {
    operational: "Healthy",
    degraded: "Degraded",
    critical: "Critical",
  }
  const label = labelByLevel[level]

  return {
    level,
    environment: "Production",
    label,
    incidentCount,
    impactedAgentCount,
    primaryIncidentTraceId: incidentServers.find((s) => s.lastIncidentTraceId)
      ?.lastIncidentTraceId,
  }
}

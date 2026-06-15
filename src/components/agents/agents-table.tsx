"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { AgentDetailSheet } from "@/components/agents/agent-detail-sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import type { StatusType } from "@/components/overview/status-badge"
import { FilterableTable } from "@/components/shared/filterable-table"
import { AutonomyPill } from "@/components/agents/autonomy-pill"
import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { agents } from "@/lib/mock-data/agents"
import type { Agent } from "@/lib/types"

function agentStatusToBadge(status: Agent["status"]): StatusType {
  if (status === "healthy") return "success"
  return status
}

type AgentRow = Agent & Record<string, unknown>

export function AgentsTable() {
  const rows: AgentRow[] = agents.map((a) => ({ ...a }))
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <FilterableTable
        data={rows}
        searchPlaceholder="Search agents..."
        searchKeys={["name", "team", "id"]}
        filters={[
          {
            key: "team",
            label: "teams",
            options: [...new Set(agents.map((a) => a.team))].map((team) => ({
              label: team,
              value: team,
            })),
          },
          {
            key: "status",
            label: "statuses",
            options: [
              { label: "Healthy", value: "healthy" },
              { label: "Warning", value: "warning" },
              { label: "Degraded", value: "degraded" },
            ],
          },
        ]}
      >
        {(filtered) => (
          <Card className={overviewCardClass}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/50 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      <th className="px-4 py-2 font-medium">Agent</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-4 py-2 font-medium">Autonomy</th>
                      <th className="px-4 py-2 font-medium">Volume</th>
                      <th className="px-4 py-2 font-medium">Avg Latency</th>
                      <th className="px-4 py-2 font-medium">Error Rate</th>
                      <th className="px-4 py-2 font-medium">Cost / exec</th>
                      <th className="w-8 px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((agent) => (
                      <tr
                        key={agent.id}
                        onClick={() => setSelectedId(agent.id)}
                        className="group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-4 py-2">
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {agent.team} · {agent.model} · {agent.version}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge
                            status={agentStatusToBadge(agent.status)}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <AutonomyPill autonomy={agent.autonomy} />
                        </td>
                        <td className="px-4 py-2 tabular-nums">{agent.volume}</td>
                        <td className="px-4 py-2 tabular-nums">
                          {agent.avgLatency}
                        </td>
                        <td className="px-4 py-2 tabular-nums">
                          {agent.errorRate}
                        </td>
                        <td className="px-4 py-2 tabular-nums">
                          {agent.costPerExecution}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </FilterableTable>

      <AgentDetailSheet
        agentId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  )
}

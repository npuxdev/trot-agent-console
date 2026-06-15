"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { ChevronRight, GitBranch } from "lucide-react"

import { AgentDetailSheet } from "@/components/agents/agent-detail-sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import type { StatusType } from "@/components/overview/status-badge"
import { FilterableTable } from "@/components/shared/filterable-table"
import { TableMetricCell } from "@/components/shared/table-metric-cell"
import { AutonomyPill } from "@/components/agents/autonomy-pill"
import { Card, CardContent } from "@/components/ui/card"
import {
  overviewCardClass,
  tableGroupCellClass,
  tableHeadClass,
  tableRowClickableClass,
} from "@/lib/card-styles"
import { agents } from "@/lib/mock-data/agents"
import type { Agent } from "@/lib/types"

function agentStatusToBadge(status: Agent["status"]): StatusType {
  if (status === "healthy") return "success"
  return status
}

type AgentRow = Agent & Record<string, unknown>

function groupByTeam(rows: AgentRow[]) {
  const groups = new Map<string, AgentRow[]>()
  for (const agent of rows) {
    const list = groups.get(agent.team) ?? []
    list.push(agent)
    groups.set(agent.team, list)
  }
  return [...groups.entries()]
}

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
                    <tr className={tableHeadClass}>
                      <th className="px-4 py-2.5">Agent</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Autonomy</th>
                      <th className="px-4 py-2.5">Volume</th>
                      <th className="px-4 py-2.5">Avg Latency</th>
                      <th className="px-4 py-2.5">Error Rate</th>
                      <th className="px-4 py-2.5">Cost / exec</th>
                      <th className="px-4 py-2.5"></th>
                      <th className="w-8 px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {groupByTeam(filtered).map(([team, teamAgents]) => (
                      <Fragment key={team}>
                        <tr>
                          <td
                            colSpan={9}
                            className={tableGroupCellClass}
                          >
                            {team} · {teamAgents.length} agent
                            {teamAgents.length === 1 ? "" : "s"}
                          </td>
                        </tr>
                        {teamAgents.map((agent) => (
                          <tr
                            key={agent.id}
                            onClick={() => setSelectedId(agent.id)}
                            className={tableRowClickableClass}
                          >
                            <td className="px-4 py-2.5">
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {agent.model} · {agent.version}
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <StatusBadge
                                status={agentStatusToBadge(agent.status)}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <AutonomyPill autonomy={agent.autonomy} />
                            </td>
                            <td className="px-4 py-2.5">
                              <TableMetricCell
                                value={agent.volume}
                                delta={agent.volumeDelta}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <TableMetricCell
                                value={agent.avgLatency}
                                delta={agent.avgLatencyDelta}
                                sparkline={agent.latencySparkline}
                                sparklineColor="#2563eb"
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <TableMetricCell
                                value={agent.errorRate}
                                delta={agent.errorRateDelta}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <TableMetricCell
                                value={agent.costPerExecution}
                                delta={agent.costPerExecutionDelta}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <Link
                                href={`/agents/lifecycle?agent=${agent.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-nest-blue"
                              >
                                <GitBranch className="size-3" />
                                Lifecycle
                              </Link>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                            </td>
                          </tr>
                        ))}
                      </Fragment>
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

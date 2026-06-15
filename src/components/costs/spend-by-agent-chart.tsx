"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { ChartTableToggle } from "@/components/costs/chart-table-toggle"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { overviewCardClass, tableHeadClass } from "@/lib/card-styles"
import { costByAgent } from "@/lib/mock-data/costs"
import { cn } from "@/lib/utils"

export function SpendByAgentChart() {
  const searchParams = useSearchParams()
  const selectedAgent = searchParams.get("agent")
  const [view, setView] = useState<"chart" | "table">("chart")
  const maxSpend = Math.max(...costByAgent.map((a) => a.spend))

  const data = selectedAgent
    ? costByAgent.filter((a) => a.agentId === selectedAgent)
    : costByAgent

  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Spend by Agent
          {selectedAgent && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (filtered)
            </span>
          )}
        </CardTitle>
        <CardAction>
          <ChartTableToggle value={view} onChange={setView} />
        </CardAction>
      </CardHeader>
      {view === "chart" ? (
        <CardContent className="space-y-4">
          {data.map((agent) => {
            const widthPct = (agent.spend / maxSpend) * 100
            const isHighlighted = selectedAgent === agent.agentId

            return (
              <div key={agent.agentId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href={`/costs?agent=${agent.agentId}`}
                    className={cn(
                      "font-medium hover:text-nest-blue hover:underline",
                      isHighlighted && "text-nest-green"
                    )}
                  >
                    {agent.agentName}
                  </Link>
                  <span className="text-muted-foreground">
                    ${agent.spend.toLocaleString()} · {agent.tokens}
                  </span>
                </div>
                <div className="h-3 w-full bg-muted/60">
                  <div
                    className={cn(
                      "h-full bg-nest-green transition-all",
                      isHighlighted && "bg-nest-orange"
                    )}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            )
          })}
          {selectedAgent && (
            <Link
              href="/costs"
              className="text-xs font-medium text-nest-blue hover:underline"
            >
              Clear filter
            </Link>
          )}
        </CardContent>
      ) : (
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className={tableHeadClass}>
                  <th className="px-4 py-2.5 font-medium">Agent</th>
                  <th className="px-4 py-2.5 font-medium">Team</th>
                  <th className="px-4 py-2.5 font-medium">Spend</th>
                  <th className="px-4 py-2.5 font-medium">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {data.map((agent) => {
                  const isHighlighted = selectedAgent === agent.agentId

                  return (
                    <tr
                      key={agent.agentId}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-2.5">
                        <Link
                          href={`/costs?agent=${agent.agentId}`}
                          className={cn(
                            "font-medium hover:text-nest-blue hover:underline",
                            isHighlighted && "text-nest-green"
                          )}
                        >
                          {agent.agentName}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {agent.team}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        ${agent.spend.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                        {agent.tokens}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {selectedAgent && (
            <div className="px-4 py-2.5">
              <Link
                href="/costs"
                className="text-xs font-medium text-nest-blue hover:underline"
              >
                Clear filter
              </Link>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

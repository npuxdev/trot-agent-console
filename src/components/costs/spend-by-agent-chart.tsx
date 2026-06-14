"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { costByAgent } from "@/lib/mock-data/costs"
import { cn } from "@/lib/utils"

export function SpendByAgentChart() {
  const searchParams = useSearchParams()
  const selectedAgent = searchParams.get("agent")
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
      </CardHeader>
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
                    "font-medium hover:text-nest-green hover:underline",
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
            className="text-xs font-medium text-nest-green hover:underline"
          >
            Clear filter
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

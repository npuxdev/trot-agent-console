"use client"

import { useState } from "react"

import { AgentDetailSheet } from "@/components/agents/agent-detail-sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, topAgents } from "@/lib/overview-data"
import { cn } from "@/lib/utils"

export function TopAgentsList() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <Card className={cn(overviewCardClass, "h-full")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold leading-snug">
            Top Active Agents by Request Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {topAgents.map((agent, index) => (
            <button
              key={agent.name}
              type="button"
              onClick={() => setSelectedId(agent.agentId)}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/50",
                index < topAgents.length - 1 && "border-b border-border/40"
              )}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{agent.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {agent.team}
                </span>
              </span>
              <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
                {agent.volume}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      <AgentDetailSheet
        agentId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  )
}

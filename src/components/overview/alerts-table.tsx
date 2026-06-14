"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { AgentDetailSheet } from "@/components/agents/agent-detail-sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/overview/status-badge"
import { alerts, overviewCardClass } from "@/lib/overview-data"
import { tableHeadClass } from "@/lib/card-styles"
import { cn } from "@/lib/utils"

export function AlertsTable() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <Card className={cn(overviewCardClass, "h-full")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Alerts at a Glance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-sm">
              <thead>
                <tr className={tableHeadClass}>
                  <th className="px-4 py-2 font-medium">Alert</th>
                  <th className="px-4 py-2 font-medium">Agent</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="w-6 px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr
                    key={alert.alert}
                    onClick={() => setSelectedId(alert.agentId)}
                    className="group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-2.5 font-medium">{alert.alert}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {alert.agent}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ChevronRight className="ml-auto size-4 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
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

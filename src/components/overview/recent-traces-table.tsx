"use client"

import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { StatusBadge } from "@/components/overview/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tableHeadClass } from "@/lib/card-styles"
import { overviewCardClass, recentTraces } from "@/lib/overview-data"
import { cn } from "@/lib/utils"

export function RecentTracesTable() {
  const router = useRouter()

  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent System Traces
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className={tableHeadClass}>
                <th className="px-4 py-2 font-medium">Trace ID</th>
                <th className="px-4 py-2 font-medium">Root Operation</th>
                <th className="px-4 py-2 font-medium">Key Agent</th>
                <th className="px-4 py-2 font-medium">Duration</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="w-6 px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {recentTraces.map((trace) => (
                <tr
                  key={trace.id}
                  onClick={() =>
                    router.push(`/observability?trace=${trace.id}`)
                  }
                  className={cn(
                    "group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/50",
                    trace.highlighted && "bg-nest-orange-light/40"
                  )}
                >
                  <td className="px-4 py-2.5 font-medium text-nest-green group-hover:underline">
                    {trace.id}
                  </td>
                  <td className="px-4 py-2.5">{trace.operation}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {trace.agent}
                  </td>
                  <td className="px-4 py-2.5 font-medium tabular-nums">
                    {trace.duration}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={trace.status} />
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {trace.time}
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
  )
}

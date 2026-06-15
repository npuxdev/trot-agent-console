"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { HighCostTraceDetailSheet } from "@/components/costs/cost-detail-sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass, tableRowClickableClass } from "@/lib/card-styles"
import { highCostTraces } from "@/lib/mock-data/costs"
import type { HighCostTrace } from "@/lib/types"

export function HighCostTracesTable() {
  const [selected, setSelected] = useState<HighCostTrace | null>(null)

  return (
    <>
      <Card className={overviewCardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            High-Cost Traces
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className={tableHeadClass}>
                  <th className="px-4 py-2.5 font-medium">Trace</th>
                  <th className="px-4 py-2.5 font-medium">Agent</th>
                  <th className="px-4 py-2.5 font-medium">Cost</th>
                  <th className="w-8 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {highCostTraces.map((trace) => (
                  <tr
                    key={trace.traceId}
                    onClick={() => setSelected(trace)}
                    className={tableRowClickableClass}
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{trace.operation}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {trace.traceId}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {trace.agent}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-nest-orange tabular-nums">
                      {trace.cost}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <HighCostTraceDetailSheet
        trace={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  )
}

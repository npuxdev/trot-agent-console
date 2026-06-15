"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { ChartTableToggle } from "@/components/costs/chart-table-toggle"
import { ModelDetailSheet } from "@/components/costs/cost-detail-sheet"
import { TableMetricCell } from "@/components/shared/table-metric-cell"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { overviewCardClass, tableHeadClass, tableRowClickableClass } from "@/lib/card-styles"
import { costByModel } from "@/lib/mock-data/costs"
import type { CostByModel } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SpendByModelTable() {
  const [selected, setSelected] = useState<CostByModel | null>(null)
  const [view, setView] = useState<"chart" | "table">("table")
  const maxSpend = Math.max(...costByModel.map((m) => m.spend))

  return (
    <>
      <Card className={overviewCardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Spend by Model
          </CardTitle>
          <CardAction>
            <ChartTableToggle value={view} onChange={setView} />
          </CardAction>
        </CardHeader>
        {view === "chart" ? (
          <CardContent className="space-y-4">
            {costByModel.map((model) => {
              const widthPct = (model.spend / maxSpend) * 100
              const isSelected = selected?.model === model.model

              return (
                <button
                  key={model.model}
                  type="button"
                  onClick={() => setSelected(model)}
                  className="block w-full space-y-1 text-left"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "font-mono text-xs font-medium",
                        isSelected && "text-nest-green"
                      )}
                    >
                      {model.model}
                    </span>
                    <span className="text-muted-foreground">
                      ${model.spend.toLocaleString()} · {model.tokens}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted/60">
                    <div
                      className={cn(
                        "h-full bg-nest-green transition-all",
                        isSelected && "bg-nest-orange"
                      )}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className={tableHeadClass}>
                    <th className="px-4 py-2.5 font-medium">Model</th>
                    <th className="px-4 py-2.5 font-medium">Spend</th>
                    <th className="px-4 py-2.5 font-medium">Tokens</th>
                    <th className="px-4 py-2.5 font-medium">Requests</th>
                    <th className="w-8 px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {costByModel.map((row) => (
                    <tr
                      key={row.model}
                      onClick={() => setSelected(row)}
                      className={tableRowClickableClass}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs font-medium">
                        {row.model}
                      </td>
                      <td className="px-4 py-2.5">
                        <TableMetricCell
                          value={`$${row.spend.toLocaleString()}`}
                          delta={row.spendDelta}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                        {row.tokens}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                        {row.requests}
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
        )}
      </Card>

      <ModelDetailSheet
        model={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  )
}

"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { ModelDetailSheet } from "@/components/costs/cost-detail-sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass } from "@/lib/card-styles"
import { costByModel } from "@/lib/mock-data/costs"
import type { CostByModel } from "@/lib/types"

export function SpendByModelTable() {
  const [selected, setSelected] = useState<CostByModel | null>(null)

  return (
    <>
      <Card className={overviewCardClass}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Spend by Model
          </CardTitle>
        </CardHeader>
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
                    className="group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium">
                      {row.model}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      ${row.spend.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {row.tokens}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {row.requests}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ModelDetailSheet
        model={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  )
}

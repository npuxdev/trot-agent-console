import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { CostSummaryCards } from "@/components/costs/cost-summary-cards"
import { HighCostTracesTable } from "@/components/costs/high-cost-traces-table"
import { SpendByAgentChart } from "@/components/costs/spend-by-agent-chart"
import { SpendByModelTable } from "@/components/costs/spend-by-model-table"

export default function CostsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Costs" />
      <CostSummaryCards />
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading chart...</div>}>
        <SpendByAgentChart />
      </Suspense>
      <SpendByModelTable />
      <HighCostTracesTable />
    </div>
  )
}

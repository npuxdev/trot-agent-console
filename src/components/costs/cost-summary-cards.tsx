import { CircleDollarSign, Coins, TrendingUp } from "lucide-react"

import { SummaryStatCard } from "@/components/shared/summary-stat-card"
import { costSummary } from "@/lib/mock-data/costs"

export function CostSummaryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryStatCard
        icon={<CircleDollarSign className="size-4 text-muted-foreground" />}
        label="Total Spend"
        value={`$${(costSummary.totalSpend / 1000).toFixed(1)}K`}
        subtext={costSummary.period}
      />
      <SummaryStatCard
        icon={<Coins className="size-4 text-muted-foreground" />}
        label="Total Tokens"
        value={costSummary.totalTokens}
        subtext="Input + output combined"
      />
      <SummaryStatCard
        icon={<TrendingUp className="size-4 text-muted-foreground" />}
        label="Avg Cost / Trace"
        value={costSummary.avgCostPerTrace}
        subtext="Across all agents"
      />
    </div>
  )
}

import { ScrollText, ShieldAlert, ShieldCheck } from "lucide-react"

import { SummaryStatCard } from "@/components/shared/summary-stat-card"
import { allViolations, policies } from "@/lib/mock-data/policies"

export function PolicySummaryCards() {
  const active = policies.length
  const violations = allViolations.length
  const compliant = policies.filter((p) => p.violations.length === 0).length
  const compliancePct = Math.round((compliant / active) * 100)

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryStatCard
        icon={<ScrollText className="size-4 text-muted-foreground" />}
        label="Active Policies"
        value={String(active)}
        subtext="Governance rules in effect"
      />
      <SummaryStatCard
        icon={<ShieldAlert className="size-4 text-muted-foreground" />}
        label="Violations Today"
        value={String(violations)}
        subtext="Across all agents"
      />
      <SummaryStatCard
        icon={<ShieldCheck className="size-4 text-muted-foreground" />}
        label="Compliance"
        value={`${compliancePct}%`}
        subtext={`${compliant} of ${active} policies fully compliant`}
      />
    </div>
  )
}

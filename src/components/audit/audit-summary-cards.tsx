import { FileSearch, Settings, ShieldAlert } from "lucide-react"

import { SummaryStatCard } from "@/components/shared/summary-stat-card"
import { auditSummary } from "@/lib/mock-data/audit"

export function AuditSummaryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryStatCard
        icon={<FileSearch className="size-4 text-muted-foreground" />}
        label="Events Today"
        value={String(auditSummary.eventsToday)}
        subtext="Across all agents"
      />
      <SummaryStatCard
        icon={<ShieldAlert className="size-4 text-muted-foreground" />}
        label="Policy Violations"
        value={String(auditSummary.policyViolations)}
        subtext="Warnings and failures"
      />
      <SummaryStatCard
        icon={<Settings className="size-4 text-muted-foreground" />}
        label="Config Changes"
        value={String(auditSummary.configChanges)}
        subtext="Deployments and updates"
      />
    </div>
  )
}

import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { AuditLogTable } from "@/components/audit/audit-log-table"
import { AuditSummaryCards } from "@/components/audit/audit-summary-cards"

export default function AuditPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Audit" />
      <AuditSummaryCards />
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading audit log...</div>}>
        <AuditLogTable />
      </Suspense>
    </div>
  )
}

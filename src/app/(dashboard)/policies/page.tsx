import { PageHeader } from "@/components/page-header"
import { PoliciesTable, PolicyViolationsTable } from "@/components/policies/policies-table"
import { PolicySummaryCards } from "@/components/policies/policy-summary-cards"

export default function PoliciesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Policies" />

      <p className="-mt-2 max-w-3xl text-sm text-muted-foreground">
        Define tool access, model routing, data classifications, spending limits,
        and approval checkpoints that govern agent behavior in production.
      </p>
      <PolicySummaryCards />
      <PoliciesTable />
      <PolicyViolationsTable />
    </div>
  )
}

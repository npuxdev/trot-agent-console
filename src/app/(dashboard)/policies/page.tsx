import { PageHeader } from "@/components/page-header"
import { PoliciesTable, PolicyViolationsTable } from "@/components/policies/policies-table"
import { PolicySummaryCards } from "@/components/policies/policy-summary-cards"

export default function PoliciesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Policies" />
      <PolicySummaryCards />
      <PoliciesTable />
      <PolicyViolationsTable />
    </div>
  )
}

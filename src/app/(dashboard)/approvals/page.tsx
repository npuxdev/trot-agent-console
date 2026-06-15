import { PageHeader } from "@/components/page-header"
import {
  ActivePoliciesPanel,
  GovernanceSummaryCards,
  GovernanceViolationsTable,
  PendingApprovalsPanel,
  PolicyCategoryGrid,
  PolicySimulationPanel,
} from "@/components/governance/governance-workspace"

export default function ApprovalsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Approvals" />

      <p className="-mt-2 max-w-3xl text-sm text-muted-foreground">
        Clear the human-review queue and preview the blast radius of policy
        changes before they reach production. Every approval and simulation is
        audited and traceable.
      </p>

      <GovernanceSummaryCards />

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <PendingApprovalsPanel />
        <PolicySimulationPanel />
      </div>

      <GovernanceViolationsTable />

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <PolicyCategoryGrid />
        <ActivePoliciesPanel />
      </div>
    </div>
  )
}

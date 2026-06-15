import { PageHeader } from "@/components/page-header"
import {
  ActivePoliciesPanel,
  GovernanceSummaryCards,
  GovernanceViolationsTable,
  PendingApprovalsPanel,
  PolicyCategoryGrid,
  PolicySimulationPanel,
} from "@/components/governance/governance-workspace"

export default function GovernancePage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Governance" />

      <p className="-mt-2 max-w-3xl text-sm text-muted-foreground">
        Control how autonomous agents access tools, consume models, handle
        sensitive data, and escalate decisions. Every policy change is simulated,
        audited, and traceable.
      </p>

      <GovernanceSummaryCards />

      <div className="grid gap-4 lg:grid-cols-2">
        <PolicyCategoryGrid />
        <PendingApprovalsPanel />
      </div>

      <PolicySimulationPanel />

      <GovernanceViolationsTable />

      <ActivePoliciesPanel />
    </div>
  )
}

import { PageHeader } from "@/components/page-header"
import { AgentSummaryCards } from "@/components/agents/agent-summary-cards"
import { AgentsTable } from "@/components/agents/agents-table"

export default function AgentsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Agents" />

      <p className="-mt-2 max-w-3xl text-sm text-muted-foreground">
        Manage your AI workforce — onboard agents, assign tool permissions, bind
        governance policies, and monitor performance across teams.
      </p>
      <AgentSummaryCards />
      <AgentsTable />
    </div>
  )
}

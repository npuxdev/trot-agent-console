import { PageHeader } from "@/components/page-header"
import { AgentSummaryCards } from "@/components/agents/agent-summary-cards"
import { AgentsTable } from "@/components/agents/agents-table"

export default function AgentsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Agents" />
      <AgentSummaryCards />
      <AgentsTable />
    </div>
  )
}

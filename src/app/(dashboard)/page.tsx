import { AlertsTable } from "@/components/overview/alerts-table"
import { RecentTracesTable } from "@/components/overview/recent-traces-table"
import { SystemHealthSummary } from "@/components/overview/system-health-summary"
import { TopAgentsList } from "@/components/overview/top-agents-list"
import { PageHeader } from "@/components/page-header"

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Overview" />

      <SystemHealthSummary />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsTable />
        </div>
        <TopAgentsList />
      </div>

      <RecentTracesTable />
    </div>
  )
}

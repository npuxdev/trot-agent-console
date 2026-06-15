import { AlertsTable } from "@/components/overview/alerts-table"
import {
  ApprovalQueuePreview,
  OperationsPostureCards,
  QuickActionsPanel,
  WorkforceNarrative,
} from "@/components/overview/operations-center"
import { RecentTracesTable } from "@/components/overview/recent-traces-table"
import { PageHeader } from "@/components/page-header"

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Operations Center" />

      <OperationsPostureCards />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WorkforceNarrative />
        </div>
        <div className="space-y-4">
          <QuickActionsPanel />
          <ApprovalQueuePreview />
        </div>
      </div>

      <AlertsTable />
      <RecentTracesTable />
    </div>
  )
}

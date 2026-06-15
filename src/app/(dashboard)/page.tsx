import { AlertsTable } from "@/components/overview/alerts-table"
import { OperationsPostureCards } from "@/components/overview/operations-center"
import { OverviewWorkforceSection } from "@/components/overview/overview-workforce-section"
import { RecentTracesTable } from "@/components/overview/recent-traces-table"
import { PageHeader } from "@/components/page-header"

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Operations Center" />

      <OperationsPostureCards />

      <OverviewWorkforceSection />

      <AlertsTable />
      <RecentTracesTable />
    </div>
  )
}

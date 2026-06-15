import { PolicyHistoryWorkspace } from "@/components/policy-history/policy-history-workspace"
import { PageHeader } from "@/components/page-header"

export default function PolicyHistoryPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Policy Simulation History" showControls={false} />
      <PolicyHistoryWorkspace />
    </div>
  )
}

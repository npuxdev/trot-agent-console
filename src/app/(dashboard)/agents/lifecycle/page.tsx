import { LifecycleWorkspace } from "@/components/agent-lifecycle/lifecycle-workspace"
import { PageHeader } from "@/components/page-header"

export default function AgentLifecyclePage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Agent Lifecycle" showControls={false} />
      <LifecycleWorkspace />
    </div>
  )
}

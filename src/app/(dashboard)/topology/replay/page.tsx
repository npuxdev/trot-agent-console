import { ReplayWorkspace } from "@/components/incident-replay/replay-workspace"
import { PageHeader } from "@/components/page-header"

export default function IncidentReplayPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Incident Replay" showControls={false} />
      <ReplayWorkspace />
    </div>
  )
}

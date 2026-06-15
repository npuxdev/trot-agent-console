import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { ObservabilityWorkspace } from "@/components/observability/observability-workspace"

export default function ObservabilityPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Observability" />

      <p className="-mt-1 max-w-3xl text-sm text-muted-foreground">
        Inspect distributed agent traces end to end. Select a trace to review
        latency, span timing, and degradation across services and tool calls.
      </p>

      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading traces...</div>
        }
      >
        <ObservabilityWorkspace />
      </Suspense>
    </div>
  )
}

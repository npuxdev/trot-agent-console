import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { ObservabilityWorkspace } from "@/components/observability/observability-workspace"

export default function ObservabilityPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Observability" />
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

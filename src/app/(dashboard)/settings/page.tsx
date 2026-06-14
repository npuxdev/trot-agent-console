import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
import { SettingsWorkspace } from "@/components/settings/settings-workspace"

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Settings" showControls={false} />
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading settings...</div>
        }
      >
        <SettingsWorkspace />
      </Suspense>
    </div>
  )
}

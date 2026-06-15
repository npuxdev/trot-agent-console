import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/overview/status-badge"
import { overviewCardClass } from "@/lib/card-styles"
import type { PolicyHistory } from "@/lib/types"

type VersionDiffCardProps = {
  policy: PolicyHistory
}

export function VersionDiffCard({ policy }: VersionDiffCardProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Version Change
          </h3>
          <StatusBadge status={policy.status} />
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-border/60 bg-muted/30 px-4 py-3 text-center">
            <p className="text-[10px] font-medium text-muted-foreground uppercase">
              Previous
            </p>
            <p className="text-xl font-semibold font-mono tabular-nums">
              {policy.previousVersion}
            </p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-muted-foreground/60" />
          <div className="border border-nest-green/30 bg-nest-green-light/40 px-4 py-3 text-center">
            <p className="text-[10px] font-medium text-nest-green uppercase">
              Current
            </p>
            <p className="text-xl font-semibold font-mono tabular-nums text-nest-green">
              {policy.currentVersion}
            </p>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{policy.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner</span>
            <span className="font-medium">{policy.owner}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Severity</span>
            <span className="font-medium capitalize">{policy.severity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Related incident</span>
            <span className="font-mono text-xs font-medium">
              {policy.relatedIncident}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

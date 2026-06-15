import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  GitCompareArrows,
  PlayCircle,
  RotateCcw,
  ShieldAlert,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { RollbackOption } from "@/lib/types"

type RollbackCardProps = {
  rollback: RollbackOption
  currentVersion: string
  relatedIncident: string
}

export function RollbackCard({
  rollback,
  currentVersion,
  relatedIncident,
}: RollbackCardProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Rollback Option</h3>
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            Roll back from{" "}
            <span className="font-mono font-medium text-foreground">
              {currentVersion}
            </span>{" "}
            to{" "}
            <span className="font-mono font-medium text-foreground">
              {rollback.targetVersion}
            </span>
          </p>
        </div>

        {/* Estimated effects */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Estimated effects
          </p>
          <div className="space-y-1">
            {Object.entries(rollback.effects).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start gap-2 border border-border/60 px-2.5 py-1.5"
              >
                <AlertTriangle className="mt-0.5 size-3 shrink-0 text-nest-amber" />
                <p className="text-xs">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  : <span className="font-medium">{value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {rollback.requiresApproval && (
          <div className="flex items-center gap-2 border border-nest-amber/30 bg-nest-amber-light px-2.5 py-2 text-xs text-nest-amber">
            <ShieldAlert className="size-3.5 shrink-0" />
            Requires approval before rollback
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button className="flex w-full items-center justify-center gap-1.5 border border-nest-red/30 bg-nest-red-light px-3 py-2 text-xs font-medium text-nest-red transition-colors hover:bg-nest-red-light/80">
            <RotateCcw className="size-3.5" />
            Roll back to {rollback.targetVersion}
          </button>
          <button className="flex w-full items-center justify-center gap-1.5 border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted">
            <GitCompareArrows className="size-3.5" />
            Compare versions
          </button>
          <Link
            href={`/topology/replay?incident=${relatedIncident}`}
            className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <PlayCircle className="size-3.5" />
            Open incident replay
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

import { AlertTriangle, Clock, Users, GitBranch, DollarSign } from "lucide-react"
import { StatusBadge } from "@/components/overview/status-badge"
import { incidentReplay } from "@/lib/mock-data/incident-replay"
import { incidentStripClass } from "@/lib/layout-styles"
import type { ReplayEvent } from "@/lib/types"

type IncidentSummaryStripProps = {
  currentEvent?: ReplayEvent
}

export function IncidentSummaryStrip({ currentEvent }: IncidentSummaryStripProps) {
  const data = incidentReplay

  return (
    <div className="shrink-0 border border-nest-red/30 bg-nest-red-light/40">
      <div className={incidentStripClass}>
        <AlertTriangle className="size-4 shrink-0 text-nest-red" />
        <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-mono text-sm font-semibold">{data.id}</span>
            <StatusBadge status="degraded" />
          </div>

          <span className="hidden truncate text-xs font-medium text-foreground md:inline">
            {data.rootCause}
          </span>

          <div className="hidden items-center gap-1 text-xs text-muted-foreground lg:flex">
            <Clock className="size-3 shrink-0" />
            <span className="truncate">Started {data.started}</span>
            <span>·</span>
            <span className="truncate">Detected {data.detected}</span>
          </div>

          <div className="hidden items-center gap-3 text-xs xl:flex">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="size-3 shrink-0" />
              <span className="font-medium text-foreground">
                {data.agentsImpacted}
              </span>{" "}
              agents
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <GitBranch className="size-3 shrink-0" />
              <span className="font-medium text-foreground">
                {data.downstreamTraces}
              </span>{" "}
              traces
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="size-3 shrink-0" />
              <span className="font-medium text-nest-red">{data.costImpact}</span>
            </span>
          </div>
        </div>

        {currentEvent && (
          <div className="flex shrink-0 items-center gap-2 border border-border/60 bg-card px-3">
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              State
            </span>
            <span className="max-w-[140px] truncate text-sm font-semibold">
              {currentEvent.systemState}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

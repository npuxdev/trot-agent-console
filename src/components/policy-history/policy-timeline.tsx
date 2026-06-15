import {
  Check,
  Clock,
  FileText,
  FlaskConical,
  Flag,
  Rocket,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { PolicyTimelineEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

const actionIcons: Record<string, typeof Clock> = {
  "Draft created": FileText,
  "Simulation run": FlaskConical,
  "Traces flagged": Flag,
  "Approval requested": ShieldCheck,
  "Approved": Check,
  "Deployed to production": Rocket,
  "Impact measured": Clock,
  "Rollback available": RotateCcw,
}

type PolicyTimelineProps = {
  events: PolicyTimelineEvent[]
}

export function PolicyTimeline({ events }: PolicyTimelineProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-medium">Policy Timeline</h3>

        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />

          {events.map((event, i) => {
            const Icon = actionIcons[event.action] ?? Clock
            const isLast = i === events.length - 1

            return (
              <div key={event.id} className="relative flex gap-4 pb-4 last:pb-0">
                {/* Dot */}
                <div
                  className={cn(
                    "relative z-10 flex size-6 shrink-0 items-center justify-center border bg-card",
                    i === 0
                      ? "border-nest-blue/40"
                      : isLast
                        ? "border-nest-amber/40"
                        : "border-border/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3",
                      i === 0
                        ? "text-nest-blue"
                        : isLast
                          ? "text-nest-amber"
                          : "text-muted-foreground"
                    )}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{event.action}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {event.actor}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {event.timestamp}
                  </p>
                  {event.details && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.details}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

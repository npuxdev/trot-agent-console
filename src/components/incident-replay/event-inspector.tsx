import Link from "next/link"
import {
  ArrowUpRight,
  Clock,
  Cpu,
  Shield,
  Zap,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { MetricComparison } from "@/components/shared/metric-comparison"
import { railCardClass } from "@/lib/card-styles"
import type { ReplayEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, typeof Zap> = {
  latency: Clock,
  retry: Zap,
  "slo-breach": Zap,
  policy: Shield,
  containment: Shield,
  detection: Cpu,
}

type EventInspectorProps = {
  event: ReplayEvent | null
}

export function EventInspector({ event }: EventInspectorProps) {
  if (!event) {
    return (
      <Card className={railCardClass}>
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium">Event Inspector</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Select a timeline event to view its details, affected components,
            metric changes, and suggested actions.
          </p>
        </CardContent>
      </Card>
    )
  }

  const Icon = categoryIcons[event.category] ?? Zap

  return (
    <Card className={cn(railCardClass, "overflow-hidden")}>
      <CardContent className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center border border-nest-red/30 bg-nest-red-light text-nest-red">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold">{event.eventType}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {event.timestamp}
            </p>
          </div>
        </div>

        {/* Source */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Source
          </p>
          <p className="text-sm font-medium">{event.sourceComponent}</p>
        </div>

        {/* Affected components */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Affected components
          </p>
          <div className="flex flex-wrap gap-1">
            {event.affectedComponents.map((c) => (
              <span
                key={c}
                className="border border-border/60 bg-muted/40 px-1.5 py-0.5 text-xs font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Metric change */}
        {event.metricBefore && event.metricAfter && (
          <MetricComparison
            label="Metric change"
            before={event.metricBefore}
            after={event.metricAfter}
          />
        )}

        {/* Policy triggered */}
        {event.policyTriggered && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Policy triggered
            </p>
            <div className="flex items-center gap-1.5 border border-[#7c3aed]/20 bg-[#f5f3ff] px-2.5 py-1.5 text-xs font-medium text-[#7c3aed]">
              <Shield className="size-3" />
              {event.policyTriggered}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Analysis
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {event.explanation}
          </p>
        </div>

        {/* Suggested action */}
        {event.suggestedAction && (
          <Link
            href={event.suggestedAction.href}
            className="inline-flex items-center gap-1.5 bg-nest-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-nest-green/90"
          >
            {event.suggestedAction.label}
            <ArrowUpRight className="size-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

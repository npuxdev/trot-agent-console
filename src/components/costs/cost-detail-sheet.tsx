"use client"

import Link from "next/link"
import { Activity } from "lucide-react"

import { Sheet, SheetSection, SheetStat } from "@/components/ui/sheet"
import { costByModel } from "@/lib/mock-data/costs"
import type { CostByModel, HighCostTrace } from "@/lib/types"

export function HighCostTraceDetailSheet({
  trace,
  onOpenChange,
}: {
  trace: HighCostTrace | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet
      open={Boolean(trace)}
      onOpenChange={onOpenChange}
      eyebrow="High-cost trace"
      title={trace?.operation ?? "Trace"}
      description={trace?.agent}
      footer={
        trace && (
          <Link
            href={`/observability?trace=${trace.traceId}`}
            className="inline-flex items-center gap-1.5 bg-nest-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-nest-green/90"
          >
            <Activity className="size-3.5" />
            Open trace waterfall
          </Link>
        )
      }
    >
      {trace && (
        <div className="space-y-6">
          <SheetSection title="Cost">
            <div className="grid grid-cols-2 gap-2">
              <SheetStat label="Trace cost" value={trace.cost} tone="warning" />
              <SheetStat label="Trace ID" value={trace.traceId} />
            </div>
          </SheetSection>

          <SheetSection title="Cost driver">
            <p className="border border-border/70 bg-background/60 px-3 py-2.5 text-sm text-muted-foreground">
              {trace.reason}
            </p>
          </SheetSection>
        </div>
      )}
    </Sheet>
  )
}

export function ModelDetailSheet({
  model,
  onOpenChange,
}: {
  model: CostByModel | null
  onOpenChange: (open: boolean) => void
}) {
  const totalSpend = costByModel.reduce((sum, m) => sum + m.spend, 0)
  const share = model ? Math.round((model.spend / totalSpend) * 100) : 0

  return (
    <Sheet
      open={Boolean(model)}
      onOpenChange={onOpenChange}
      eyebrow="Model spend"
      title={model?.model ?? "Model"}
      description={model ? `${share}% of total model spend` : undefined}
    >
      {model && (
        <div className="space-y-6">
          <SheetSection title="Usage">
            <div className="grid grid-cols-3 gap-2">
              <SheetStat
                label="Spend"
                value={`$${model.spend.toLocaleString()}`}
              />
              <SheetStat label="Tokens" value={model.tokens} />
              <SheetStat label="Requests" value={model.requests} />
            </div>
          </SheetSection>

          <SheetSection title="Share of model spend">
            <div className="h-3 w-full bg-muted">
              <div
                className="h-full bg-nest-green"
                style={{ width: `${share}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ${model.spend.toLocaleString()} of ${totalSpend.toLocaleString()}{" "}
              total
            </p>
          </SheetSection>
        </div>
      )}
    </Sheet>
  )
}

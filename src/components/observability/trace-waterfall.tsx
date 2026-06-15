"use client"

import { AlertTriangle, Maximize2, Minimize2, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { TraceSpan } from "@/lib/types"
import { cn } from "@/lib/utils"

type TraceWaterfallProps = {
  spans: TraceSpan[]
  totalMs: number
  selectedSpanId: string | null
  onSelectSpan: (spanId: string) => void
  showDetailsPanel?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

function pct(ms: number, totalMs: number) {
  return (ms / totalMs) * 100
}

function SpanTreeRow({
  span,
  selectedSpanId,
  onSelectSpan,
}: {
  span: TraceSpan
  selectedSpanId: string | null
  onSelectSpan: (spanId: string) => void
}) {
  const isSelected = selectedSpanId === span.id

  return (
    <button
      type="button"
      onClick={() => onSelectSpan(span.id)}
      className={cn(
        "flex h-8 w-full items-center gap-2 border-b border-border/50 px-2.5 text-left text-sm transition-colors hover:bg-muted/30",
        (span.highlighted || isSelected) && "bg-nest-orange-light/60"
      )}
      style={{ paddingLeft: `${12 + span.depth * 16}px` }}
    >
      {span.icon === "warning" && (
        <AlertTriangle className="size-3.5 shrink-0 text-nest-orange" />
      )}
      {span.icon === "retry" && (
        <RotateCcw className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <span
        className={cn(
          "truncate",
          span.highlighted || isSelected
            ? "font-medium text-foreground"
            : "text-muted-foreground"
        )}
      >
        {span.label}
      </span>
    </button>
  )
}

function TimelineRow({
  span,
  totalMs,
  selectedSpanId,
  onSelectSpan,
}: {
  span: TraceSpan
  totalMs: number
  selectedSpanId: string | null
  onSelectSpan: (spanId: string) => void
}) {
  const left = pct(span.startMs, totalMs)
  const width = pct(span.durationMs, totalMs)
  const isSelected = selectedSpanId === span.id

  return (
    <button
      type="button"
      onClick={() => onSelectSpan(span.id)}
      className={cn(
        "relative h-8 w-full overflow-hidden border-b border-border/50 text-left transition-colors hover:bg-muted/20",
        (span.highlighted || isSelected) && "bg-nest-orange-light/40"
      )}
    >
      {span.color !== "none" && (
        <div
          className={cn(
            "absolute top-1/2 h-4 -translate-y-1/2 rounded-none",
            span.color === "green" && "bg-nest-green",
            span.color === "orange" && "bg-nest-orange/80",
            span.color === "red" && "bg-nest-red"
          )}
          style={{ left: `${left}%`, width: `${width}%` }}
        >
          {span.barLabel && (
            <span className="absolute inset-0 flex items-center truncate px-2 text-[10px] font-medium text-white">
              {span.barLabel}
            </span>
          )}
        </div>
      )}

      {span.nestedBars?.map((bar) => (
        <div
          key={bar.label}
          className={cn(
            "absolute top-1/2 h-3 -translate-y-1/2 rounded-none",
            bar.color === "red" ? "bg-nest-red" : "bg-nest-green"
          )}
          style={{
            left: `${pct(bar.startMs, totalMs)}%`,
            width: `${pct(bar.durationMs, totalMs)}%`,
          }}
        >
          <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-medium text-white">
            {bar.label}
          </span>
        </div>
      ))}
    </button>
  )
}

function SpanDetailsContent({ span }: { span: TraceSpan | null }) {
  if (!span?.details) {
    return (
      <div className="flex flex-1 items-center justify-center px-3 py-8 text-center text-xs text-muted-foreground">
        Select a span to view details
      </div>
    )
  }

  const { details } = span

  return (
    <div className="space-y-3 px-3 py-3 text-sm">
      <DetailField label="Span ID" value={details.spanId} />
      <DetailField label="Start Time" value={details.startTime} />
      <DetailField label="End Time" value={details.endTime} />
      <DetailField
        label="Duration"
        value={details.duration}
        highlight={span.highlighted}
      />

      {details.logs && details.logs.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Logs
          </p>
          {details.logs.map((log) => (
            <Badge
              key={log}
              variant="outline"
              className="rounded-full border-[#e8dcc8] bg-[#f5f0e6] px-3 py-1 text-xs font-normal text-[#8b6914]"
            >
              {log}
            </Badge>
          ))}
        </div>
      )}

      {details.tags && details.tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {details.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full font-mono text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SpanDetailsPanel({
  span,
  embedded = false,
  className,
}: {
  span: TraceSpan | null
  embedded?: boolean
  className?: string
}) {
  const header = (
    <div className="border-b border-border/60 px-3 py-2">
      <h3 className="text-sm font-semibold">Span Details</h3>
      {span?.label && (
        <p className="truncate text-xs text-muted-foreground">{span.label}</p>
      )}
    </div>
  )

  if (embedded) {
    return (
      <div
        className={cn(
          "flex w-[240px] shrink-0 flex-col self-stretch border-l border-border/60 bg-[#fafaf8]",
          className
        )}
      >
        {header}
        <SpanDetailsContent span={span} />
      </div>
    )
  }

  return (
    <Card className={cn(overviewCardClass, "flex flex-col overflow-hidden", className)}>
      {header}
      <SpanDetailsContent span={span} />
    </Card>
  )
}

function DetailField({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-medium", highlight && "text-nest-orange")}>
        {value}
      </p>
    </div>
  )
}

export function TraceWaterfall({
  spans,
  totalMs,
  selectedSpanId,
  onSelectSpan,
  showDetailsPanel = true,
  expanded = false,
  onExpandedChange,
}: TraceWaterfallProps) {
  const ticks = [0, 1000, 2000, 3000].filter((t) => t <= totalMs)
  if (!ticks.includes(totalMs) && totalMs > 3000) {
    ticks.push(totalMs)
  }

  const selectedSpan =
    spans.find((s) => s.id === selectedSpanId) ?? spans[0] ?? null

  return (
    <Card className={cn(overviewCardClass, "overflow-hidden")}>
      <CardHeader className="border-b border-border/60 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            Distributed Trace Waterfall
          </CardTitle>
          {onExpandedChange && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onExpandedChange(!expanded)}
              aria-label={
                expanded ? "Collapse waterfall" : "Expand waterfall to full width"
              }
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              {expanded ? (
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex min-w-0">
          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="grid w-max min-w-full grid-cols-[minmax(200px,260px)_minmax(480px,1fr)]">
              <div className="border-r border-border/60">
                <div className="flex h-7 items-center border-b border-border/60 px-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Service & Operation
                </div>
                {spans.map((span) => (
                  <SpanTreeRow
                    key={span.id}
                    span={span}
                    selectedSpanId={selectedSpanId}
                    onSelectSpan={onSelectSpan}
                  />
                ))}
              </div>

              <div className="min-w-[480px]">
                <div className="flex h-7 items-center border-b border-border/60 px-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Timeline
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0">
                    {ticks.map((tick) => (
                      <div
                        key={tick}
                        className="absolute top-0 bottom-0 w-px bg-border/40"
                        style={{ left: `${pct(tick, totalMs)}%` }}
                      />
                    ))}
                  </div>
                  {spans.map((span) => (
                    <TimelineRow
                      key={span.id}
                      span={span}
                      totalMs={totalMs}
                      selectedSpanId={selectedSpanId}
                      onSelectSpan={onSelectSpan}
                    />
                  ))}
                </div>
                <div className="relative flex h-7 items-center border-t border-border/60 px-2.5">
                  {ticks.map((tick) => (
                    <span
                      key={tick}
                      className="absolute text-[10px] text-muted-foreground"
                      style={{
                        left: `${pct(tick, totalMs)}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {tick === 0 ? "0ms" : tick >= 1000 ? `${tick / 1000}s` : `${tick}ms`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showDetailsPanel && (
            <SpanDetailsPanel span={selectedSpan} embedded />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ArrowUpRight, Bot } from "lucide-react"

import { StatusBadge } from "@/components/overview/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { Trace } from "@/lib/types"
import { cn } from "@/lib/utils"

type TraceSummaryProps = {
  trace: Trace
  layout?: "banner" | "sidebar"
  className?: string
}

function CopyTraceButton({ traceId }: { traceId: string }) {
  const [showCopiedNotification, setShowCopiedNotification] = useState(false)

  useEffect(() => {
    if (!showCopiedNotification) return

    const timer = window.setTimeout(() => setShowCopiedNotification(false), 3000)
    return () => window.clearTimeout(timer)
  }, [showCopiedNotification])

  async function copyTraceUrl() {
    const url = `${window.location.origin}/observability?trace=${traceId}`
    await navigator.clipboard.writeText(url)
    setShowCopiedNotification(true)
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copyTraceUrl}
        aria-label="Copy trace URL"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <ArrowUpRight className="size-3.5" />
      </Button>

      {showCopiedNotification && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-md animate-in fade-in slide-in-from-bottom-2"
        >
          Trace ID URL Copied to Clipboard
        </div>
      )}
    </>
  )
}

function MetadataField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate font-medium">{value}</p>
    </div>
  )
}

function baselineDeltaPct(trace: Trace): number | null {
  if (!trace.baselineMs || trace.baselineMs <= 0) return null
  return Math.round(((trace.durationMs - trace.baselineMs) / trace.baselineMs) * 100)
}

function DurationField({ trace }: { trace: Trace }) {
  const delta = baselineDeltaPct(trace)
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">Duration</p>
      <p className="truncate font-medium">{trace.duration}</p>
      {delta !== null && delta !== 0 && (
        <p
          className={cn(
            "text-[11px] font-medium tabular-nums",
            delta > 0 ? "text-nest-orange" : "text-nest-green"
          )}
        >
          {delta > 0 ? "+" : ""}
          {delta}% from baseline
        </p>
      )}
    </div>
  )
}

export function TraceSummary({
  trace,
  layout = "banner",
  className,
}: TraceSummaryProps) {
  if (layout === "sidebar") {
    return (
      <Card className={cn(overviewCardClass, className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold">Trace Summary</CardTitle>
            <CopyTraceButton traceId={trace.id} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-mono text-base font-semibold tracking-tight">
              {trace.id}
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge status={trace.status} />
              {trace.status === "degraded" && (
                <AlertTriangle className="size-3.5 text-nest-orange" />
              )}
            </div>
            <p className="text-sm font-medium">{trace.operation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <DurationField trace={trace} />
            {trace.degradedMs && trace.degradedPct ? (
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Degraded</p>
                <p className="font-medium text-nest-orange">
                  {(trace.degradedMs / 1000).toFixed(2)}s ({trace.degradedPct}%)
                </p>
              </div>
            ) : (
              <MetadataField label="Recorded" value={trace.time} />
            )}
            {trace.cost && <MetadataField label="Cost / exec" value={trace.cost} />}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {trace.description}
          </p>

          <div className="space-y-3 border-t border-border/60 pt-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex size-7 items-center justify-center rounded-full bg-muted">
                <Bot className="size-3.5 text-muted-foreground" />
              </span>
              <span className="truncate">{trace.agent}</span>
            </div>
            <MetadataField label="Team" value={trace.team} />
            <MetadataField label="Environment" value={trace.environment} />
            <MetadataField label="Version" value={trace.version} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(overviewCardClass, className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Trace Summary
          </CardTitle>
          <CopyTraceButton traceId={trace.id} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-mono text-lg font-semibold tracking-tight">
              {trace.id}
            </h2>
            <StatusBadge status={trace.status} />
            {trace.status === "degraded" && (
              <AlertTriangle className="size-3.5 text-nest-orange" />
            )}
          </div>
          <p className="text-sm font-medium">{trace.operation}</p>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {trace.description}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4 lg:w-[min(100%,20rem)] lg:grid-cols-2">
          <DurationField trace={trace} />
          {trace.degradedMs && trace.degradedPct ? (
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Degraded</p>
              <p className="font-medium text-nest-orange">
                {(trace.degradedMs / 1000).toFixed(2)}s ({trace.degradedPct}%)
              </p>
            </div>
          ) : (
            <MetadataField label="Recorded" value={trace.time} />
          )}
          <MetadataField label="Cost / exec" value={trace.cost ?? "—"} />
          <MetadataField label="Agent" value={trace.agent} />
        </div>
      </CardContent>
    </Card>
  )
}

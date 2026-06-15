"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import {
  DEFAULT_TRACE_ID,
  getSpansForTrace,
  getTraceById,
} from "@/lib/mock-data/traces"
import { cn } from "@/lib/utils"

import { TraceList } from "./trace-list"
import { TraceSummary } from "./trace-summary"
import { SpanDetailsPanel, TraceWaterfall } from "./trace-waterfall"

export function ObservabilityWorkspace() {
  const searchParams = useSearchParams()
  const traceId = searchParams.get("trace") ?? DEFAULT_TRACE_ID
  const trace = getTraceById(traceId) ?? getTraceById(DEFAULT_TRACE_ID)!
  const spans = getSpansForTrace(trace.id)
  const [isWaterfallExpanded, setIsWaterfallExpanded] = useState(false)

  const defaultSpanId = trace.defaultSpanId ?? spans[0]?.id ?? null
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null)

  useEffect(() => {
    setIsWaterfallExpanded(false)
  }, [trace.id])

  const effectiveSpanId = useMemo(() => {
    if (selectedSpanId && spans.some((s) => s.id === selectedSpanId)) {
      return selectedSpanId
    }
    return defaultSpanId
  }, [selectedSpanId, spans, defaultSpanId])

  const selectedSpan =
    spans.find((s) => s.id === effectiveSpanId) ?? spans[0] ?? null

  const hasSpanDetail = trace.hasSpanDetail && spans.length > 0

  return (
    <div
      className={cn(
        "grid gap-4 lg:items-start",
        isWaterfallExpanded
          ? "grid-cols-1"
          : "lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,260px)_minmax(0,1fr)_minmax(220px,280px)]"
      )}
    >
      {!isWaterfallExpanded && <TraceList selectedTraceId={trace.id} />}

      <div
        className={cn(
          "min-w-0 space-y-4",
          isWaterfallExpanded && "col-span-full"
        )}
      >
        {!isWaterfallExpanded && (
          <TraceSummary trace={trace} layout="banner" className="xl:hidden" />
        )}

        {hasSpanDetail ? (
          <>
            <TraceWaterfall
              spans={spans}
              totalMs={trace.durationMs}
              selectedSpanId={effectiveSpanId}
              onSelectSpan={setSelectedSpanId}
              showDetailsPanel={false}
              expanded={isWaterfallExpanded}
              onExpandedChange={setIsWaterfallExpanded}
            />
            <SpanDetailsPanel
              span={selectedSpan}
              className={isWaterfallExpanded ? undefined : "xl:hidden"}
            />
          </>
        ) : (
          <Card className={overviewCardClass}>
            <CardContent className="flex min-h-[280px] items-center justify-center px-6 py-12 text-center text-sm text-muted-foreground">
              Span detail not available for this trace. Select TRC-7419-A for the
              full distributed trace waterfall.
            </CardContent>
          </Card>
        )}
      </div>

      {!isWaterfallExpanded && (
        <aside className="hidden min-w-0 space-y-4 xl:sticky xl:top-4 xl:block">
          <TraceSummary trace={trace} layout="sidebar" />
          {hasSpanDetail && <SpanDetailsPanel span={selectedSpan} />}
        </aside>
      )}
    </div>
  )
}

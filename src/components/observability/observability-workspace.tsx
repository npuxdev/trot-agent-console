"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import {
  DEFAULT_TRACE_ID,
  getSpansForTrace,
  getTraceById,
} from "@/lib/mock-data/traces"

import { TraceList } from "./trace-list"
import { TraceSummary } from "./trace-summary"
import { TraceWaterfall } from "./trace-waterfall"

export function ObservabilityWorkspace() {
  const searchParams = useSearchParams()
  const traceId = searchParams.get("trace") ?? DEFAULT_TRACE_ID
  const trace = getTraceById(traceId) ?? getTraceById(DEFAULT_TRACE_ID)!
  const spans = getSpansForTrace(trace.id)

  const defaultSpanId = trace.defaultSpanId ?? spans[0]?.id ?? null
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null)

  const effectiveSpanId = useMemo(() => {
    if (selectedSpanId && spans.some((s) => s.id === selectedSpanId)) {
      return selectedSpanId
    }
    return defaultSpanId
  }, [selectedSpanId, spans, defaultSpanId])

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <TraceList selectedTraceId={trace.id} />

      <div className="min-w-0 space-y-5">
        <TraceSummary trace={trace} />

        {trace.hasSpanDetail && spans.length > 0 ? (
          <TraceWaterfall
            spans={spans}
            totalMs={trace.durationMs}
            selectedSpanId={effectiveSpanId}
            onSelectSpan={setSelectedSpanId}
          />
        ) : (
          <Card className={overviewCardClass}>
            <CardContent className="flex min-h-[200px] items-center justify-center py-12 text-center text-sm text-muted-foreground">
              Span detail not available for this trace. Select TRC-7419-A for the
              full distributed trace waterfall.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

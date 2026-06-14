"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { StatusBadge } from "@/components/overview/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { traces } from "@/lib/mock-data/traces"
import { cn } from "@/lib/utils"

type TraceListProps = {
  selectedTraceId: string
}

export function TraceList({ selectedTraceId }: TraceListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function selectTrace(traceId: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("trace", traceId)
    router.push(`/observability?${params.toString()}`)
  }

  return (
    <Card className={cn(overviewCardClass, "h-fit")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Traces</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/40">
          {traces.map((trace) => (
            <li key={trace.id}>
              <button
                type="button"
                onClick={() => selectTrace(trace.id)}
                className={cn(
                  "flex w-full flex-col gap-1 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40",
                  selectedTraceId === trace.id && "bg-nest-orange-light/40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{trace.id}</span>
                  <StatusBadge status={trace.status} />
                </div>
                <span className="truncate text-muted-foreground">
                  {trace.operation}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{trace.duration}</span>
                  <span>{trace.time}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

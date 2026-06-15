"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { StatusBadge } from "@/components/overview/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { overviewCardClass } from "@/lib/card-styles"
import { traces } from "@/lib/mock-data/traces"
import { cn } from "@/lib/utils"

type TraceListProps = {
  selectedTraceId: string
  className?: string
}

export function TraceList({ selectedTraceId, className }: TraceListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function selectTrace(traceId: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("trace", traceId)
    router.push(`/observability?${params.toString()}`)
  }

  return (
    <Card
      className={cn(
        overviewCardClass,
        "flex h-fit flex-col overflow-hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)]",
        className
      )}
    >
      <CardHeader className="shrink-0 border-b border-border/60 pb-2">
        <CardTitle className="text-sm font-semibold">Traces</CardTitle>
        <p className="text-xs text-muted-foreground">
          {traces.length} recent traces
        </p>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea className="h-full max-h-[min(70vh,640px)] lg:max-h-none">
          <ul className="divide-y divide-border/40">
            {traces.map((trace) => (
              <li key={trace.id}>
                <button
                  type="button"
                  onClick={() => selectTrace(trace.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40",
                    selectedTraceId === trace.id &&
                      "border-l-2 border-l-nest-green bg-nest-green-light/30 pl-[calc(1rem-2px)]"
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
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

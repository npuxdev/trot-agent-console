import { AlertTriangle, Bot } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { overviewCardClass } from "@/lib/card-styles"
import type { Trace } from "@/lib/types"

type TraceSummaryProps = {
  trace: Trace
}

export function TraceSummary({ trace }: TraceSummaryProps) {
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Trace Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Trace: {trace.id}
          </h2>
          <Badge
            className={
              trace.status === "degraded"
                ? "h-6 gap-1.5 rounded-full border-0 bg-nest-orange-light px-2.5 text-nest-orange hover:bg-nest-orange-light"
                : trace.status === "warning"
                  ? "h-6 gap-1.5 rounded-full border-0 bg-[#fef9c3] px-2.5 text-[#a16207] hover:bg-[#fef9c3]"
                  : "h-6 gap-1.5 rounded-full border-0 bg-nest-green-light px-2.5 text-[#166534] hover:bg-nest-green-light"
            }
          >
            {trace.status === "degraded" && <AlertTriangle className="size-3" />}
            Status: {trace.status === "success" ? "Success" : trace.status.charAt(0).toUpperCase() + trace.status.slice(1)}
          </Badge>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
          <span>
            <span className="text-muted-foreground">Total Duration: </span>
            <span className="font-medium">{trace.duration}</span>
          </span>
          {trace.degradedMs && trace.degradedPct && (
            <span className="font-medium text-nest-orange">
              {(trace.degradedMs / 1000).toFixed(2)}s ({trace.degradedPct}%) Degraded
            </span>
          )}
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {trace.description}
        </p>

        <Separator />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex size-7 items-center justify-center rounded-full bg-muted">
              <Bot className="size-3.5 text-muted-foreground" />
            </span>
            {trace.agent}
          </div>
          <span className="text-muted-foreground">
            Team: <span className="text-foreground">{trace.team}</span>
          </span>
          <span className="text-muted-foreground">
            Environment: <span className="text-foreground">{trace.environment}</span>
          </span>
          <span className="text-muted-foreground">
            Version: <span className="text-foreground">{trace.version}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

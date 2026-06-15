import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeltaIndicator } from "./delta-indicator"

type MetricComparisonProps = {
  label: string
  before: string
  after: string
  delta?: string
  deltaDirection?: "up" | "down" | "flat"
  deltaTone?: "positive" | "negative" | "neutral"
  className?: string
}

export function MetricComparison({
  label,
  before,
  after,
  delta,
  deltaDirection,
  deltaTone,
  className,
}: MetricComparisonProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex items-center gap-1.5 text-sm tabular-nums">
        <span className="text-muted-foreground">{before}</span>
        <ArrowRight className="size-3 shrink-0 text-muted-foreground/60" />
        <span className="font-medium">{after}</span>
        {delta && deltaDirection && (
          <DeltaIndicator value={delta} direction={deltaDirection} tone={deltaTone} />
        )}
      </div>
    </div>
  )
}

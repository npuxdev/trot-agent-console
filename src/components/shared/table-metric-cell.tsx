import { DeltaIndicator } from "@/components/shared/delta-indicator"
import {
  Sparkline,
  SPARKLINE_HEIGHT,
  SPARKLINE_WIDTH,
} from "@/components/shared/sparkline"
import { cn } from "@/lib/utils"

type MetricDelta = {
  value: string
  direction: "up" | "down" | "flat"
  tone?: "positive" | "negative" | "neutral"
}

type TableMetricCellProps = {
  value: string
  delta?: MetricDelta
  sparkline?: number[]
  sparklineColor?: string
  className?: string
}

export function TableMetricCell({
  value,
  delta,
  sparkline,
  sparklineColor,
  className,
}: TableMetricCellProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="tabular-nums">{value}</span>
      {delta && delta.direction !== "flat" && (
        <DeltaIndicator
          value={delta.value}
          direction={delta.direction}
          tone={delta.tone}
        />
      )}
      {sparkline && sparkline.length >= 2 && (
        <Sparkline
          data={sparkline}
          width={SPARKLINE_WIDTH}
          height={SPARKLINE_HEIGHT}
          color={sparklineColor}
        />
      )}
    </div>
  )
}

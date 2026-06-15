import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type DeltaDirection = "up" | "down" | "flat"
type DeltaTone = "positive" | "negative" | "neutral"

type DeltaIndicatorProps = {
  value: string
  direction?: DeltaDirection
  /** Override automatic tone. By default: up=negative, down=positive. */
  tone?: DeltaTone
  className?: string
}

const toneStyles: Record<DeltaTone, string> = {
  positive: "text-nest-green",
  negative: "text-nest-red",
  neutral: "text-muted-foreground",
}

const defaultTone: Record<DeltaDirection, DeltaTone> = {
  up: "negative",
  down: "positive",
  flat: "neutral",
}

const icons: Record<DeltaDirection, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: Minus,
}

export function DeltaIndicator({
  value,
  direction = "up",
  tone,
  className,
}: DeltaIndicatorProps) {
  const resolvedTone = tone ?? defaultTone[direction]
  const Icon = icons[direction]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        toneStyles[resolvedTone],
        className
      )}
    >
      <Icon className="size-3 shrink-0" />
      {value}
    </span>
  )
}

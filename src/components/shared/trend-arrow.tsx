import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type TrendDirection = "up" | "down" | "flat"

type TrendArrowProps = {
  direction: TrendDirection
  /** Override automatic coloring. By default: up=red, down=green, flat=muted. */
  positive?: boolean
  className?: string
}

export function TrendArrow({ direction, positive, className }: TrendArrowProps) {
  const isGood =
    positive !== undefined
      ? positive
      : direction === "down"

  const colorClass = direction === "flat"
    ? "text-muted-foreground"
    : isGood
      ? "text-nest-green"
      : "text-nest-red"

  const Icon =
    direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus

  return <Icon className={cn("size-3.5 shrink-0", colorClass, className)} />
}

import { cn } from "@/lib/utils"

export const SPARKLINE_WIDTH = 48
export const SPARKLINE_HEIGHT = 16
export const SPARKLINE_STROKE = 1.25
export const SPARKLINE_PADDING = 2

type SparklineProps = {
  data: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}

export function Sparkline({
  data,
  width = SPARKLINE_WIDTH,
  height = SPARKLINE_HEIGHT,
  color = "#64748b",
  className,
}: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const innerHeight = height - SPARKLINE_PADDING * 2

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y =
        SPARKLINE_PADDING +
        innerHeight -
        ((v - min) / range) * innerHeight
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("inline-block shrink-0", className)}
      role="img"
      aria-label="Sparkline chart"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={SPARKLINE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

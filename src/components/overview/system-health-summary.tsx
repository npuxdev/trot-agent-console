import { Timer, Users, XCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkline } from "@/components/shared/sparkline"
import { overviewCardClass } from "@/lib/overview-data"

function AgentPieChart() {
  const segments = [
    { value: 230, color: "#22c55e", label: "Healthy" },
    { value: 15, color: "#eab308", label: "Slow" },
    { value: 3, color: "#dc2626", label: "Degraded" },
  ]
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  let offset = 0

  return (
    <div className="flex items-center gap-3">
      <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
        {segments.map((segment) => {
          const pct = segment.value / total
          const dash = pct * 2 * Math.PI * 22
          const gap = 2 * Math.PI * 22 - dash
          const rotation = (offset / total) * 360 - 90
          offset += segment.value

          return (
            <circle
              key={segment.label}
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke={segment.color}
              strokeWidth="8"
              strokeDasharray={`${dash} ${gap}`}
              transform={`rotate(${rotation} 28 28)`}
            />
          )
        })}
        <circle cx="28" cy="28" r="14" fill="white" />
      </svg>
      <div className="space-y-0.5 text-[10px] text-muted-foreground">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span>
              {segment.value} {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActiveAgentsCard() {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="flex items-start justify-between gap-3 pt-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Active Agents
          </p>
          <p className="text-3xl font-semibold tracking-tight">
            248{" "}
            <span className="text-lg font-normal text-muted-foreground">
              / 262 Total
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            All critical services operational.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="flex size-9 items-center justify-center border border-border/70 bg-muted/50">
            <Users className="size-4 text-muted-foreground" />
          </span>
          <AgentPieChart />
        </div>
      </CardContent>
    </Card>
  )
}

function LatencySparkline() {
  return (
    <Sparkline
      data={[1.18, 1.22, 1.2, 1.26, 1.24, 1.3, 1.28, 1.32, 1.31, 1.32]}
      color="#2563eb"
    />
  )
}

export function LatencyCard() {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="flex items-start justify-between gap-3 pt-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Mean A2A Latency
          </p>
          <p className="text-3xl font-semibold tracking-tight">1.32s</p>
          <p className="text-sm font-medium text-nest-red">
            +0.05s over last hour
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="flex size-9 items-center justify-center border border-border/70 bg-muted/50">
            <Timer className="size-4 text-muted-foreground" />
          </span>
          <LatencySparkline />
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorRateBars() {
  const bars = [12, 18, 10, 22, 14, 16, 8, 20, 12, 15]

  return (
    <svg width="96" height="28" viewBox="0 0 96 28" className="text-[#3b82f6]">
      {bars.map((height, i) => (
        <rect
          key={i}
          x={i * 10 + 2}
          y={28 - height}
          width="6"
          height={height}
          rx="1"
          fill="currentColor"
          opacity={0.7 + (i % 3) * 0.1}
        />
      ))}
    </svg>
  )
}

export function ErrorRateCard() {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="flex items-start justify-between gap-3 pt-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            System Error Rate
          </p>
          <p className="text-3xl font-semibold tracking-tight">0.85%</p>
          <p className="text-sm font-medium text-nest-green">
            -0.02% over last hour
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="flex size-9 items-center justify-center border border-nest-red/20 bg-nest-red-light">
            <XCircle className="size-4 text-nest-red" />
          </span>
          <ErrorRateBars />
        </div>
      </CardContent>
    </Card>
  )
}

export function SystemHealthSummary() {
  const timestamp = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date())

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        System Health Summary — As of {timestamp}
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        <ActiveAgentsCard />
        <LatencyCard />
        <ErrorRateCard />
      </div>
    </section>
  )
}

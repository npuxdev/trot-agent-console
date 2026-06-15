import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { AgentLifecycle } from "@/lib/types"
import { cn } from "@/lib/utils"

type ReadinessPanelProps = {
  lifecycle: AgentLifecycle
  compact?: boolean
}

const riskColors: Record<string, string> = {
  high: "border-nest-red/25 bg-nest-red-light/60 text-nest-red",
  medium: "border-nest-amber/25 bg-nest-amber-light/60 text-nest-amber",
  low: "border-border bg-muted/30 text-muted-foreground",
}

export function ReadinessPanel({ lifecycle, compact = false }: ReadinessPanelProps) {
  const { readiness, risks } = lifecycle

  return (
    <div className="space-y-3">
      {/* Readiness scores — secondary */}
      <Card className={overviewCardClass}>
        <CardContent className="space-y-3 p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Readiness signals
          </p>

          <div className="space-y-1.5">
            {[
              { label: "Simulation pass rate", value: `${readiness.simulationPassRate}%` },
              { label: "Policy coverage", value: readiness.policyCoverage },
              { label: "Production latency", value: readiness.productionLatency },
              { label: "Error rate", value: readiness.errorRate },
              ...(compact
                ? []
                : [
                    { label: "Tool permission risk", value: readiness.toolPermissionRisk },
                    { label: "Cost estimate", value: readiness.costEstimate },
                  ]),
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border border-border/60 bg-muted/20 px-2.5 py-1.5"
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-xs font-medium tabular-nums text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risks — toned down */}
      <Card className={overviewCardClass}>
        <CardContent className="space-y-2.5 p-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Active risks
          </p>
          <div className="space-y-1.5">
            {risks.map((risk) => (
              <div
                key={risk.label}
                className={cn(
                  "flex items-start gap-2 border px-2.5 py-2",
                  riskColors[risk.severity]
                )}
              >
                <AlertTriangle className="mt-0.5 size-3 shrink-0 opacity-70" />
                <div className="min-w-0">
                  <p className="text-xs">{risk.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

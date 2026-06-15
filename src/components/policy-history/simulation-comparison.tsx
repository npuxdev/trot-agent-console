import { Card, CardContent } from "@/components/ui/card"
import { DeltaIndicator } from "@/components/shared/delta-indicator"
import { overviewCardClass } from "@/lib/card-styles"
import type { SimulationMetrics } from "@/lib/types"
import { cn } from "@/lib/utils"

type SimulationComparisonProps = {
  expected: SimulationMetrics
  actual: SimulationMetrics
}

type MetricRow = {
  label: string
  expectedValue: string
  actualValue: string
  drift: string
  driftDirection: "up" | "down" | "flat"
  driftTone: "positive" | "negative" | "neutral"
}

export function SimulationComparison({
  expected,
  actual,
}: SimulationComparisonProps) {
  const rows: MetricRow[] = [
    {
      label: "Cascading failures",
      expectedValue: `${expected.cascadingFailures}%`,
      actualValue: `${actual.cascadingFailures}%`,
      drift: `${actual.cascadingFailures - expected.cascadingFailures > 0 ? "+" : ""}${actual.cascadingFailures - expected.cascadingFailures}%`,
      driftDirection: actual.cascadingFailures > expected.cascadingFailures ? "up" : "down",
      driftTone: Math.abs(actual.cascadingFailures) < Math.abs(expected.cascadingFailures) ? "negative" : "positive",
    },
    {
      label: "Cost impact",
      expectedValue: `−$${Math.abs(expected.costImpact)}/day`,
      actualValue: `−$${Math.abs(actual.costImpact)}/day`,
      drift: `$${Math.abs(Math.abs(actual.costImpact) - Math.abs(expected.costImpact))}/day`,
      driftDirection: Math.abs(actual.costImpact) < Math.abs(expected.costImpact) ? "up" : "down",
      driftTone: Math.abs(actual.costImpact) < Math.abs(expected.costImpact) ? "negative" : "positive",
    },
    {
      label: "Approval queue",
      expectedValue: `+${expected.approvalQueue}%`,
      actualValue: `+${actual.approvalQueue}%`,
      drift: `${actual.approvalQueue - expected.approvalQueue > 0 ? "+" : ""}${actual.approvalQueue - expected.approvalQueue}%`,
      driftDirection: actual.approvalQueue < expected.approvalQueue ? "down" : "up",
      driftTone: actual.approvalQueue <= expected.approvalQueue ? "positive" : "negative",
    },
    {
      label: "Traces blocked",
      expectedValue: String(expected.tracesBlocked),
      actualValue: String(actual.tracesBlocked),
      drift: `${actual.tracesBlocked - expected.tracesBlocked}`,
      driftDirection: actual.tracesBlocked < expected.tracesBlocked ? "down" : "flat",
      driftTone: actual.tracesBlocked <= expected.tracesBlocked ? "positive" : "negative",
    },
    {
      label: "Agents affected",
      expectedValue: String(expected.agentsAffected),
      actualValue: String(actual.agentsAffected),
      drift: "0",
      driftDirection: "flat",
      driftTone: "neutral",
    },
    {
      label: "Confidence",
      expectedValue: `${expected.confidence}%`,
      actualValue: `${actual.confidence}%`,
      drift: `${(actual.confidenceDrift ?? actual.confidence - expected.confidence) > 0 ? "+" : ""}${actual.confidenceDrift ?? actual.confidence - expected.confidence}%`,
      driftDirection: (actual.confidenceDrift ?? 0) < 0 ? "down" : "flat",
      driftTone: (actual.confidenceDrift ?? 0) < 0 ? "negative" : "neutral",
    },
  ]

  return (
    <Card className={overviewCardClass}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-2.5 font-medium">Metric</th>
                <th className="px-4 py-2.5 font-medium">Expected</th>
                <th className="px-4 py-2.5 font-medium">Actual</th>
                <th className="px-4 py-2.5 font-medium">Drift</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-2.5 font-medium">{row.label}</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                    {row.expectedValue}
                  </td>
                  <td className="px-4 py-2.5 font-medium tabular-nums">
                    {row.actualValue}
                  </td>
                  <td className="px-4 py-2.5">
                    {row.driftDirection !== "flat" || row.drift !== "0" ? (
                      <DeltaIndicator
                        value={row.drift}
                        direction={row.driftDirection}
                        tone={row.driftTone}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

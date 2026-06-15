import type { PolicyHistory } from "@/lib/types"
import { cn } from "@/lib/utils"
import { overviewCardClass } from "@/lib/card-styles"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { DeltaIndicator } from "@/components/shared/delta-indicator"

type PolicyImpactHeroProps = {
  policy: PolicyHistory
}

export function PolicyImpactHero({ policy }: PolicyImpactHeroProps) {
  const { actual } = policy.versionDiff

  const impacts = [
    {
      label: "Cascading failures",
      value: `${actual.cascadingFailures}%`,
      tone: "positive" as const,
      direction: "down" as const,
    },
    {
      label: "Cost impact",
      value: `−$${Math.abs(actual.costImpact)}/day`,
      tone: "positive" as const,
      direction: "down" as const,
    },
    {
      label: "Approval volume",
      value: `+${actual.approvalQueue}%`,
      tone: "negative" as const,
      direction: "up" as const,
    },
    {
      label: "Confidence",
      value: `${actual.confidence}%`,
      sub: actual.confidenceDrift
        ? `${actual.confidenceDrift}% drift`
        : undefined,
      tone: "neutral" as const,
      direction: "flat" as const,
    },
  ]

  return (
    <Card className={cn(overviewCardClass, "overflow-hidden")}>
      <CardContent className="p-0">
        <div className="border-b border-[#e2e8f0] bg-muted/40 px-5 py-4">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Version comparison · Actual observed impact
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-semibold tabular-nums text-muted-foreground">
                {policy.previousVersion}
              </span>
              <ArrowRight className="size-6 text-muted-foreground/50" />
              <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                {policy.currentVersion}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {policy.name} · deployed to production
            </span>
          </div>
        </div>

        <div className="grid gap-px bg-[#e2e8f0] sm:grid-cols-2 lg:grid-cols-4">
          {impacts.map((item) => (
            <div
              key={item.label}
              className="bg-card px-5 py-4"
            >
              <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                {item.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">
                  {item.value}
                </span>
                {item.direction !== "flat" && (
                  <DeltaIndicator
                    value=""
                    direction={item.direction}
                    tone={item.tone}
                  />
                )}
              </div>
              {item.sub && (
                <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 border-t border-[#e2e8f0] px-5 py-3 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">
              {actual.tracesBlocked}
            </span>{" "}
            traces blocked
          </span>
          <span>
            <span className="font-medium text-foreground">
              {actual.agentsAffected}
            </span>{" "}
            agents affected
          </span>
          <span>
            Related incident{" "}
            <span className="font-mono font-medium text-foreground">
              {policy.relatedIncident}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

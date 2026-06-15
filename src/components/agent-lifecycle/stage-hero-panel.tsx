import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  Check,
  FlaskConical,
  RotateCcw,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { AgentLifecycle, LifecycleStage, LifecycleStageStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const stageLabels: Record<LifecycleStage, string> = {
  design: "Design",
  simulate: "Simulate",
  deploy: "Deploy",
  observe: "Observe",
  govern: "Govern",
  improve: "Improve",
  retire: "Retire",
}

type StageHeroPanelProps = {
  lifecycle: AgentLifecycle
  selectedStage: LifecycleStage
  stageStatuses: Record<LifecycleStage, LifecycleStageStatus>
}

export function StageHeroPanel({
  lifecycle,
  selectedStage,
  stageStatuses,
}: StageHeroPanelProps) {
  const detail = lifecycle.stages[selectedStage]
  const completedCount = Object.values(stageStatuses).filter(
    (s) => s === "complete"
  ).length

  return (
    <Card className={overviewCardClass}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Operating model · {lifecycle.environment}
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                {stageLabels[selectedStage]}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {detail.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                Object.entries(stageStatuses) as [
                  LifecycleStage,
                  LifecycleStageStatus,
                ][]
              ).map(([stage, status]) => (
                <span
                  key={stage}
                  className={cn(
                    "inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-medium uppercase tracking-wide",
                    stage === selectedStage
                      ? "border-border-strong bg-card text-foreground"
                      : status === "complete"
                        ? "border-nest-green/30 bg-nest-green-light/50 text-nest-green"
                        : "border-border bg-muted/50 text-muted-foreground"
                  )}
                >
                  {status === "complete" && <Check className="size-3" />}
                  {stageLabels[stage]}
                </span>
              ))}
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <HeroStat
              label="Stages complete"
              value={`${completedCount} / 7`}
            />
            <HeroStat
              label="Simulation pass"
              value={`${lifecycle.readiness.simulationPassRate}%`}
            />
            <HeroStat
              label="Last deployed"
              value={lifecycle.readiness.lastDeployed}
            />
            <HeroStat
              label="Policy coverage"
              value={lifecycle.readiness.policyCoverage}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Link
            href="/approvals"
            className="inline-flex items-center gap-1.5 bg-nest-green px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-nest-green/90"
          >
            <FlaskConical className="size-3.5" />
            Run mitigation simulation
          </Link>
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-3.5" />
            Rollback to {lifecycle.readiness.rollbackTarget}
          </Link>
          <Link
            href="/observability?trace=TRC-7419-A"
            className="inline-flex items-center gap-1 text-xs font-medium text-nest-blue hover:underline"
          >
            <Activity className="size-3.5" />
            Open latest trace
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-muted/30 px-3 py-2.5">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}

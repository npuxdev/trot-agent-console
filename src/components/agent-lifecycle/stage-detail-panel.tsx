import { Check, Circle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { LifecycleStage, StageDetail } from "@/lib/types"
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

type StageDetailPanelProps = {
  stage: LifecycleStage
  detail: StageDetail
}

export function StageDetailPanel({ stage, detail }: StageDetailPanelProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold">{stageLabels[stage]}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail.description}
          </p>
        </div>

        {/* Tasks */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Tasks
          </p>
          <div className="space-y-1">
            {detail.tasks.map((task) => (
              <div
                key={task.label}
                className={cn(
                  "flex items-start gap-2.5 border px-3 py-2",
                  task.status === "done"
                    ? "border-nest-green/20 bg-nest-green-light/30"
                    : task.status === "active"
                      ? "border-nest-orange/20 bg-nest-orange-light/30"
                      : "border-border/60"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {task.status === "done" ? (
                    <Check className="size-3.5 text-nest-green" />
                  ) : task.status === "active" ? (
                    <Loader2 className="size-3.5 animate-spin text-nest-orange" />
                  ) : (
                    <Circle className="size-3.5 text-muted-foreground/40" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{task.label}</p>
                  {task.value && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {task.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        {detail.metrics && Object.keys(detail.metrics).length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Metrics
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(detail.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="border border-border/60 bg-muted/30 px-2.5 py-2"
                >
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {key}
                  </p>
                  <p className="text-sm font-medium tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

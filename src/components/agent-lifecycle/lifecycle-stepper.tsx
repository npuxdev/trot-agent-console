"use client"

import {
  Check,
  Lock,
  Pencil,
  FlaskConical,
  Rocket,
  Eye,
  Shield,
  Wrench,
  Archive,
} from "lucide-react"

import type { LifecycleStage, LifecycleStageStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const stageConfig: Record<
  LifecycleStage,
  { label: string; icon: typeof Pencil }
> = {
  design: { label: "Design", icon: Pencil },
  simulate: { label: "Simulate", icon: FlaskConical },
  deploy: { label: "Deploy", icon: Rocket },
  observe: { label: "Observe", icon: Eye },
  govern: { label: "Govern", icon: Shield },
  improve: { label: "Improve", icon: Wrench },
  retire: { label: "Retire", icon: Archive },
}

const STAGES: LifecycleStage[] = [
  "design",
  "simulate",
  "deploy",
  "observe",
  "govern",
  "improve",
  "retire",
]

type LifecycleStepperProps = {
  stageStatuses: Record<LifecycleStage, LifecycleStageStatus>
  currentStage: LifecycleStage
  selectedStage: LifecycleStage
  onSelectStage: (stage: LifecycleStage) => void
  isDegraded?: boolean
}

export function LifecycleStepper({
  stageStatuses,
  currentStage,
  selectedStage,
  onSelectStage,
  isDegraded,
}: LifecycleStepperProps) {
  return (
    <div className="flex items-center gap-0">
      {STAGES.map((stage, i) => {
        const config = stageConfig[stage]
        const status = stageStatuses[stage]
        const Icon = config.icon
        const isSelected = stage === selectedStage
        const isCurrent = stage === currentStage
        const isComplete = status === "complete"
        const isLocked = status === "locked"

        return (
          <div key={stage} className="flex items-center">
            <button
              onClick={() => onSelectStage(stage)}
              className={cn(
                "group relative flex items-center gap-2 border px-4 py-2.5 text-sm font-medium transition-all",
                isSelected
                  ? "border-border-strong bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] z-10"
                  : "border-border bg-card hover:bg-muted/60",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLocked}
            >
              {/* Status indicator */}
              <span
                className={cn(
                  "relative flex size-6 shrink-0 items-center justify-center border",
                  isComplete
                    ? "border-nest-green/40 bg-nest-green text-white"
                    : isCurrent && isDegraded
                      ? "border-nest-orange/40 bg-nest-orange-light text-nest-orange"
                      : isCurrent
                        ? "border-nest-blue/40 bg-nest-blue-light text-nest-blue"
                        : isLocked
                          ? "border-border/60 bg-muted/40 text-muted-foreground/50"
                          : "border-border/60 bg-muted/40 text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="size-3.5" />
                ) : isLocked ? (
                  <Lock className="size-3" />
                ) : (
                  <Icon className="size-3.5" />
                )}

                {/* Active pulse — anchored to icon, not button edge */}
                {isCurrent && !isComplete && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-card",
                      isDegraded ? "bg-nest-orange" : "bg-nest-blue"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 animate-ping rounded-full opacity-60",
                        isDegraded ? "bg-nest-orange" : "bg-nest-blue"
                      )}
                    />
                  </span>
                )}
              </span>

              <span
                className={cn(
                  "hidden sm:inline",
                  isSelected
                    ? "text-foreground font-semibold"
                    : isLocked
                      ? "text-muted-foreground/50"
                      : "text-foreground"
                )}
              >
                {config.label}
              </span>
            </button>

            {/* Connector line */}
            {i < STAGES.length - 1 && (
              <div
                className={cn(
                  "h-px w-4 shrink-0",
                  isComplete ? "bg-nest-green/40" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

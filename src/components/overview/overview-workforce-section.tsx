"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Info,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { overviewCardClass } from "@/lib/card-styles"
import { workforceScenarios } from "@/lib/mock-data/operations"
import { cn } from "@/lib/utils"

import { ApprovalQueuePreview, QuickActionsPanel } from "./operations-center"

const WORKFORCE_NARRATIVE_DISMISSED_KEY = "nest:workforce-narrative-dismissed"
const DISMISS_TRANSITION_MS = 300

const phaseColors: Record<string, string> = {
  Onboard: "bg-[#eff6ff] text-[#1e40af] border-[#93c5fd]",
  Govern: "bg-nest-orange-light text-[#92600c] border-nest-orange/30",
  Investigate: "bg-nest-red-light text-nest-red border-nest-red/30",
  Audit: "bg-[#f5f3ff] text-[#7c3aed] border-[#c4b5fd]",
  Optimize: "bg-nest-green-light text-[#166534] border-nest-green/30",
}

const phaseBadgeClass =
  "inline-flex min-w-[5.25rem] items-center justify-center border px-2 py-0.5 text-center text-[10px] font-semibold tracking-wide uppercase"

function WorkforceNarrative({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="region"
      aria-label="Operating an AI workforce guide"
      className={overviewCardClass}
    >
      <div className="flex items-start gap-3 border-b border-border/60 px-4 py-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-border/70 bg-muted/50">
          <Info className="size-3.5 text-muted-foreground" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Platform guide
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            Operating an AI Workforce
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            How teams onboard agents, govern behavior, investigate failures, and
            continuously improve — illustrated through today&apos;s incident on
            trace TRC-7419-A.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          aria-label="Dismiss workforce guide"
          className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="divide-y divide-border/60">
        {workforceScenarios.map((scenario, i) => (
          <div
            key={scenario.id}
            className={cn(
              "flex gap-4 px-4 py-3.5",
              scenario.status === "active" && "bg-nest-red-light/15"
            )}
          >
            <div className="flex w-[5.25rem] shrink-0 flex-col items-center">
              <span
                className={cn(phaseBadgeClass, phaseColors[scenario.phase])}
              >
                {scenario.phase}
              </span>
              {i < workforceScenarios.length - 1 && (
                <span className="mt-2 h-full w-px bg-border/60" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {scenario.title}
                </p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {scenario.time}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {scenario.description}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-muted-foreground">
                  {scenario.actor}
                </span>
                <Link
                  href={scenario.link}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-nest-green hover:underline"
                >
                  View
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
            {scenario.status === "completed" && (
              <CheckCircle2 className="size-4 shrink-0 text-nest-green" />
            )}
            {scenario.status === "pending" && (
              <Clock className="size-4 shrink-0 text-nest-orange" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function OverviewWorkforceSection() {
  const [showNarrative, setShowNarrative] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(WORKFORCE_NARRATIVE_DISMISSED_KEY) === "true") {
      setShowNarrative(false)
    }
  }, [])

  function dismissNarrative() {
    setIsClosing(true)
    window.setTimeout(() => {
      localStorage.setItem(WORKFORCE_NARRATIVE_DISMISSED_KEY, "true")
      setShowNarrative(false)
      setIsClosing(false)
    }, DISMISS_TRANSITION_MS)
  }

  const narrativeVisible = showNarrative && !isClosing

  return (
    <div
      className={cn(
        "grid gap-4 transition-[grid-template-columns] duration-300 ease-in-out",
        showNarrative ? "lg:grid-cols-3" : "lg:grid-cols-2"
      )}
    >
      {showNarrative && (
        <div
          className={cn(
            "grid min-w-0 transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out lg:col-span-2",
            narrativeVisible
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <WorkforceNarrative onDismiss={dismissNarrative} />
          </div>
        </div>
      )}

      <div
        className={cn(
          "grid min-w-0 gap-4 transition-all duration-300 ease-in-out",
          showNarrative ? "content-start" : "lg:col-span-2 lg:grid-cols-2"
        )}
      >
        <QuickActionsPanel />
        <ApprovalQueuePreview />
      </div>
    </div>
  )
}

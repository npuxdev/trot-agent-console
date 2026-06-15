"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { LifecycleStepper } from "./lifecycle-stepper"
import { StageHeroPanel } from "./stage-hero-panel"
import { StageDetailPanel } from "./stage-detail-panel"
import { ReadinessPanel } from "./readiness-panel"
import { LifecycleEventsTable } from "./lifecycle-events-table"
import { StatusBadge, type StatusType } from "@/components/overview/status-badge"
import { AutonomyPill } from "@/components/agents/autonomy-pill"
import { claimsAgentLifecycle } from "@/lib/mock-data/agent-lifecycle"
import type { AgentAutonomy, LifecycleStage, LifecycleStageStatus } from "@/lib/types"

function agentStatusToBadge(status: "healthy" | "warning" | "degraded"): StatusType {
  return status === "healthy" ? "success" : status
}

export function LifecycleWorkspace() {
  const lifecycle = claimsAgentLifecycle
  const [selectedStage, setSelectedStage] = useState<LifecycleStage>(
    lifecycle.currentStage
  )

  const stageStatuses = Object.fromEntries(
    Object.entries(lifecycle.stages).map(([key, val]) => [key, val.status])
  ) as Record<LifecycleStage, LifecycleStageStatus>

  const selectedDetail = lifecycle.stages[selectedStage]

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/agents"
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Agents
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-muted-foreground">{lifecycle.agentName}</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-medium">Lifecycle</span>
      </div>

      {/* Agent header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold">{lifecycle.agentName}</h2>
        <StatusBadge status={agentStatusToBadge(lifecycle.status)} />
        <AutonomyPill autonomy={lifecycle.autonomy as AgentAutonomy} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{lifecycle.environment}</span>
          <span>·</span>
          <span className="font-mono">{lifecycle.version}</span>
          <span>·</span>
          <span>{lifecycle.model}</span>
          <span>·</span>
          <span>{lifecycle.team}</span>
        </div>
      </div>

      {/* Lifecycle stepper */}
      <div className="overflow-x-auto overflow-y-visible py-1.5">
        <LifecycleStepper
          stageStatuses={stageStatuses}
          currentStage={lifecycle.currentStage}
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          isDegraded={lifecycle.status === "degraded"}
        />
      </div>

      {/* Hero: current stage dominates */}
      <StageHeroPanel
        lifecycle={lifecycle}
        selectedStage={selectedStage}
        stageStatuses={stageStatuses}
      />

      {/* Stage detail + secondary readiness/risk panel */}
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <StageDetailPanel stage={selectedStage} detail={selectedDetail} />
        <ReadinessPanel lifecycle={lifecycle} compact />
      </div>

      {/* Recent lifecycle events */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-stone-700">
          Recent Lifecycle Events
        </h3>
        <LifecycleEventsTable events={lifecycle.recentEvents} />
      </div>
    </div>
  )
}

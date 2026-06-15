"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { PolicyImpactHero } from "./policy-impact-hero"
import { VersionDiffCard } from "./version-diff-card"
import { SimulationComparison } from "./simulation-comparison"
import { PolicyTimeline } from "./policy-timeline"
import { ApprovalChainCard } from "./approval-chain-card"
import { RollbackCard } from "./rollback-card"
import { StatusBadge } from "@/components/overview/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass, rowHoverClass } from "@/lib/card-styles"
import { a2aLatencySloHistory } from "@/lib/mock-data/policy-history"
import { agents } from "@/lib/mock-data/agents"
import { cn } from "@/lib/utils"

export function PolicyHistoryWorkspace() {
  const policy = a2aLatencySloHistory

  const affectedAgents = policy.affectedAgentIds
    .map((id) => agents.find((a) => a.id === id))
    .filter(Boolean)

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/policies"
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Policies
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-muted-foreground">{policy.name}</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-medium">Simulation History</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold">{policy.name}</h2>
        <StatusBadge status={policy.status} />
        <span className="inline-flex h-5 items-center bg-nest-red-light px-2 text-xs font-medium capitalize text-nest-red">
          {policy.severity}
        </span>
        <span className="text-sm text-muted-foreground">
          {policy.type} · {policy.owner}
        </span>
      </div>

      {/* Hero: version comparison + impact summary */}
      <PolicyImpactHero policy={policy} />

      {/* Supporting detail: version diff + rollback */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <VersionDiffCard policy={policy} />
        <RollbackCard
          rollback={policy.rollback}
          currentVersion={policy.currentVersion}
          relatedIncident={policy.relatedIncident}
        />
      </div>

      {/* Simulation vs Actual — supporting table */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-stone-700">
          Simulation vs Actual Impact
        </h3>
        <SimulationComparison
          expected={policy.versionDiff.expected}
          actual={policy.versionDiff.actual}
        />
      </div>

      {/* Bottom row: Timeline, Approval, Affected Agents */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PolicyTimeline events={policy.timeline} />
        <ApprovalChainCard chain={policy.approvalChain} />

        {/* Affected agents */}
        <Card className={overviewCardClass}>
          <CardContent className="space-y-3 p-5">
            <h3 className="text-sm font-medium">Affected Agents</h3>
            <div className="space-y-1.5">
              {affectedAgents.map((agent) => {
                if (!agent) return null
                const badgeStatus =
                  agent.status === "healthy" ? "success" as const : agent.status
                return (
                  <Link
                    key={agent.id}
                    href={`/agents/lifecycle?agent=${agent.id}`}
                    className={cn(
                      "flex items-center justify-between border border-border px-3 py-2 text-sm",
                      rowHoverClass
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.team} · {agent.version}
                      </p>
                    </div>
                    <StatusBadge status={badgeStatus} />
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

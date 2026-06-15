"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Play,
  Shield,
  Wallet,
  Wrench,
  Route,
  Bell,
} from "lucide-react"

import { StatusBadge } from "@/components/overview/status-badge"
import { SummaryStatCard } from "@/components/shared/summary-stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass } from "@/lib/card-styles"
import {
  allViolations,
  governanceSummary,
  policies,
  policyCategories,
  policySimulations,
} from "@/lib/mock-data/policies"
import { pendingApprovals } from "@/lib/mock-data/operations"
import type { PolicyCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, typeof Shield> = {
  wrench: Wrench,
  route: Route,
  shield: Shield,
  wallet: Wallet,
  alert: AlertTriangle,
  check: CheckCircle2,
}

export function GovernanceSummaryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStatCard
        icon={<Shield className="size-4 text-muted-foreground" />}
        label="Compliance rate"
        value={`${governanceSummary.complianceRate}%`}
        subtext={`${governanceSummary.totalPolicies} active policies`}
      />
      <SummaryStatCard
        icon={<AlertTriangle className="size-4 text-nest-orange" />}
        label="Open violations"
        value={String(governanceSummary.activeViolations)}
        subtext="Across 4 policy categories"
      />
      <SummaryStatCard
        icon={<Bell className="size-4 text-[#1e40af]" />}
        label="Pending approvals"
        value={String(governanceSummary.pendingApprovals)}
        subtext="Human review required"
      />
      <SummaryStatCard
        icon={<CheckCircle2 className="size-4 text-muted-foreground" />}
        label="Policy changes"
        value={String(governanceSummary.policyChangesThisWeek)}
        subtext="This week · Last audit Jun 14"
      />
    </div>
  )
}

export function PolicyCategoryGrid() {
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Policy Categories
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Define how agents access tools, consume models, handle data, and
          escalate decisions
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {policyCategories.map((cat) => {
            const Icon = categoryIcons[cat.icon] ?? Shield
            return (
              <button
                key={cat.id}
                type="button"
                className="group flex items-start gap-3 border border-border bg-background p-3 text-left transition-colors hover:border-border-strong hover:bg-muted/60"
              >
                <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-muted group-hover:border-border-strong group-hover:bg-card">
                  <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.description}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-nest-green">
                    {cat.policyCount} polic{cat.policyCount === 1 ? "y" : "ies"}{" "}
                    active
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function PendingApprovalsPanel() {
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Approval Queue
          </CardTitle>
          <span className="border border-nest-orange/30 bg-nest-orange-light px-2 py-0.5 text-[10px] font-semibold text-[#92600c]">
            {pendingApprovals.length} pending
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 p-4 pt-0">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="space-y-1 border border-border/60 bg-background/60 px-3 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 leading-tight">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  {item.type}
                </p>
                <p className="text-sm font-medium">{item.agent}</p>
              </div>
              <span className="shrink-0 text-[10px] leading-tight text-muted-foreground">
                {item.requestedAt}
              </span>
            </div>
            <p className="text-xs leading-snug text-muted-foreground">{item.action}</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs leading-none">
                <span className="text-muted-foreground">Confidence</span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    item.confidence < item.threshold
                      ? "text-nest-red"
                      : "text-nest-green"
                  )}
                >
                  {(item.confidence * 100).toFixed(0)}%
                </span>
                <span className="text-muted-foreground">
                  / {(item.threshold * 100).toFixed(0)}% required
                </span>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  className="border border-border px-2.5 py-1 text-xs font-medium leading-none transition-colors hover:bg-muted"
                >
                  Deny
                </button>
                <button
                  type="button"
                  className="bg-nest-green px-2.5 py-1 text-xs font-medium leading-none text-white transition-colors hover:bg-nest-green/90"
                >
                  Approve
                </button>
              </div>
            </div>
            {item.traceId && (
              <Link
                href={`/observability?trace=${item.traceId}`}
                className="inline-flex items-center gap-0.5 text-[10px] font-medium leading-none text-nest-blue hover:underline"
              >
                {item.traceId}
                <ArrowUpRight className="size-3" />
              </Link>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PolicySimulationPanel() {
  const [selectedSim, setSelectedSim] = useState(0)
  const sim = policySimulations[selectedSim]

  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Policy Simulation
          </CardTitle>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 border border-border bg-muted px-2.5 py-1 text-[10px] font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            <Play className="size-3" />
            Run simulation
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Preview impact before deploying policy changes to production agents
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {policySimulations.map((s, i) => (
            <button
              key={s.policyId}
              type="button"
              onClick={() => setSelectedSim(i)}
              className={cn(
                "border px-2.5 py-1 text-[10px] font-medium transition-colors",
                selectedSim === i
                  ? "border-border-strong bg-card text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/60"
              )}
            >
              {s.policyName.split("(")[0].trim()}
            </button>
          ))}
        </div>

        <div className="border border-border/60 bg-muted/20 p-3">
          <p className="text-sm font-medium">{sim.policyName}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">
                Agents affected
              </p>
              <p className="text-lg font-semibold tabular-nums">
                {sim.agentsAffected}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">
                Traces blocked
              </p>
              <p className="text-lg font-semibold tabular-nums">
                {sim.tracesBlocked}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">
                Cost impact
              </p>
              <p className="text-sm font-semibold text-nest-green">
                {sim.estimatedCostImpact}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">
                Approval queue
              </p>
              <p className="text-sm font-medium">{sim.approvalQueueIncrease}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-muted-foreground uppercase">
                Risk reduction
              </p>
              <p className="text-sm font-medium text-nest-green">
                {sim.riskReduction}
              </p>
            </div>
          </div>
          <Link
            href={`/policies/history?policy=${sim.policyId}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-nest-blue hover:underline"
          >
            View simulation history
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

const violationTypeLabels: Record<string, string> = {
  "unauthorized-tool": "Unauthorized tool",
  "token-overrun": "Token overrun",
  "sensitive-data": "Sensitive data",
  "recursive-loop": "Recursive loop",
  "low-confidence": "Low confidence",
  "latency-breach": "Latency breach",
  "retry-exceeded": "Retry exceeded",
}

export function GovernanceViolationsTable() {
  const rows = allViolations.map((v) => {
    const policy = policies.find((p) => p.id === v.policyId)
    return { ...v, policyName: policy?.name ?? v.policyId, category: policy?.category }
  })

  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Policy Violations
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Real-time enforcement events across tool access, spending, data
          classification, and escalation policies
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className={tableHeadClass}>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Policy</th>
                <th className="px-4 py-2.5 font-medium">Agent</th>
                <th className="px-4 py-2.5 font-medium">Message</th>
                <th className="px-4 py-2.5 font-medium">Severity</th>
                <th className="px-4 py-2.5 font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-medium">
                      {v.violationType
                        ? violationTypeLabels[v.violationType]
                        : "Policy breach"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium">{v.policyName}</td>
                  <td className="px-4 py-2.5">{v.agentName}</td>
                  <td className="max-w-[240px] truncate px-4 py-2.5 text-muted-foreground">
                    {v.message}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      status={
                        v.severity === "critical"
                          ? "critical"
                          : v.severity === "high"
                            ? "degraded"
                            : v.severity === "medium"
                              ? "warning"
                              : "success"
                      }
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-3 text-xs">
                      <Link
                        href={`/audit?policy=${v.policyId}`}
                        className="font-medium text-nest-blue hover:underline"
                      >
                        Audit
                      </Link>
                      {v.traceId && (
                        <Link
                          href={`/observability?trace=${v.traceId}`}
                          className="font-medium text-nest-blue hover:underline"
                        >
                          Trace
                        </Link>
                      )}
                    </div>
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

export function ActivePoliciesPanel() {
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Active Policies
          </CardTitle>
          <Link
            href="/policies"
            className="text-xs font-medium text-nest-blue hover:underline"
          >
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 p-4 pt-0">
        {policies.slice(0, 6).map((policy) => (
          <div
            key={policy.id}
            className="flex items-center justify-between border border-border/60 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{policy.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {policy.enforcement} · {policy.boundAgentIds.length} agents
              </p>
            </div>
            <StatusBadge status={policy.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

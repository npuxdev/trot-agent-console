import Link from "next/link"
import {
  ArrowUpRight,
  Bot,
  Clock,
  Shield,
  Wallet,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import {
  operationsSummary,
  pendingApprovals,
} from "@/lib/mock-data/operations"
import { allViolations } from "@/lib/mock-data/policies"
import { cn } from "@/lib/utils"

export function OperationsPostureCards() {
  const budgetPct = Math.round(
    (operationsSummary.budgetUtilization / operationsSummary.budgetLimit) * 100
  )

  const cards = [
    {
      label: "Active workforce",
      value: `${operationsSummary.activeAgents}`,
      sub: `/ ${operationsSummary.totalAgents} deployed agents`,
      icon: Bot,
      tone: "neutral" as const,
    },
    {
      label: "Governance score",
      value: `${operationsSummary.governanceScore}%`,
      sub: `${allViolations.length} open violations`,
      icon: Shield,
      tone: operationsSummary.governanceScore >= 85 ? "good" : "warn",
    },
    {
      label: "Budget utilization",
      value: `${budgetPct}%`,
      sub: `$${(operationsSummary.budgetUtilization / 1000).toFixed(1)}k of $${(operationsSummary.budgetLimit / 1000).toFixed(0)}k daily limit`,
      icon: Wallet,
      tone: budgetPct > 80 ? "warn" : "good",
    },
    {
      label: "Pending approvals",
      value: String(operationsSummary.pendingApprovals),
      sub: "Human review required",
      icon: Clock,
      tone: operationsSummary.pendingApprovals > 5 ? "warn" : "neutral",
    },
  ]

  const confidencePct = (operationsSummary.avgConfidenceScore * 100).toFixed(0)

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Operations Posture
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 border border-border/60 bg-background/70 px-2.5 py-1">
            <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/80 uppercase">
              Avg confidence
            </span>
            <span className="text-xs font-semibold tabular-nums text-nest-green">
              {confidencePct}%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 border border-border/60 bg-background/70 px-2.5 py-1">
            <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/80 uppercase">
              A2A handoffs today
            </span>
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {operationsSummary.a2aHandoffsToday}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className={overviewCardClass}>
              <CardContent className="flex items-start gap-3 p-4">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center border",
                    card.tone === "warn"
                      ? "border-nest-orange/30 bg-nest-orange-light"
                      : card.tone === "good"
                        ? "border-nest-green/30 bg-nest-green-light"
                        : "border-border/70 bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      card.tone === "warn"
                        ? "text-nest-orange"
                        : card.tone === "good"
                          ? "text-nest-green"
                          : "text-muted-foreground"
                    )}
                  />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {card.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export function QuickActionsPanel() {
  const actions = [
    {
      label: "View agent topology",
      description: "Map dependencies and blast radius",
      href: "/topology",
    },
    {
      label: "Clear approval queue",
      description: "7 pending approvals, 8 violations",
      href: "/approvals",
    },
    {
      label: "Investigate TRC-7419-A",
      description: "Active incident trace",
      href: "/observability?trace=TRC-7419-A",
    },
    {
      label: "Audit policy changes",
      description: "4 changes this week",
      href: "/audit",
    },
  ]

  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-4 pt-0">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center justify-between border border-border/60 px-3 py-2.5 transition-colors hover:border-nest-green/30 hover:bg-nest-green-light/30"
          >
            <div>
              <p className="text-sm font-medium group-hover:text-[#166534]">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground/50 transition-colors group-hover:text-nest-green" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export function ApprovalQueuePreview() {
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Approval Queue
          </CardTitle>
          <Link
            href="/approvals"
            className="text-xs font-medium text-nest-green hover:underline"
          >
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {pendingApprovals.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="space-y-1 border border-border/60 px-3 py-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{item.type}</span>
              <span className="text-[10px] text-muted-foreground">
                {item.requestedAt}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {item.action}
            </p>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-muted-foreground">Confidence</span>
              <span
                className={cn(
                  "font-semibold",
                  item.confidence < item.threshold
                    ? "text-nest-red"
                    : "text-nest-green"
                )}
              >
                {(item.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

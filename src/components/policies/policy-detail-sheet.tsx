"use client"

import Link from "next/link"
import { ArrowUpRight, Bot } from "lucide-react"

import { Sheet, SheetSection, SheetStat } from "@/components/ui/sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import { getAgentById } from "@/lib/mock-data/agents"
import { getPolicyById } from "@/lib/mock-data/policies"

export function PolicyDetailSheet({
  policyId,
  onOpenChange,
}: {
  policyId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const policy = policyId ? getPolicyById(policyId) : undefined

  return (
    <Sheet
      open={Boolean(policy)}
      onOpenChange={onOpenChange}
      eyebrow="Policy"
      title={policy?.name ?? "Policy"}
      description={policy?.scope}
      headerExtra={policy && <StatusBadge status={policy.status} />}
      footer={
        policy && (
          <Link
            href={`/audit?policy=${policy.id}`}
            className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            View related audit events
            <ArrowUpRight className="size-3.5" />
          </Link>
        )
      }
    >
      {policy && (
        <div className="space-y-6">
          <SheetSection title="Definition">
            <div className="grid grid-cols-2 gap-2">
              <SheetStat label="Type" value={policy.type} />
              <SheetStat label="Threshold" value={policy.threshold} />
              <SheetStat label="Enforcement" value={policy.enforcement} />
              <SheetStat label="Owner" value={policy.owner} />
            </div>
            {policy.description && (
              <p className="mt-2 border border-border/70 bg-background/60 px-3 py-2.5 text-xs text-muted-foreground">
                {policy.description}
              </p>
            )}
          </SheetSection>

          <SheetSection title={`Bound agents (${policy.boundAgentIds.length})`}>
            <div className="space-y-1.5">
              {policy.boundAgentIds.map((id) => {
                const agent = getAgentById(id)
                return (
                  <Link
                    key={id}
                    href="/agents"
                    className="flex items-center gap-2 border border-border/70 bg-background/60 px-3 py-2 text-sm transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <Bot className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate font-medium">
                      {agent?.name ?? id}
                    </span>
                  </Link>
                )
              })}
            </div>
          </SheetSection>

          <SheetSection
            title={`Recent violations (${policy.violations.length})`}
          >
            {policy.violations.length === 0 ? (
              <p className="border border-border/70 bg-background/60 px-3 py-3 text-sm text-muted-foreground">
                No violations recorded. Policy is operating within threshold.
              </p>
            ) : (
              <div className="space-y-2">
                {policy.violations.map((v) => (
                  <div
                    key={v.id}
                    className="space-y-1.5 border border-border/70 bg-background/60 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{v.agentName}</span>
                      <span className="text-xs text-muted-foreground">
                        {v.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.message}</p>
                    {v.traceId && (
                      <Link
                        href={`/observability?trace=${v.traceId}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-nest-green hover:underline"
                      >
                        {v.traceId}
                        <ArrowUpRight className="size-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SheetSection>
        </div>
      )}
    </Sheet>
  )
}

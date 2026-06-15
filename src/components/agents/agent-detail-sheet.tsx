"use client"

import Link from "next/link"
import { Activity, ArrowUpRight, GitBranch, PlayCircle, ShieldCheck, Siren } from "lucide-react"

import { AutonomyPill } from "@/components/agents/autonomy-pill"
import { EscalationPath } from "@/components/agents/escalation-path"
import { Sheet, SheetSection, SheetStat } from "@/components/ui/sheet"
import { StatusBadge, type StatusType } from "@/components/overview/status-badge"
import { getAgentById } from "@/lib/mock-data/agents"
import { getMcpServerById } from "@/lib/mock-data/mcp-servers"
import { getPolicyById } from "@/lib/mock-data/policies"

function agentStatusToBadge(status: "healthy" | "warning" | "degraded"): StatusType {
  return status === "healthy" ? "success" : status
}

export function AgentDetailSheet({
  agentId,
  onOpenChange,
}: {
  agentId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const agent = agentId ? getAgentById(agentId) : undefined

  return (
    <Sheet
      open={Boolean(agent)}
      onOpenChange={onOpenChange}
      eyebrow={agent?.team}
      title={agent?.name ?? "Agent"}
      description={agent ? `${agent.version} · ${agent.environment}` : undefined}
      headerExtra={
        agent && <StatusBadge status={agentStatusToBadge(agent.status)} />
      }
      footer={
        agent && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/observability?trace=${agent.lastTraceId}`}
              className="inline-flex items-center gap-1.5 bg-nest-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-nest-green/90"
            >
              <Activity className="size-3.5" />
              View latest trace
            </Link>
            <Link
              href={`/agents/lifecycle?agent=${agent.id}`}
              className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <GitBranch className="size-3.5" />
              Manage lifecycle
            </Link>
            {agent.status === "degraded" && (
              <Link
                href={`/topology/replay?incident=${agent.lastTraceId}`}
                className="inline-flex items-center gap-1.5 border border-nest-red/30 bg-nest-red-light px-3 py-1.5 text-xs font-medium text-nest-red transition-colors hover:bg-nest-red-light/80"
              >
                <PlayCircle className="size-3.5" />
                View replay
              </Link>
            )}
          </div>
        )
      }
    >
      {agent && (
        <div className="space-y-6">
          <SheetSection title="Profile">
            <div className="grid grid-cols-2 gap-2">
              <SheetStat label="Owner" value={agent.owner} />
              <SheetStat label="Model" value={agent.model} />
              <div className="border border-border/70 bg-background/60 px-3 py-2">
                <p className="text-xs text-muted-foreground">Autonomy</p>
                <div className="mt-1">
                  <AutonomyPill autonomy={agent.autonomy} />
                </div>
              </div>
              <SheetStat label="Last deployed" value={agent.lastDeployed} />
            </div>
          </SheetSection>

          <SheetSection title="Performance">
            <div className="grid grid-cols-2 gap-2">
              <SheetStat label="Volume" value={agent.volume} />
              <SheetStat
                label="Avg latency"
                value={agent.avgLatency}
                tone={agent.status === "degraded" ? "danger" : "default"}
              />
              <SheetStat
                label="Error rate"
                value={agent.errorRate}
                tone={agent.status === "healthy" ? "success" : "warning"}
              />
              <SheetStat label="Cost / exec" value={agent.costPerExecution} />
            </div>
          </SheetSection>

          <SheetSection title="Escalation path">
            <p className="flex items-center gap-2 border border-border/70 bg-background/60 px-3 py-2.5 text-sm">
              <Siren className="size-4 shrink-0 text-nest-orange" />
              <EscalationPath path={agent.escalationPath} />
            </p>
          </SheetSection>

          <SheetSection title={`Approved tools (${agent.mcpServerIds.length})`}>
            <div className="space-y-1.5">
              {agent.mcpServerIds.map((id) => {
                const server = getMcpServerById(id)
                if (!server) return null
                return (
                  <Link
                    key={id}
                    href={`/mcp-registry`}
                    className="flex items-center justify-between gap-2 border border-border/70 bg-background/60 px-3 py-2 text-sm transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {server.name}
                      </span>
                      <span className="block truncate font-mono text-[11px] text-muted-foreground">
                        p95 {server.latencyP95}
                      </span>
                    </span>
                    <StatusBadge status={server.status} />
                  </Link>
                )
              })}
            </div>
          </SheetSection>

          <SheetSection title={`Bound policies (${agent.policyIds.length})`}>
            <div className="space-y-1.5">
              {agent.policyIds.map((id) => {
                const policy = getPolicyById(id)
                if (!policy) return null
                return (
                  <Link
                    key={id}
                    href="/policies"
                    className="flex items-center justify-between gap-2 border border-border/70 bg-background/60 px-3 py-2 text-sm transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {policy.name}
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {policy.type} · {policy.threshold}
                        </span>
                      </span>
                    </span>
                    <StatusBadge status={policy.status} />
                  </Link>
                )
              })}
            </div>
          </SheetSection>

          <SheetSection title="Identifiers">
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p className="flex items-center justify-between gap-2">
                <span>Agent ID</span>
                <span className="text-foreground">{agent.id}</span>
              </p>
              <p className="flex items-center justify-between gap-2">
                <span>Last trace</span>
                <Link
                  href={`/observability?trace=${agent.lastTraceId}`}
                  className="inline-flex items-center gap-1 text-nest-blue hover:underline"
                >
                  {agent.lastTraceId}
                  <ArrowUpRight className="size-3" />
                </Link>
              </p>
            </div>
          </SheetSection>
        </div>
      )}
    </Sheet>
  )
}

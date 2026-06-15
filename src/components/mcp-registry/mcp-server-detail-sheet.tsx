"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Sheet, SheetSection, SheetStat } from "@/components/ui/sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import { getAgentById } from "@/lib/mock-data/agents"
import { getMcpServerById } from "@/lib/mock-data/mcp-servers"

export function McpServerDetailSheet({
  serverId,
  onOpenChange,
}: {
  serverId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const server = serverId ? getMcpServerById(serverId) : undefined
  const breached =
    server &&
    parseFloat(server.latencyP95) > parseFloat(server.timeoutThreshold)

  return (
    <Sheet
      open={Boolean(server)}
      onOpenChange={onOpenChange}
      eyebrow={server ? `MCP server · ${server.version}` : "MCP server"}
      title={server?.name ?? "Server"}
      description={server?.description}
      headerExtra={server && <StatusBadge status={server.status} />}
      footer={
        server?.lastIncidentTraceId && (
          <Link
            href={`/observability?trace=${server.lastIncidentTraceId}`}
            className="inline-flex items-center gap-1.5 bg-nest-orange px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-nest-orange/90"
          >
            <AlertTriangle className="size-3.5" />
            View incident trace
          </Link>
        )
      }
    >
      {server && (
        <div className="space-y-6">
          <SheetSection title="Health">
            <div className="grid grid-cols-3 gap-2">
              <SheetStat label="Version" value={server.version} />
              <SheetStat
                label="p95 latency"
                value={server.latencyP95}
                tone={breached ? "danger" : "success"}
              />
              <SheetStat label="Timeout" value={server.timeoutThreshold} />
            </div>
            {breached && (
              <p className="flex items-center gap-1.5 text-xs text-nest-orange">
                <AlertTriangle className="size-3.5" />
                p95 latency exceeds configured timeout threshold.
              </p>
            )}
          </SheetSection>

          <SheetSection title="Configuration">
            <div className="grid grid-cols-2 gap-2">
              <SheetStat label="Auth method" value={server.authMethod} />
              <SheetStat label="Tools exposed" value={String(server.toolCount)} />
              <SheetStat label="Schema version" value={server.schemaVersion} />
              <SheetStat label="Last synced" value={server.lastSync} />
              <SheetStat label="Cost / call" value={server.costPerCall} />
            </div>
          </SheetSection>

          <SheetSection title={`Permission scopes (${server.scopes.length})`}>
            <div className="flex flex-wrap gap-1.5">
              {server.scopes.map((scope) => (
                <span
                  key={scope}
                  className="border border-border/70 bg-background/60 px-2 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  {scope}
                </span>
              ))}
            </div>
          </SheetSection>

          <SheetSection title="Endpoint">
            <p className="border border-border/70 bg-background/60 px-3 py-2 font-mono text-xs break-all text-muted-foreground">
              {server.endpoint}
            </p>
          </SheetSection>

          <SheetSection
            title={`Connected agents (${server.connectedAgentIds.length})`}
          >
            <div className="space-y-1.5">
              {server.connectedAgentIds.map((id) => {
                const agent = getAgentById(id)
                return (
                  <Link
                    key={id}
                    href={`/agents`}
                    className="flex items-center justify-between gap-2 border border-border/70 bg-background/60 px-3 py-2 text-sm transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {agent?.name ?? id}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {agent?.team ?? "—"}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </SheetSection>
        </div>
      )}
    </Sheet>
  )
}

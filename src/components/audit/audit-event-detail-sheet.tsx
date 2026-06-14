"use client"

import Link from "next/link"
import { Activity, ArrowUpRight, ShieldCheck } from "lucide-react"

import { Sheet, SheetSection } from "@/components/ui/sheet"
import { auditEvents } from "@/lib/mock-data/audit"
import { getPolicyById } from "@/lib/mock-data/policies"
import type { AuditEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

const outcomeStyles: Record<AuditEvent["outcome"], string> = {
  success: "bg-nest-green-light text-[#15663a]",
  warning: "bg-[#f7efd2] text-[#8a6c16]",
  failure: "bg-nest-red-light text-nest-red",
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium break-words">
        {value}
      </span>
    </div>
  )
}

export function AuditEventDetailSheet({
  eventId,
  onOpenChange,
}: {
  eventId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const event = eventId ? auditEvents.find((e) => e.id === eventId) : undefined
  const policy = event?.relatedPolicyId
    ? getPolicyById(event.relatedPolicyId)
    : undefined

  return (
    <Sheet
      open={Boolean(event)}
      onOpenChange={onOpenChange}
      eyebrow="Audit event"
      title={event?.action ?? "Event"}
      description={event?.resource}
      headerExtra={
        event && (
          <span
            className={cn(
              "inline-flex h-5 items-center px-2 text-xs font-medium capitalize",
              outcomeStyles[event.outcome]
            )}
          >
            {event.outcome}
          </span>
        )
      }
      footer={
        event &&
        (event.relatedTraceId || event.relatedPolicyId) && (
          <div className="flex flex-wrap gap-2">
            {event.relatedTraceId && (
              <Link
                href={`/observability?trace=${event.relatedTraceId}`}
                className="inline-flex items-center gap-1.5 bg-nest-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-nest-green/90"
              >
                <Activity className="size-3.5" />
                View trace
              </Link>
            )}
            {event.relatedPolicyId && (
              <Link
                href="/policies"
                className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                <ShieldCheck className="size-3.5" />
                View policy
              </Link>
            )}
          </div>
        )
      }
    >
      {event && (
        <div className="space-y-6">
          <SheetSection title="Details">
            <div className="divide-y divide-border/60 border-y border-border/60">
              <Row label="Timestamp" value={event.timestamp} />
              <Row label="Actor" value={event.actor} />
              <Row label="Action" value={event.action} />
              <Row label="Resource" value={event.resource} />
              <Row label="Agent" value={event.agentName} />
            </div>
          </SheetSection>

          {(event.relatedTraceId || policy) && (
            <SheetSection title="Related">
              <div className="space-y-1.5 font-mono text-xs">
                {event.relatedTraceId && (
                  <Link
                    href={`/observability?trace=${event.relatedTraceId}`}
                    className="flex items-center justify-between gap-2 border border-border/70 bg-background/60 px-3 py-2 transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="text-muted-foreground">Trace</span>
                    <span className="inline-flex items-center gap-1 text-nest-green">
                      {event.relatedTraceId}
                      <ArrowUpRight className="size-3" />
                    </span>
                  </Link>
                )}
                {policy && (
                  <Link
                    href="/policies"
                    className="flex items-center justify-between gap-2 border border-border/70 bg-background/60 px-3 py-2 font-sans transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="text-muted-foreground">Policy</span>
                    <span className="inline-flex items-center gap-1 text-nest-green">
                      {policy.name}
                      <ArrowUpRight className="size-3" />
                    </span>
                  </Link>
                )}
              </div>
            </SheetSection>
          )}
        </div>
      )}
    </Sheet>
  )
}

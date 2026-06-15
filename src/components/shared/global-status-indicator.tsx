import Link from "next/link"

import { getSystemStatus, type SystemLevel } from "@/lib/system-status"
import { cn } from "@/lib/utils"

const levelStyles: Record<
  SystemLevel,
  { container: string; dot: string; label: string }
> = {
  operational: {
    container: "border-b border-nest-green/25 bg-nest-green-light/60",
    dot: "bg-nest-green",
    label: "text-[#15663a]",
  },
  degraded: {
    container: "border-b border-nest-orange/30 bg-nest-orange-light/70",
    dot: "bg-nest-orange",
    label: "text-nest-orange",
  },
  critical: {
    container: "border-b border-nest-red/30 bg-nest-red-light/70",
    dot: "bg-nest-red",
    label: "text-nest-red",
  },
}

export function GlobalStatusIndicator() {
  const status = getSystemStatus()
  const styles = levelStyles[status.level]

  const href = status.primaryIncidentTraceId
    ? `/observability?trace=${status.primaryIncidentTraceId}`
    : "/topology"

  const meta: string[] = []
  if (status.incidentCount > 0) {
    meta.push(
      `${status.incidentCount} active incident${status.incidentCount === 1 ? "" : "s"}`
    )
  }
  if (status.impactedAgentCount > 0) {
    meta.push(`${status.impactedAgentCount} agents impacted`)
  }

  return (
    <Link
      href={href}
      aria-label={`System status: ${status.environment} ${status.label}. ${meta.join(", ") || "All systems nominal"}.`}
      className={cn(
        "group flex w-full items-center gap-2 px-5 py-2.5 text-xs transition-colors",
        styles.container
      )}
    >
      <span className="relative flex size-2 items-center justify-center">
        {status.level !== "operational" && (
          <span
            className={cn(
              "absolute inline-flex size-2 animate-ping rounded-full opacity-70",
              styles.dot
            )}
          />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", styles.dot)} />
      </span>
      <span className={cn("font-semibold", styles.label)}>
        {status.environment} {status.label}
      </span>
      {meta.length > 0 && (
        <span className="hidden text-muted-foreground tabular-nums sm:inline">
          · {meta.join(" · ")}
        </span>
      )}
    </Link>
  )
}

import Link from "next/link"

import { getSystemStatus, type SystemLevel } from "@/lib/system-status"
import { statusBannerClass } from "@/lib/layout-styles"
import { cn } from "@/lib/utils"

const levelStyles: Record<
  SystemLevel,
  { container: string; dot: string; label: string }
> = {
  operational: {
    container: "border-b border-border bg-card",
    dot: "bg-nest-green",
    label: "text-foreground",
  },
  degraded: {
    container: "border-b border-nest-alert-border bg-nest-alert-bg",
    dot: "bg-nest-orange",
    label: "text-stone-800",
  },
  critical: {
    container: "border-b border-nest-red/40 bg-nest-red-light",
    dot: "bg-nest-red",
    label: "text-nest-red",
  },
}

export function GlobalStatusIndicator() {
  const status = getSystemStatus()
  const styles = levelStyles[status.level]

  const href = status.primaryIncidentTraceId
    ? `/topology/replay?incident=${status.primaryIncidentTraceId}`
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
        "group block transition-colors",
        statusBannerClass,
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

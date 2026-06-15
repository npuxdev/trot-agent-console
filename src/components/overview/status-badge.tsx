import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusType = "success" | "warning" | "degraded" | "critical"

const statusStyles: Record<StatusType, string> = {
  success:
    "border border-border border-l-2 border-l-nest-green bg-card text-nest-green",
  warning:
    "border border-border border-l-2 border-l-nest-amber bg-card text-nest-amber",
  degraded:
    "border border-nest-orange/30 border-l-2 border-l-nest-orange bg-nest-orange-light text-nest-orange",
  critical:
    "border border-nest-red/30 border-l-2 border-l-nest-red bg-nest-red-light text-nest-red",
}

const statusLabels: Record<StatusType, string> = {
  success: "Success",
  warning: "Warning",
  degraded: "Degraded",
  critical: "Critical",
}

const statusIcons: Record<StatusType, typeof AlertTriangle> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  degraded: AlertTriangle,
  critical: AlertOctagon,
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: {
  status: StatusType
  className?: string
  showIcon?: boolean
}) {
  const Icon = showIcon ? statusIcons[status] : undefined

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-none px-2 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {Icon && <Icon className="size-3 shrink-0" />}
      {statusLabels[status]}
    </span>
  )
}

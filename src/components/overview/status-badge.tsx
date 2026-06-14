import { cn } from "@/lib/utils"

export type StatusType = "success" | "warning" | "degraded"

const statusStyles: Record<StatusType, string> = {
  success: "bg-nest-green-light text-[#15663a]",
  warning: "bg-[#f7efd2] text-[#8a6c16]",
  degraded: "bg-nest-orange-light text-nest-orange",
}

const statusLabels: Record<StatusType, string> = {
  success: "Success",
  warning: "Warning",
  degraded: "Degraded",
}

export function StatusBadge({
  status,
  className,
}: {
  status: StatusType
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-none px-2 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

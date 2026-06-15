import type { AgentAutonomy } from "@/lib/types"
import { cn } from "@/lib/utils"

const autonomyStyles: Record<AgentAutonomy, string> = {
  Autonomous: "border-border-strong bg-muted text-foreground",
  Supervised: "border-border bg-muted/60 text-muted-foreground",
  Manual: "border-border bg-background text-muted-foreground",
}

export function AutonomyPill({ autonomy }: { autonomy: AgentAutonomy }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2 text-xs font-medium",
        autonomyStyles[autonomy]
      )}
    >
      {autonomy}
    </span>
  )
}

import type { AgentAutonomy } from "@/lib/types"
import { cn } from "@/lib/utils"

const autonomyStyles: Record<AgentAutonomy, string> = {
  Autonomous: "border-nest-green/30 bg-nest-green-light text-[#166534]",
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

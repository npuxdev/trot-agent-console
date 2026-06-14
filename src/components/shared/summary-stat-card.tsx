import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { cn } from "@/lib/utils"

type SummaryStatCardProps = {
  icon: ReactNode
  label: string
  value: string
  subtext?: string
  className?: string
}

export function SummaryStatCard({
  icon,
  label,
  value,
  subtext,
  className,
}: SummaryStatCardProps) {
  return (
    <Card className={cn(overviewCardClass, className)}>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center border border-border/70 bg-muted/50">
          {icon}
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

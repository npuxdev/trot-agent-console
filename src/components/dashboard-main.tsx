"use client"

import { Loader2 } from "lucide-react"

import { useDateRange } from "@/components/shared/date-range-context"
import { cn } from "@/lib/utils"

type DashboardMainProps = {
  children: React.ReactNode
}

export function DashboardMain({ children }: DashboardMainProps) {
  const { isLoading } = useDateRange()

  return (
    <main className="relative flex-1 overflow-y-auto px-5 py-4">
      <div
        className={cn(
          "transition-opacity duration-200",
          isLoading && "pointer-events-none opacity-40"
        )}
      >
        {children}
      </div>

      {isLoading && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-background/50"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-3 border border-border bg-card px-6 py-5 shadow-sm">
            <Loader2 className="size-6 animate-spin text-nest-green" />
            <p className="text-sm text-muted-foreground">Updating data…</p>
          </div>
        </div>
      )}
    </main>
  )
}

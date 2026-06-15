"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

import { useDateRange } from "@/components/shared/date-range-context"
import { cn } from "@/lib/utils"

const ENVIRONMENTS = ["Production", "Staging", "Development"] as const
const TIME_RANGES = [
  "Last 1h",
  "Last 24h",
  "Last 7d",
  "Last 30d",
  "Last 90d",
] as const

type CompactSelectProps = {
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  ariaLabel: string
  tone?: "default" | "accent"
}

function CompactSelect({
  value,
  options,
  onChange,
  ariaLabel,
  tone = "default",
}: CompactSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 cursor-pointer items-center gap-1.5 border px-2.5 text-sm font-medium transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          tone === "accent"
            ? "border-border bg-background text-foreground hover:bg-muted"
            : "border-border bg-background text-foreground hover:bg-muted"
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-60 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+4px)] right-0 z-50 min-w-[10rem] border border-border bg-popover py-1 text-popover-foreground shadow-sm"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                option === value
                  ? "font-medium text-foreground"
                  : "text-foreground"
              )}
            >
              {option}
              {option === value && (
                <span className="size-1.5 rounded-full bg-nest-blue" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function EnvironmentTimeControl() {
  const { notifyRangeApplied } = useDateRange()
  const [environment, setEnvironment] = useState<string>(ENVIRONMENTS[0])
  const [timeRange, setTimeRange] = useState<string>("Last 24h")

  return (
    <div className="flex items-center">
      <div className="-mr-px">
        <CompactSelect
          value={environment}
          options={ENVIRONMENTS}
          ariaLabel="Environment"
          onChange={(next) => {
            if (next === environment) return
            setEnvironment(next)
            notifyRangeApplied(true)
          }}
        />
      </div>
      <CompactSelect
        value={timeRange}
        options={TIME_RANGES}
        ariaLabel="Time range"
        tone="accent"
        onChange={(next) => {
          if (next === timeRange) return
          setTimeRange(next)
          notifyRangeApplied(true)
        }}
      />
    </div>
  )
}

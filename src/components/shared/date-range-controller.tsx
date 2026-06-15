"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { useDateRange } from "@/components/shared/date-range-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const PRESETS = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This month",
  "Last month",
] as const

type Preset = (typeof PRESETS)[number]

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const

type DateRange = {
  start: Date
  end: Date
}

type DateRangeControllerProps = {
  className?: string
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
})

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return startOfDay(next)
}

function toInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function fromInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return startOfDay(new Date(year, month - 1, day))
}

function formatDateRange({ start, end }: DateRange) {
  const startLabel = dateFormatter.format(start)
  const endLabel = dateFormatter.format(end)

  if (start.getTime() === end.getTime()) {
    return startLabel
  }

  return `${startLabel} – ${endLabel}`
}

function getPresetRange(preset: Preset): DateRange {
  const today = startOfDay(new Date())

  switch (preset) {
    case "Today":
      return { start: today, end: today }
    case "Last 7 days":
      return { start: addDays(today, -6), end: today }
    case "Last 30 days":
      return { start: addDays(today, -29), end: today }
    case "Last 90 days":
      return { start: addDays(today, -89), end: today }
    case "This month":
      return {
        start: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
        end: today,
      }
    case "Last month": {
      const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastOfLastMonth = addDays(firstOfThisMonth, -1)
      return {
        start: startOfDay(
          new Date(lastOfLastMonth.getFullYear(), lastOfLastMonth.getMonth(), 1)
        ),
        end: lastOfLastMonth,
      }
    }
  }
}

function getDefaultRange(): DateRange {
  return getPresetRange("Last 30 days")
}

function rangesEqual(a: DateRange, b: DateRange) {
  return (
    a.start.getTime() === b.start.getTime() &&
    a.end.getTime() === b.end.getTime()
  )
}

function getPresetForRange(range: DateRange): Preset | null {
  return (
    PRESETS.find((preset) => rangesEqual(range, getPresetRange(preset))) ?? null
  )
}

function normalizeRange(start: Date, end: Date): DateRange {
  if (start.getTime() <= end.getTime()) {
    return { start, end }
  }

  return { start: end, end: start }
}

function buildCalendarDays(viewMonth: Date) {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingEmpty = firstDay.getDay()

  const days: (Date | null)[] = Array.from({ length: leadingEmpty }, () => null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(startOfDay(new Date(year, month, day)))
  }

  return days
}

function isSameDay(a: Date, b: Date) {
  return a.getTime() === b.getTime()
}

function isWithinRange(date: Date, range: DateRange) {
  const time = date.getTime()
  return time >= range.start.getTime() && time <= range.end.getTime()
}

export function DateRangeController({ className }: DateRangeControllerProps) {
  const { notifyRangeApplied } = useDateRange()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [committedRange, setCommittedRange] = useState<DateRange>(getDefaultRange)
  const [draftRange, setDraftRange] = useState<DateRange>(getDefaultRange)
  const [activePreset, setActivePreset] = useState<Preset | null>("Last 30 days")
  const [viewMonth, setViewMonth] = useState(() => startOfDay(new Date()))
  const [pendingStart, setPendingStart] = useState<Date | null>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setDraftRange(committedRange)
        setActivePreset(getPresetForRange(committedRange))
        setPendingStart(null)
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [open, committedRange])

  function openPanel() {
    setDraftRange(committedRange)
    setActivePreset(getPresetForRange(committedRange))
    setPendingStart(null)
    setViewMonth(committedRange.end)
    setOpen(true)
  }

  function applyRange() {
    const changed = !rangesEqual(draftRange, committedRange)
    setCommittedRange(draftRange)
    setOpen(false)
    setPendingStart(null)
    notifyRangeApplied(changed)
  }

  function cancelSelection() {
    setDraftRange(committedRange)
    setActivePreset(getPresetForRange(committedRange))
    setPendingStart(null)
    setOpen(false)
  }

  function updateDraftRange(range: DateRange) {
    setDraftRange(range)
    setActivePreset(getPresetForRange(range))
    setPendingStart(null)
    setViewMonth(range.end)
  }

  function handlePresetClick(preset: Preset) {
    updateDraftRange(getPresetRange(preset))
  }

  function handleDayClick(day: Date) {
    if (!pendingStart) {
      setPendingStart(day)
      setDraftRange({ start: day, end: day })
      setActivePreset(null)
      return
    }

    updateDraftRange(normalizeRange(pendingStart, day))
  }

  function handleStartInputChange(value: string) {
    if (!value) return
    updateDraftRange(normalizeRange(fromInputValue(value), draftRange.end))
  }

  function handleEndInputChange(value: string) {
    if (!value) return
    updateDraftRange(normalizeRange(draftRange.start, fromInputValue(value)))
  }

  const calendarDays = buildCalendarDays(viewMonth)
  const label = formatDateRange(committedRange)

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => (open ? cancelSelection() : openPanel())}
        className="flex h-9 cursor-pointer items-center gap-2 border border-nest-green/20 bg-nest-green-light px-2.5 text-sm font-medium text-[#166534] transition-colors outline-none select-none hover:bg-nest-green-light/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <CalendarDays className="size-4 shrink-0" />
        <span className="max-w-[14rem] truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-60 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Date range"
          className="absolute top-[calc(100%+4px)] right-0 z-50 w-[min(100vw-2rem,22rem)] border border-border bg-popover text-popover-foreground shadow-sm"
        >
          <div className="space-y-3 p-3">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Quick select
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "border px-2 py-1 text-xs font-medium transition-colors",
                      activePreset === preset
                        ? "border-nest-green/30 bg-nest-green-light text-[#166534]"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Custom range
              </p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input
                  type="date"
                  value={toInputValue(draftRange.start)}
                  onChange={(event) => handleStartInputChange(event.target.value)}
                  aria-label="Start date"
                  className="h-8 border-border bg-white text-xs shadow-none"
                />
                <ArrowRight className="size-3.5 text-muted-foreground" />
                <Input
                  type="date"
                  value={toInputValue(draftRange.end)}
                  onChange={(event) => handleEndInputChange(event.target.value)}
                  aria-label="End date"
                  className="h-8 border-border bg-white text-xs shadow-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setViewMonth(
                      startOfDay(
                        new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
                      )
                    )
                  }
                  aria-label="Previous month"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <p className="text-sm font-medium">
                  {monthFormatter.format(viewMonth)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setViewMonth(
                      startOfDay(
                        new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
                      )
                    )
                  }
                  aria-label="Next month"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-px text-center">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    className="py-1 text-[0.65rem] font-medium text-muted-foreground"
                  >
                    {day}
                  </span>
                ))}
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <span key={`empty-${index}`} aria-hidden="true" />
                  }

                  const isStart = isSameDay(day, draftRange.start)
                  const isEnd = isSameDay(day, draftRange.end)
                  const isInRange = isWithinRange(day, draftRange)
                  const isPending = pendingStart ? isSameDay(day, pendingStart) : false

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "flex size-7 items-center justify-center text-xs transition-colors hover:bg-muted",
                        isInRange && "bg-nest-green-light/60 text-[#166534]",
                        (isStart || isEnd || isPending) &&
                          "bg-nest-green font-medium text-primary-foreground hover:bg-nest-green/90"
                      )}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-end gap-2 p-3">
            <Button variant="ghost" size="sm" onClick={cancelSelection}>
              Cancel
            </Button>
            <Button size="sm" onClick={applyRange}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

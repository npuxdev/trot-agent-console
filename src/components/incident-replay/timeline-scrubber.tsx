"use client"

import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { ReplayEvent, ReplayEventCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const categoryColors: Record<ReplayEventCategory, string> = {
  latency: "bg-nest-amber",
  retry: "bg-nest-orange",
  "slo-breach": "bg-nest-red",
  policy: "bg-[#7c3aed]",
  containment: "bg-nest-green",
  detection: "bg-nest-blue",
}

const categoryLabels: Record<ReplayEventCategory, string> = {
  latency: "Latency",
  retry: "Retry",
  "slo-breach": "SLO Breach",
  policy: "Policy",
  containment: "Containment",
  detection: "Detection",
}

type TimelineScrubberProps = {
  events: ReplayEvent[]
  currentIndex: number
  isPlaying: boolean
  onIndexChange: (index: number) => void
  onPlayPause: () => void
  onStepBack: () => void
  onStepForward: () => void
}

export function TimelineScrubber({
  events,
  currentIndex,
  isPlaying,
  onIndexChange,
  onPlayPause,
  onStepBack,
  onStepForward,
}: TimelineScrubberProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Playback controls */}
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onStepBack}
              disabled={currentIndex === 0}
            >
              <SkipBack className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={onStepForward}
              disabled={currentIndex === events.length - 1}
            >
              <SkipForward className="size-3.5" />
            </Button>
          </div>

          {/* Timeline track */}
          <div className="relative flex-1">
            {/* Track line */}
            <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-border" />
            {/* Progress line */}
            <div
              className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-nest-red transition-all duration-300"
              style={{
                width: `${(currentIndex / (events.length - 1)) * 100}%`,
              }}
            />

            {/* Event markers */}
            <div className="relative flex justify-between">
              {events.map((event, i) => {
                const isCurrent = i === currentIndex
                const isPast = i < currentIndex

                return (
                  <button
                    key={event.id}
                    onClick={() => onIndexChange(i)}
                    className="group relative flex flex-col items-center"
                    title={`${event.timestamp} — ${event.eventType}`}
                  >
                    {/* Marker dot */}
                    <div
                      className={cn(
                        "relative z-10 size-3 border-2 border-card transition-all",
                        isCurrent
                          ? "scale-150 ring-2 ring-nest-red/30"
                          : "group-hover:scale-125",
                        isPast || isCurrent
                          ? categoryColors[event.category]
                          : "bg-muted"
                      )}
                      style={{ borderRadius: "50%" }}
                    />

                    {/* Timestamp label */}
                    <span
                      className={cn(
                        "mt-2 text-[9px] font-mono tabular-nums transition-colors",
                        isCurrent
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {event.timestamp}
                    </span>

                    {/* Event type on hover / current */}
                    {isCurrent && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-nest-red">
                        {event.eventType}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Event counter */}
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums">
              {currentIndex + 1} / {events.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Events</p>
          </div>
        </div>

        {/* Category legend */}
        <div className="mt-3 flex flex-wrap gap-3 border-t border-border/40 pt-3">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-block size-2",
                  categoryColors[key as ReplayEventCategory]
                )}
                style={{ borderRadius: "50%" }}
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { IncidentSummaryStrip } from "./incident-summary-strip"
import { TimelineScrubber } from "./timeline-scrubber"
import { ReplayTopology } from "./replay-topology"
import { EventInspector } from "./event-inspector"
import { replayLiveMetrics, replayTimeline } from "@/lib/mock-data/incident-replay"
import { DeltaIndicator } from "@/components/shared/delta-indicator"
import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { cn } from "@/lib/utils"

export function ReplayWorkspace() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentEvent = replayTimeline[currentIndex]
  const liveMetrics = replayLiveMetrics[currentIndex]

  const activeNodeIds = useMemo(
    () => new Set(currentEvent?.topologyHighlights.activeNodes ?? []),
    [currentEvent]
  )
  const activeEdgeIds = useMemo(
    () => new Set(currentEvent?.topologyHighlights.activeEdges ?? []),
    [currentEvent]
  )

  const topologyMode = useMemo(() => {
    if (!currentEvent) return "normal" as const
    if (currentEvent.category === "containment") return "containment" as const
    if (activeEdgeIds.size > 0) return "failure" as const
    return "normal" as const
  }, [currentEvent, activeEdgeIds.size])

  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startPlayback = useCallback(() => {
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= replayTimeline.length - 1) {
          stopPlayback()
          return prev
        }
        return prev + 1
      })
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, stopPlayback])

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      stopPlayback()
    } else {
      if (currentIndex >= replayTimeline.length - 1) {
        setCurrentIndex(0)
      }
      startPlayback()
    }
  }, [isPlaying, currentIndex, stopPlayback, startPlayback])

  const handleStepBack = useCallback(() => {
    stopPlayback()
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [stopPlayback])

  const handleStepForward = useCallback(() => {
    stopPlayback()
    setCurrentIndex((prev) =>
      Math.min(replayTimeline.length - 1, prev + 1)
    )
  }, [stopPlayback])

  const handleIndexChange = useCallback(
    (i: number) => {
      stopPlayback()
      setCurrentIndex(i)
    },
    [stopPlayback]
  )

  const metricCards = liveMetrics
    ? [
        {
          label: "Latency",
          value: liveMetrics.latency,
          direction: liveMetrics.latencyDirection,
        },
        {
          label: "Retries",
          value: liveMetrics.retries,
          direction: liveMetrics.retriesDirection,
        },
        {
          label: "Cost impact",
          value: liveMetrics.costImpact,
          direction: liveMetrics.costDirection,
        },
        {
          label: "Traces affected",
          value: liveMetrics.tracesAffected,
          direction: "flat" as const,
        },
        {
          label: "Agents impacted",
          value: liveMetrics.agentsImpacted,
          direction: "flat" as const,
        },
      ]
    : []

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/topology"
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Agent Topology
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-muted-foreground">Incident Replay</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-medium">TRC-7419-A</span>
      </div>

      {/* Summary strip */}
      <IncidentSummaryStrip currentEvent={currentEvent} />

      {/* Main content */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* Left: Topology */}
        <div className="space-y-3">
          <ReplayTopology
            activeNodeIds={activeNodeIds}
            activeEdgeIds={activeEdgeIds}
            mode={topologyMode}
          />

          {/* Live metrics — update with scrubber position */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {metricCards.map((m) => (
              <Card
                key={m.label}
                className={cn(
                  overviewCardClass,
                  "transition-all duration-500"
                )}
              >
                <CardContent className="px-3 py-2">
                  <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {m.label}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <span className="text-sm font-semibold tabular-nums transition-all duration-500">
                      {m.value}
                    </span>
                    {m.direction !== "flat" && (
                      <DeltaIndicator
                        value=""
                        direction={m.direction}
                        tone={
                          m.label === "Cost impact" || m.label === "Latency" || m.label === "Retries"
                            ? m.direction === "down"
                              ? "positive"
                              : "negative"
                            : undefined
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {liveMetrics?.containmentState && (
            <p className="text-xs text-muted-foreground">
              Containment:{" "}
              <span className="font-medium text-nest-green">
                {liveMetrics.containmentState}
              </span>
            </p>
          )}
        </div>

        {/* Right: Event Inspector */}
        <EventInspector event={currentEvent} />
      </div>

      {/* Timeline scrubber */}
      <TimelineScrubber
        events={replayTimeline}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onIndexChange={handleIndexChange}
        onPlayPause={handlePlayPause}
        onStepBack={handleStepBack}
        onStepForward={handleStepForward}
      />
    </div>
  )
}

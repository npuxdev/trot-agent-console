"use client"

import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import {
  TopologyBlastRadius,
  TopologyGraph,
  TopologyIncidentBanner,
  TopologyInspector,
  TopologyLegend,
} from "@/components/topology/topology-graph"

export function TopologyWorkspace() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <PageHeader title="Agent Topology" />

      <TopologyIncidentBanner />

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <TopologyGraph
            highlightIncident
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
          <TopologyLegend />
        </div>

        <div className="space-y-3">
          <TopologyInspector nodeId={selectedNodeId} />
          <TopologyBlastRadius />
        </div>
      </div>
    </div>
  )
}

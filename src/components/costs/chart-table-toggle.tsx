"use client"

import { BarChart3, Table2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export type SpendViewMode = "chart" | "table"

type ChartTableToggleProps = {
  value: SpendViewMode
  onChange: (value: SpendViewMode) => void
}

export function ChartTableToggle({ value, onChange }: ChartTableToggleProps) {
  return (
    <ButtonGroup>
      <Button
        type="button"
        variant={value === "chart" ? "secondary" : "outline"}
        size="icon-sm"
        onClick={() => onChange("chart")}
        aria-label="Bar chart view"
        aria-pressed={value === "chart"}
      >
        <BarChart3 />
      </Button>
      <Button
        type="button"
        variant={value === "table" ? "secondary" : "outline"}
        size="icon-sm"
        onClick={() => onChange("table")}
        aria-label="Table view"
        aria-pressed={value === "table"}
      >
        <Table2 />
      </Button>
    </ButtonGroup>
  )
}

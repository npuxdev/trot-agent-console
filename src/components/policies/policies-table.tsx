"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, History } from "lucide-react"

import { PolicyDetailSheet } from "@/components/policies/policy-detail-sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import { FilterableTable } from "@/components/shared/filterable-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass, tableRowClickableClass } from "@/lib/card-styles"
import { policies } from "@/lib/mock-data/policies"
import type { Policy } from "@/lib/types"
import { cn } from "@/lib/utils"

type Severity = "critical" | "high" | "medium" | "low"

const severityRank: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const severityStyles: Record<Severity, string> = {
  critical: "border-nest-red/30 bg-nest-red-light text-nest-red",
  high: "border-nest-orange/30 bg-nest-orange-light text-nest-orange",
  medium: "border-nest-amber/30 bg-nest-amber-light text-nest-amber",
  low: "border-border bg-muted/60 text-muted-foreground",
}

function getPolicySeverity(policy: Policy): Severity | null {
  let max: Severity | null = null
  for (const violation of policy.violations) {
    const severity = violation.severity
    if (!severity) continue
    if (!max || severityRank[severity] > severityRank[max]) {
      max = severity
    }
  }
  return max
}

function SeverityPill({ severity }: { severity: Severity | null }) {
  if (!severity) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2 text-xs font-medium capitalize",
        severityStyles[severity]
      )}
    >
      {severity}
    </span>
  )
}

type PolicyRow = Policy & Record<string, unknown>

export function PoliciesTable() {
  const rows: PolicyRow[] = policies.map((p) => ({ ...p }))
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <FilterableTable
        data={rows}
        searchPlaceholder="Search policies..."
        searchKeys={["name", "scope", "type"]}
        filters={[
          {
            key: "status",
            label: "statuses",
            options: [
              { label: "Success", value: "success" },
              { label: "Warning", value: "warning" },
              { label: "Degraded", value: "degraded" },
            ],
          },
        ]}
      >
        {(filtered) => (
          <Card className={overviewCardClass}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/50 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      <th className="px-4 py-2.5 font-medium">Policy</th>
                      <th className="px-4 py-2.5 font-medium">Type</th>
                      <th className="px-4 py-2.5 font-medium">Severity</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium">Owner</th>
                      <th className="px-4 py-2.5 font-medium">Last modified</th>
                      <th className="px-4 py-2.5 font-medium">Agents</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                      <th className="w-8 px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((policy) => (
                      <tr
                        key={policy.id}
                        onClick={() => setSelectedId(policy.id)}
                        className={tableRowClickableClass}
                      >
                        <td className="px-4 py-2.5">
                          <div className="font-medium">{policy.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {policy.scope}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">{policy.type}</td>
                        <td className="px-4 py-2.5">
                          <SeverityPill severity={getPolicySeverity(policy)} />
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={policy.status} />
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {policy.owner}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {policy.lastModified}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                          {policy.boundAgentIds.length}
                        </td>
                        <td className="px-4 py-2.5">
                          <Link
                            href={`/policies/history?policy=${policy.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-nest-blue"
                          >
                            <History className="size-3" />
                            History
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </FilterableTable>

      <PolicyDetailSheet
        policyId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  )
}

export function PolicyViolationsTable() {
  const rows = policies.flatMap((p) =>
    p.violations.map((v) => ({
      ...v,
      policyName: p.name,
    }))
  )

  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Violations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
                <tr className={tableHeadClass}>
                  <th className="px-4 py-2.5 font-medium">Policy</th>
                  <th className="px-4 py-2.5 font-medium">Agent</th>
                  <th className="px-4 py-2.5 font-medium">Message</th>
                  <th className="px-4 py-2.5 font-medium">Time</th>
                  <th className="px-4 py-2.5 font-medium">Links</th>
                </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-2.5 font-medium">{v.policyName}</td>
                  <td className="px-4 py-2.5">{v.agentName}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {v.message}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{v.time}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-3 text-xs">
                      <Link
                        href={`/audit?policy=${v.policyId}`}
                        className="font-medium text-nest-blue hover:underline"
                      >
                        Audit
                      </Link>
                      {v.traceId && (
                        <Link
                          href={`/observability?trace=${v.traceId}`}
                          className="font-medium text-nest-blue hover:underline"
                        >
                          Trace
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

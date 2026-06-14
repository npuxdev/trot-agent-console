"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { PolicyDetailSheet } from "@/components/policies/policy-detail-sheet"
import { StatusBadge } from "@/components/overview/status-badge"
import { FilterableTable } from "@/components/shared/filterable-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass } from "@/lib/card-styles"
import { policies } from "@/lib/mock-data/policies"
import type { Policy } from "@/lib/types"

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
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/50 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      <th className="px-4 py-2.5 font-medium">Policy</th>
                      <th className="px-4 py-2.5 font-medium">Type</th>
                      <th className="px-4 py-2.5 font-medium">Threshold</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium">Agents</th>
                      <th className="w-8 px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((policy) => (
                      <tr
                        key={policy.id}
                        onClick={() => setSelectedId(policy.id)}
                        className="group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{policy.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {policy.scope}
                          </div>
                        </td>
                        <td className="px-4 py-3">{policy.type}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {policy.threshold}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={policy.status} />
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">
                          {policy.boundAgentIds.length}
                        </td>
                        <td className="px-4 py-3 text-right">
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
                  <td className="px-4 py-3 font-medium">{v.policyName}</td>
                  <td className="px-4 py-3">{v.agentName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {v.message}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-xs">
                      <Link
                        href={`/audit?policy=${v.policyId}`}
                        className="font-medium text-nest-green hover:underline"
                      >
                        Audit
                      </Link>
                      {v.traceId && (
                        <Link
                          href={`/observability?trace=${v.traceId}`}
                          className="font-medium text-nest-green hover:underline"
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

"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { AuditEventDetailSheet } from "@/components/audit/audit-event-detail-sheet"
import { FilterableTable } from "@/components/shared/filterable-table"
import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { auditEvents } from "@/lib/mock-data/audit"
import type { AuditEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

type AuditRow = AuditEvent & Record<string, unknown>

const outcomeStyles: Record<AuditEvent["outcome"], string> = {
  success: "bg-nest-green-light text-[#15663a]",
  warning: "bg-[#f7efd2] text-[#8a6c16]",
  failure: "bg-nest-red-light text-nest-red",
}

export function AuditLogTable() {
  const searchParams = useSearchParams()
  const policyFilter = searchParams.get("policy")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rows: AuditRow[] = useMemo(() => {
    const data = policyFilter
      ? auditEvents.filter((e) => e.relatedPolicyId === policyFilter)
      : auditEvents
    return data.map((e) => ({ ...e }))
  }, [policyFilter])

  return (
    <div className="space-y-3">
      {policyFilter && (
        <div className="flex items-center gap-2 border border-nest-green/20 bg-nest-green-light/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            Filtered by policy:{" "}
            <span className="font-medium text-foreground">{policyFilter}</span>
          </span>
          <Link
            href="/audit"
            className="ml-auto inline-flex items-center gap-1 font-medium text-nest-green hover:underline"
          >
            Clear
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      )}
      <FilterableTable
        data={rows}
        searchPlaceholder="Search audit log..."
        searchKeys={["action", "resource", "agentName", "actor"]}
        filters={[
          {
            key: "outcome",
            label: "outcomes",
            options: [
              { label: "Success", value: "success" },
              { label: "Warning", value: "warning" },
              { label: "Failure", value: "failure" },
            ],
          },
        ]}
      >
        {(filtered) => (
          <Card className={overviewCardClass}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/50 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      <th className="px-4 py-2.5 font-medium">Timestamp</th>
                      <th className="px-4 py-2.5 font-medium">Action</th>
                      <th className="px-4 py-2.5 font-medium">Agent</th>
                      <th className="px-4 py-2.5 font-medium">Outcome</th>
                      <th className="w-8 px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((event) => (
                      <tr
                        key={event.id}
                        onClick={() => setSelectedId(event.id)}
                        className="group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {event.timestamp}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{event.action}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.actor} · {event.resource}
                          </div>
                        </td>
                        <td className="px-4 py-3">{event.agentName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex h-5 items-center px-2 text-xs font-medium capitalize",
                              outcomeStyles[event.outcome]
                            )}
                          >
                            {event.outcome}
                          </span>
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

      <AuditEventDetailSheet
        eventId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  )
}

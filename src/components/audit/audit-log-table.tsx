"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Fragment, useMemo, useState } from "react"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { AuditEventDetailSheet } from "@/components/audit/audit-event-detail-sheet"
import { FilterableTable } from "@/components/shared/filterable-table"
import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination"
import { Card, CardContent } from "@/components/ui/card"
import {
  overviewCardClass,
  tableGroupCellClass,
  tableHeadClass,
  tableRowClickableClass,
} from "@/lib/card-styles"
import { contextBarClass } from "@/lib/layout-styles"
import { auditEvents } from "@/lib/mock-data/audit"
import type { AuditEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

type AuditRow = AuditEvent & Record<string, unknown>

const PAGE_SIZE_OPTIONS = [5, 10, 25] as const

const outcomeStyles: Record<AuditEvent["outcome"], string> = {
  success:
    "border border-border border-l-2 border-l-nest-green bg-card text-nest-green",
  warning:
    "border border-border border-l-2 border-l-nest-amber bg-card text-nest-amber",
  failure:
    "border border-nest-red/30 border-l-2 border-l-nest-red bg-nest-red-light text-nest-red",
}

function groupByDate(rows: AuditRow[]) {
  const groups = new Map<string, AuditRow[]>()
  for (const event of rows) {
    const date = event.timestamp.slice(0, 10)
    const list = groups.get(date) ?? []
    list.push(event)
    groups.set(date, list)
  }
  return [...groups.entries()]
}

function AuditLogRows({
  filtered,
  onSelect,
}: {
  filtered: AuditRow[]
  onSelect: (id: string) => void
}) {
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])
  const { paginated, page, setPage, total } = usePagination(filtered, pageSize)

  if (filtered.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted-foreground">
        No events match your filters.
      </p>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className={tableHeadClass}>
              <th className="px-4 py-2.5">Timestamp</th>
              <th className="px-4 py-2.5">Action</th>
              <th className="px-4 py-2.5">Agent</th>
              <th className="px-4 py-2.5">Outcome</th>
              <th className="w-8 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {groupByDate(paginated).map(([date, events]) => (
              <Fragment key={date}>
                <tr>
                  <td colSpan={5} className={tableGroupCellClass}>
                    {date} · {events.length} event
                    {events.length === 1 ? "" : "s"}
                  </td>
                </tr>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => onSelect(event.id)}
                    className={tableRowClickableClass}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {event.timestamp.slice(11)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{event.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.actor} · {event.resource}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">{event.agentName}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex h-5 items-center px-2 text-xs font-medium capitalize",
                          outcomeStyles[event.outcome]
                        )}
                      >
                        {event.outcome}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ChevronRight className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
        onPageSizeChange={setPageSize}
      />
    </>
  )
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
        <div className={`${contextBarClass} border border-nest-blue/25 bg-card`}>
          <span className="text-muted-foreground">
            Filtered by policy:{" "}
            <span className="font-medium text-foreground">{policyFilter}</span>
          </span>
          <Link
            href="/audit"
            className="ml-auto inline-flex items-center gap-1 font-medium text-nest-blue hover:underline"
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
              <AuditLogRows
                filtered={filtered}
                onSelect={setSelectedId}
              />
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

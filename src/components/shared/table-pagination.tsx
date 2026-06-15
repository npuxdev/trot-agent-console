"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [items, pageSize])

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  return {
    page: safePage,
    setPage,
    total,
    totalPages,
    paginated,
    pageSize,
    rangeStart: total === 0 ? 0 : (safePage - 1) * pageSize + 1,
    rangeEnd: Math.min(safePage * pageSize, total),
  }
}

function PageSizeSelect({
  pageSize,
  options,
  onChange,
}: {
  pageSize: number
  options: number[]
  onChange: (size: number) => void
}) {
  return (
    <div className="relative">
      <select
        value={pageSize}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-7 appearance-none rounded-none border border-border bg-white pl-2 pr-7 text-xs text-foreground"
        aria-label="Rows per page"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

type TablePaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
  label?: string
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
}

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
  label = "events",
  pageSizeOptions,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showPageControls = totalPages > 1
  const showPageSizeSelect = Boolean(pageSizeOptions?.length && onPageSizeChange)

  if (total === 0 || (!showPageControls && !showPageSizeSelect)) return null

  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border/60 px-4 py-2.5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground tabular-nums">
          {rangeStart}–{rangeEnd} of {total} {label}
        </p>
        {showPageSizeSelect && (
          <PageSizeSelect
            pageSize={pageSize}
            options={pageSizeOptions!}
            onChange={onPageSizeChange!}
          />
        )}
      </div>
      {showPageControls && (
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-12 text-center text-xs text-muted-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

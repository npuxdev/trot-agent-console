"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [items])

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

type TablePaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
  label?: string
}

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
  label = "events",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border/60 px-4 py-2.5",
        className
      )}
    >
      <p className="text-xs text-muted-foreground tabular-nums">
        {rangeStart}–{rangeEnd} of {total} {label}
      </p>
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
    </div>
  )
}

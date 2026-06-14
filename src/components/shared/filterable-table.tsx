"use client"

import { useMemo, useState } from "react"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type FilterOption = {
  label: string
  value: string
}

type FilterableTableProps<T> = {
  data: T[]
  searchPlaceholder?: string
  searchKeys: (keyof T)[]
  filters?: {
    key: keyof T
    label: string
    options: FilterOption[]
  }[]
  children: (filtered: T[]) => React.ReactNode
  className?: string
}

export function FilterableTable<T extends Record<string, unknown>>({
  data,
  searchPlaceholder = "Search",
  searchKeys,
  filters = [],
  children,
  className,
}: FilterableTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()

    return data.filter((row) => {
      const matchesSearch =
        !query ||
        searchKeys.some((key) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(query)
        )

      const matchesFilters = filters.every((filter) => {
        const value = filterValues[String(filter.key)]
        if (!value || value === "all") return true
        return String(row[filter.key]) === value
      })

      return matchesSearch && matchesFilters
    })
  }, [data, search, searchKeys, filters, filterValues])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-border bg-white pl-9 shadow-none"
          />
        </div>
        {filters.map((filter) => (
          <select
            key={String(filter.key)}
            value={filterValues[String(filter.key)] ?? "all"}
            onChange={(e) =>
              setFilterValues((prev) => ({
                ...prev,
                [String(filter.key)]: e.target.value,
              }))
            }
            className="h-9 rounded-none border border-border bg-white px-3 text-sm text-foreground"
            aria-label={filter.label}
          >
            <option value="all">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>
      {children(filtered)}
    </div>
  )
}

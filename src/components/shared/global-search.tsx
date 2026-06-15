"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  groupSearchResults,
  searchGlobal,
  type SearchResult,
} from "@/lib/global-search"
import { cn } from "@/lib/utils"

export function GlobalSearch() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => searchGlobal(query), [query])
  const groupedResults = useMemo(() => groupSearchResults(results), [results])
  const flatResults = results

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(0)
  }, [])

  const navigateTo = useCallback(
    (result: SearchResult) => {
      router.push(result.href)
      setQuery("")
      close()
      inputRef.current?.blur()
    },
    [router, close]
  )

  useEffect(() => {
    if (activeIndex >= flatResults.length) {
      setActiveIndex(Math.max(0, flatResults.length - 1))
    }
  }, [activeIndex, flatResults.length])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [close])

  useEffect(() => {
    if (!isOpen || !listRef.current) return

    const activeElement = listRef.current.querySelector<HTMLElement>(
      `[data-search-index="${activeIndex}"]`
    )
    activeElement?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, isOpen])

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.ctrlKey || event.metaKey)) {
        return
      }

      event.preventDefault()
      inputRef.current?.focus()
      setIsOpen(true)
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    return () => document.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true)
      return
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (flatResults.length > 0) {
          setActiveIndex((index) => (index + 1) % flatResults.length)
        }
        break
      case "ArrowUp":
        event.preventDefault()
        if (flatResults.length > 0) {
          setActiveIndex((index) => (index - 1 + flatResults.length) % flatResults.length)
        }
        break
      case "Enter":
        event.preventDefault()
        if (flatResults[activeIndex]) {
          navigateTo(flatResults[activeIndex])
        }
        break
      case "Escape":
        event.preventDefault()
        close()
        inputRef.current?.blur()
        break
      case "Tab":
        close()
        break
    }
  }

  let resultOffset = 0

  const showShortcutHint = query.length === 0 && !isOpen

  return (
    <div ref={containerRef} className="relative w-[21.42rem]">
      <Search className="absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={query}
        placeholder="Search agents, traces, policies, tools…"
        aria-label="Search agents, traces, policies, and tools"
        aria-expanded={isOpen}
        aria-controls="global-search-results"
        aria-autocomplete="list"
        aria-activedescendant={
          isOpen && flatResults[activeIndex]
            ? `global-search-option-${activeIndex}`
            : undefined
        }
        role="combobox"
        className="h-9 border-border bg-white pr-[4.5rem] pl-9 shadow-none placeholder:text-[color-mix(in_oklab,white_15%,var(--muted-foreground))]"
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setIsOpen(true)
        }}
        onFocus={() => {
          setIsOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />
      {showShortcutHint ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2.5 z-10 flex -translate-y-1/2 items-center gap-0.5"
        >
          <kbd className="inline-flex size-[1.125rem] items-center justify-center rounded-sm border border-border/80 bg-muted/60 text-[9px] font-medium text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            ⌘
          </kbd>
          <span className="text-[9px] font-medium text-muted-foreground/50">+</span>
          <kbd className="inline-flex size-[1.125rem] items-center justify-center rounded-sm border border-border/80 bg-muted/60 text-[9px] font-medium text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            K
          </kbd>
        </div>
      ) : null}

      {isOpen && (
        <div
          id="global-search-results"
          ref={listRef}
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 z-50 max-h-80 w-full overflow-y-auto border border-border bg-white shadow-md"
        >
          {flatResults.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">No results found.</p>
          ) : (
            groupedResults.map((group) => (
              <div key={group.section}>
                <p className="sticky top-0 border-b border-border/60 bg-muted/40 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/80 uppercase">
                  {group.section}
                </p>
                <ul>
                  {group.items.map((result) => {
                    const index = resultOffset
                    resultOffset += 1
                    const Icon = result.icon
                    const isActive = index === activeIndex

                    return (
                      <li key={result.id}>
                        <button
                          id={`global-search-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-search-index={index}
                          className={cn(
                            "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-muted/50"
                          )}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => navigateTo(result)}
                        >
                          {Icon ? (
                            <span
                              className={cn(
                                "mt-0.5 flex size-7 shrink-0 items-center justify-center border",
                                isActive
                                  ? "border-nest-green/30 bg-nest-green/10 text-nest-green"
                                  : "border-transparent bg-muted/60 text-muted-foreground"
                              )}
                            >
                              <Icon className="size-3.5" />
                            </span>
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{result.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {result.breadcrumb}
                            </span>
                            {result.subtitle ? (
                              <span className="mt-0.5 block truncate text-xs text-muted-foreground/80">
                                {result.subtitle}
                              </span>
                            ) : null}
                          </span>
                          {result.type === "trace" ? (
                            <span className="mt-0.5 shrink-0 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                              Trace
                            </span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

const LOADING_DURATION_MS = 1500

type DateRangeContextValue = {
  isLoading: boolean
  notifyRangeApplied: (changed: boolean) => void
}

const DateRangeContext = createContext<DateRangeContextValue | null>(null)

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const notifyRangeApplied = useCallback((changed: boolean) => {
    if (!changed) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsLoading(true)
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null
    }, LOADING_DURATION_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <DateRangeContext.Provider value={{ isLoading, notifyRangeApplied }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export function useDateRange() {
  const context = useContext(DateRangeContext)

  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider")
  }

  return context
}

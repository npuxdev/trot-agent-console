"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Dialog } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  headerExtra?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  eyebrow,
  headerExtra,
  footer,
  children,
  className,
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-40 bg-[rgba(15,23,42,0.28)] backdrop-blur-[1px]",
            "transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-border bg-card shadow-[-8px_0_24px_rgba(15,23,42,0.08)] outline-none",
            "transition-transform duration-300 ease-out data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
            className
          )}
        >
          <div className="flex items-start gap-3 border-b border-border px-5 py-4">
            <div className="min-w-0 flex-1">
              {eyebrow && (
                <div className="mb-1 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  {eyebrow}
                </div>
              )}
              <Dialog.Title className="truncate text-lg font-semibold tracking-tight text-foreground">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-0.5 text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
              {headerExtra && <div className="mt-2.5">{headerExtra}</div>}
            </div>
            <Dialog.Close
              className="flex size-8 shrink-0 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {footer && (
            <div className="sticky bottom-0 z-10 border-t border-border bg-muted/30 px-5 py-3">
              {footer}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function SheetSection({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-2.5", className)}>
      {title && (
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
      )}
      {children}
    </section>
  )
}

export function SheetStat({
  label,
  value,
  tone,
}: {
  label: string
  value: ReactNode
  tone?: "default" | "warning" | "danger" | "success"
}) {
  const toneClass = {
    default: "text-foreground",
    warning: "text-[#a16207]",
    danger: "text-nest-red",
    success: "text-nest-green",
  }[tone ?? "default"]

  return (
    <div className="border border-border/70 bg-background/60 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-semibold", toneClass)}>{value}</p>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { TrotLogo } from "@/components/trot-logo"
import { SidebarAccount } from "@/components/sidebar-account"
import { cn } from "@/lib/utils"
import { navSections, type NavBadgeTone } from "@/lib/navigation"

const badgeToneClass: Record<NavBadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground group-hover:bg-background/70",
  warning: "bg-[#fef3c7] text-[#92600c]",
  danger: "bg-nest-red-light text-nest-red",
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[256px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 pt-5 pb-4">
        <Link href="/" className="inline-flex">
          <TrotLogo />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-2">
        {navSections.map((section, sectionIndex) => (
          <div
            key={section.label}
            className={cn(
              "space-y-0.5 py-2",
              sectionIndex > 0 && "border-t border-sidebar-border/70"
            )}
          >
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground/80 uppercase">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2 transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--color-sidebar-border)]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/40"
                  )}
                >
                  {isActive && (
                    <span className="absolute top-1 bottom-1 left-0 w-[3px] bg-nest-green" />
                  )}
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center border transition-colors",
                      isActive
                        ? "border-nest-green/40 bg-nest-green/15 text-nest-green"
                        : "border-transparent bg-muted/60 text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          isActive
                            ? "font-semibold text-sidebar-accent-foreground"
                            : "font-medium"
                        )}
                      >
                        {item.title}
                      </span>
                      {item.badge && (
                        <span
                          className={cn(
                            "shrink-0 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                            badgeToneClass[item.badge.tone ?? "neutral"]
                          )}
                        >
                          {item.badge.label}
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <SidebarAccount />
      </div>
    </aside>
  )
}

"use client"

import Link from "next/link"
import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  SunMoon,
  UserCircle,
} from "lucide-react"
import { Menu } from "@base-ui/react/menu"

import { currentUser } from "@/lib/mock-data/user"
import { cn } from "@/lib/utils"

const menuItemClass =
  "flex w-full cursor-default items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"

export function SidebarAccount() {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "flex w-full items-center gap-2.5 border border-transparent px-2.5 py-2 text-left transition-colors",
          "hover:border-sidebar-border hover:bg-sidebar-accent/40",
          "aria-expanded:border-sidebar-border aria-expanded:bg-sidebar-accent/50"
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center bg-nest-green text-sm font-semibold text-white">
          {currentUser.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-sidebar-foreground">
            {currentUser.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {currentUser.role}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="top" align="end" sideOffset={8} className="z-50">
          <Menu.Popup
            className={cn(
              "w-64 origin-[var(--transform-origin)] border border-border bg-popover py-1.5 shadow-[0_8px_30px_rgba(74,67,52,0.18)]",
              "transition-[opacity,transform] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
            )}
          >
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center bg-nest-green text-sm font-semibold text-white">
                {currentUser.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <Menu.Separator className="my-1 h-px bg-border" />

            <Menu.Item
              className={menuItemClass}
              render={<Link href="/settings/profile" />}
            >
              <UserCircle className="size-4 text-muted-foreground" />
              Profile
            </Menu.Item>
            <Menu.Item
              className={menuItemClass}
              render={<Link href="/settings" />}
            >
              <Settings className="size-4 text-muted-foreground" />
              Account settings
            </Menu.Item>
            <Menu.Item
              className={menuItemClass}
              render={<Link href="/settings?tab=billing" />}
            >
              <CreditCard className="size-4 text-muted-foreground" />
              Billing & usage
            </Menu.Item>
            <Menu.Item
              className={menuItemClass}
              render={<Link href="/settings?tab=notifications" />}
            >
              <Bell className="size-4 text-muted-foreground" />
              Notifications
            </Menu.Item>

            <Menu.Separator className="my-1 h-px bg-border" />

            <Menu.Item className={menuItemClass}>
              <SunMoon className="size-4 text-muted-foreground" />
              Theme
              <span className="ml-auto text-xs text-muted-foreground">Light</span>
            </Menu.Item>
            <Menu.Item
              className={cn(
                menuItemClass,
                "text-nest-red data-[highlighted]:bg-nest-red-light data-[highlighted]:text-nest-red"
              )}
            >
              <LogOut className="size-4" />
              Sign out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

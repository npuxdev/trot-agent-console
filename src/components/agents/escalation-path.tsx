"use client"

import { Menu } from "@base-ui/react/menu"
import { ChevronDown, MessageSquare, Phone } from "lucide-react"

import {
  getOnCallContact,
  slackDmUrl,
  type OnCallContact,
} from "@/lib/mock-data/contacts"
import { cn } from "@/lib/utils"

const menuItemClass =
  "flex w-full cursor-default items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground outline-none transition-colors select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"

function OnCallContactLink({ contact }: { contact: OnCallContact }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "inline-flex items-center gap-0.5 font-medium text-nest-blue",
          "underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-blue/40"
        )}
      >
        {contact.name}
        <ChevronDown className="size-3.5 opacity-70" aria-hidden />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="start" sideOffset={4} className="z-50">
          <Menu.Popup
            className={cn(
              "min-w-44 origin-[var(--transform-origin)] border border-border bg-popover py-1.5 shadow-[0_8px_30px_rgba(74,67,52,0.18)]",
              "transition-[opacity,transform] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
            )}
          >
            <Menu.Item
              className={menuItemClass}
              render={
                <a
                  href={slackDmUrl(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageSquare className="size-4 text-muted-foreground" />
              Message on Slack
            </Menu.Item>
            <Menu.Item
              className={menuItemClass}
              render={<a href={`tel:${contact.phone}`} />}
            >
              <Phone className="size-4 text-muted-foreground" />
              Call {contact.phone}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function EscalationPath({ path }: { path: string }) {
  const separator = " → "
  const separatorIndex = path.indexOf(separator)

  if (separatorIndex === -1) {
    return <span className="min-w-0 truncate">{path}</span>
  }

  const route = path.slice(0, separatorIndex)
  const contactName = path.slice(separatorIndex + separator.length)
  const contact = getOnCallContact(contactName)

  if (!contact) {
    return <span className="min-w-0 truncate">{path}</span>
  }

  return (
    <span className="min-w-0 truncate">
      {route}
      {separator}
      <OnCallContactLink contact={contact} />
    </span>
  )
}

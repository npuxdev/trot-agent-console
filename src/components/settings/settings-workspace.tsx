"use client"

import { useSearchParams } from "next/navigation"
import {
  Bell,
  CreditCard,
  KeyRound,
  SlidersHorizontal,
  UserCircle,
  Users,
} from "lucide-react"
import { Tabs } from "@base-ui/react/tabs"

import { ProfilePanel } from "@/components/settings/profile-panel"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import { cn } from "@/lib/utils"

const tabs = [
  { value: "profile", label: "Profile", icon: UserCircle },
  { value: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "billing", label: "Billing & usage", icon: CreditCard },
  { value: "members", label: "Members", icon: Users },
  { value: "apikeys", label: "API keys", icon: KeyRound },
] as const

type TabValue = (typeof tabs)[number]["value"]

function Toggle({ on }: { on?: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center px-0.5 transition-colors",
        on ? "bg-nest-green" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "size-4 bg-white shadow-sm transition-transform",
          on ? "translate-x-4" : "translate-x-0"
        )}
      />
    </span>
  )
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  )
}

function SimplePanel({
  title,
  rows,
}: {
  title: string
  rows: { title: string; description: string; on?: boolean }[]
}) {
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {rows.map((row) => (
            <SettingRow
              key={row.title}
              title={row.title}
              description={row.description}
              control={<Toggle on={row.on} />}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function BillingPanel() {
  return (
    <div className="space-y-4">
      <Card className={overviewCardClass}>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Current plan
            </p>
            <p className="text-xl font-semibold tracking-tight">
              Enterprise · Observability
            </p>
            <p className="text-sm text-muted-foreground">
              Billed annually · Renews Mar 2027
            </p>
          </div>
          <Button variant="outline" size="sm">
            Manage plan
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Spend this period", value: "$12.4k" },
          { label: "Tokens used", value: "48.2M" },
          { label: "Seats", value: "24 / 30" },
        ].map((stat) => (
          <Card key={stat.label} className={overviewCardClass}>
            <CardContent className="space-y-1 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MembersPanel() {
  const members = [
    { name: "Dana Okafor", email: "dana.okafor@nest.io", role: "Platform Admin" },
    { name: "Marco Reyes", email: "marco.reyes@nest.io", role: "Engineer" },
    { name: "Priya Nathan", email: "priya.nathan@nest.io", role: "Engineer" },
    { name: "Sam Whitfield", email: "sam.whitfield@nest.io", role: "Viewer" },
  ]
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Workspace members
        </CardTitle>
        <CardAction>
          <Button size="sm">Invite</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {members.map((m) => (
            <div key={m.email} className="flex items-center gap-3 px-5 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-xs font-semibold text-muted-foreground">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {m.email}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{m.role}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ApiKeysPanel() {
  const keys = [
    { label: "Production ingest", masked: "nest_live_••••8f2a", used: "2m ago" },
    { label: "CI pipeline", masked: "nest_ci_••••11d7", used: "4h ago" },
  ]
  return (
    <Card className={overviewCardClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">API keys</CardTitle>
        <CardAction>
          <Button size="sm">Create key</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {keys.map((k) => (
            <div
              key={k.label}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{k.label}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {k.masked}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Used {k.used}
                </span>
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SettingsWorkspace() {
  const searchParams = useSearchParams()
  const requested = searchParams.get("tab")
  const defaultTab: TabValue = tabs.some((t) => t.value === requested)
    ? (requested as TabValue)
    : "profile"

  return (
    <Tabs.Root
      defaultValue={defaultTab}
      orientation="vertical"
      className="grid gap-5 lg:grid-cols-[200px_1fr]"
    >
      <Tabs.List className="flex h-fit flex-row gap-1 overflow-x-auto border-b border-border pb-2 lg:flex-col lg:border-0 lg:pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex shrink-0 items-center gap-2.5 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none",
                "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                "data-[selected]:bg-sidebar-accent data-[selected]:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </Tabs.Tab>
          )
        })}
      </Tabs.List>

      <div className="min-w-0">
        <Tabs.Panel value="profile">
          <ProfilePanel />
        </Tabs.Panel>
        <Tabs.Panel value="preferences">
          <SimplePanel
            title="Preferences"
            rows={[
              {
                title: "Compact tables",
                description: "Reduce row height across data tables.",
                on: true,
              },
              {
                title: "Show trace previews on hover",
                description: "Preview span timing before opening details.",
                on: true,
              },
              {
                title: "Default to last visited section",
                description: "Open where you left off on sign-in.",
              },
            ]}
          />
        </Tabs.Panel>
        <Tabs.Panel value="notifications">
          <SimplePanel
            title="Notifications"
            rows={[
              {
                title: "Policy violations",
                description: "Alert when an agent breaches a guardrail.",
                on: true,
              },
              {
                title: "Degraded MCP servers",
                description: "Notify when a tool server degrades.",
                on: true,
              },
              {
                title: "Weekly cost digest",
                description: "Summary of spend and token usage.",
              },
            ]}
          />
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <BillingPanel />
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <MembersPanel />
        </Tabs.Panel>
        <Tabs.Panel value="apikeys">
          <ApiKeysPanel />
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}

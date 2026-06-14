import {
  Activity,
  Bot,
  History,
  LayoutDashboard,
  Server,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { agents } from "@/lib/mock-data/agents"
import { mcpServers } from "@/lib/mock-data/mcp-servers"
import { allViolations, policies } from "@/lib/mock-data/policies"
import { traces } from "@/lib/mock-data/traces"
import { costSummary } from "@/lib/mock-data/costs"
import { auditSummary } from "@/lib/mock-data/audit"

export type NavBadgeTone = "neutral" | "warning" | "danger"

export type NavBadge = {
  label: string
  tone?: NavBadgeTone
}

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  description: string
  badge?: NavBadge
}

export type NavSection = {
  label: string
  items: NavItem[]
}

const degradedServers = mcpServers.filter((s) => s.status === "degraded").length

export const navSections: NavSection[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Overview",
        href: "/",
        icon: LayoutDashboard,
        description: "System health & alerts",
      },
      {
        title: "Agents",
        href: "/agents",
        icon: Bot,
        description: "Fleet & performance",
        badge: { label: String(agents.length), tone: "neutral" },
      },
      {
        title: "MCP Registry",
        href: "/mcp-registry",
        icon: Server,
        description: "Connected tool servers",
        badge: degradedServers
          ? { label: `${degradedServers} down`, tone: "danger" }
          : { label: String(mcpServers.length), tone: "neutral" },
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        title: "Policies",
        href: "/policies",
        icon: ShieldCheck,
        description: "Guardrails & SLOs",
        badge: allViolations.length
          ? { label: String(allViolations.length), tone: "warning" }
          : { label: String(policies.length), tone: "neutral" },
      },
      {
        title: "Audit",
        href: "/audit",
        icon: History,
        description: "Event history",
        badge: { label: String(auditSummary.eventsToday), tone: "neutral" },
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        title: "Observability",
        href: "/observability",
        icon: Activity,
        description: "Traces & spans",
        badge: { label: String(traces.length), tone: "neutral" },
      },
      {
        title: "Costs",
        href: "/costs",
        icon: Wallet,
        description: "Spend & tokens",
        badge: {
          label: `$${(costSummary.totalSpend / 1000).toFixed(1)}k`,
          tone: "neutral",
        },
      },
    ],
  },
]

export const navItems: NavItem[] = navSections.flatMap((s) => s.items)

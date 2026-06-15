import {
  Activity,
  Bot,
  History,
  LayoutDashboard,
  Network,
  ScrollText,
  Server,
  Shield,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { agents } from "@/lib/mock-data/agents"
import { mcpServers } from "@/lib/mock-data/mcp-servers"
import {
  allViolations,
  governanceSummary,
  policies,
} from "@/lib/mock-data/policies"
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
    label: "Operations",
    items: [
      {
        title: "Operations Center",
        href: "/",
        icon: LayoutDashboard,
        description: "Workforce posture & narrative",
      },
      {
        title: "Agent Topology",
        href: "/topology",
        icon: Network,
        description: "Ecosystem map & blast radius",
        badge: { label: "Live", tone: "neutral" },
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        title: "Agents",
        href: "/agents",
        icon: Bot,
        description: "Fleet & permissions",
        badge: { label: String(agents.length), tone: "neutral" },
      },
      {
        title: "MCP Registry",
        href: "/mcp-registry",
        icon: Server,
        description: "Tool servers & access",
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
        title: "Governance",
        href: "/governance",
        icon: Shield,
        description: "Policies, approvals & trust",
        badge: governanceSummary.pendingApprovals
          ? {
              label: `${governanceSummary.pendingApprovals} pending`,
              tone: "warning",
            }
          : { label: String(policies.length), tone: "neutral" },
      },
      {
        title: "Policies",
        href: "/policies",
        icon: ScrollText,
        description: "Rules & thresholds",
        badge: allViolations.length
          ? { label: String(allViolations.length), tone: "warning" }
          : { label: String(policies.length), tone: "neutral" },
      },
      {
        title: "Audit",
        href: "/audit",
        icon: History,
        description: "Decision history",
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
        description: "Spend & token budgets",
        badge: {
          label: `$${(costSummary.totalSpend / 1000).toFixed(1)}k`,
          tone: "neutral",
        },
      },
    ],
  },
]

export const navItems: NavItem[] = navSections.flatMap((s) => s.items)

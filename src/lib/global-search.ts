import {
  Activity,
  Bell,
  CreditCard,
  KeyRound,
  Settings,
  SlidersHorizontal,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react"

import { navSections } from "@/lib/navigation"
import { traces } from "@/lib/mock-data/traces"

export type SearchResultType = "page" | "section" | "trace"

export type SearchResult = {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  section: string
  breadcrumb: string
  href: string
  keywords: string[]
  icon?: LucideIcon
}

const settingsTabs: {
  value: string
  label: string
  icon: LucideIcon
  description: string
}[] = [
  { value: "profile", label: "Profile", icon: UserCircle, description: "Name, role, and contact" },
  {
    value: "preferences",
    label: "Preferences",
    icon: SlidersHorizontal,
    description: "Display and workspace defaults",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alerts and digests",
  },
  {
    value: "billing",
    label: "Billing & usage",
    icon: CreditCard,
    description: "Plan, invoices, and limits",
  },
  { value: "members", label: "Members", icon: Users, description: "Team access and roles" },
  { value: "apikeys", label: "API keys", icon: KeyRound, description: "Programmatic access tokens" },
]

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  for (const section of navSections) {
    for (const item of section.items) {
      results.push({
        id: `page:${item.href}`,
        type: "page",
        title: item.title,
        subtitle: item.description,
        section: section.label,
        breadcrumb: `${section.label} › ${item.title}`,
        href: item.href,
        keywords: [section.label, item.title, item.description, item.href],
        icon: item.icon,
      })
    }
  }

  results.push({
    id: "page:/settings",
    type: "page",
    title: "Settings",
    subtitle: "Account and workspace configuration",
    section: "Account",
    breadcrumb: "Account › Settings",
    href: "/settings",
    keywords: ["account", "settings", "workspace", "configuration"],
    icon: Settings,
  })

  results.push({
    id: "page:/settings/profile",
    type: "page",
    title: "Profile",
    subtitle: "Personal account details",
    section: "Account",
    breadcrumb: "Account › Profile",
    href: "/settings/profile",
    keywords: ["account", "profile", "user", "personal"],
    icon: UserCircle,
  })

  for (const tab of settingsTabs) {
    results.push({
      id: `section:settings:${tab.value}`,
      type: "section",
      title: tab.label,
      subtitle: tab.description,
      section: "Account",
      breadcrumb: `Account › Settings › ${tab.label}`,
      href: `/settings?tab=${tab.value}`,
      keywords: ["settings", "account", tab.label, tab.description, tab.value],
      icon: tab.icon,
    })
  }

  for (const trace of traces) {
    results.push({
      id: `trace:${trace.id}`,
      type: "trace",
      title: trace.id,
      subtitle: `${trace.operation} · ${trace.agent}`,
      section: "Traces",
      breadcrumb: `Traces › ${trace.id}`,
      href: `/observability?trace=${trace.id}`,
      keywords: [
        trace.id,
        trace.operation,
        trace.agent,
        trace.agentId,
        trace.team,
        trace.status,
        "trace",
        "ticket",
      ],
      icon: Activity,
    })
  }

  return results
}

export const searchIndex = buildSearchIndex()

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

function scoreResult(result: SearchResult, query: string): number {
  const normalizedTitle = result.title.toLowerCase()
  const normalizedBreadcrumb = result.breadcrumb.toLowerCase()
  const normalizedKeywords = result.keywords.map((k) => k.toLowerCase())

  if (normalizedTitle === query) return 100
  if (normalizedTitle.startsWith(query)) return 90
  if (result.type === "trace" && normalizedTitle.includes(query)) return 85
  if (normalizedBreadcrumb.includes(query)) return 70
  if (normalizedKeywords.some((k) => k.startsWith(query))) return 60
  if (normalizedKeywords.some((k) => k.includes(query))) return 40
  if (normalizedTitle.includes(query)) return 30
  if (result.subtitle?.toLowerCase().includes(query)) return 20
  return 0
}

export function searchGlobal(query: string, limit = 12): SearchResult[] {
  const normalized = normalizeQuery(query)

  if (!normalized) {
    return searchIndex
  }

  return searchIndex
    .map((result) => ({ result, score: scoreResult(result, normalized) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .slice(0, limit)
    .map(({ result }) => result)
}

export function groupSearchResults(results: SearchResult[]): { section: string; items: SearchResult[] }[] {
  const groups = new Map<string, SearchResult[]>()

  for (const result of results) {
    const existing = groups.get(result.section)
    if (existing) {
      existing.push(result)
    } else {
      groups.set(result.section, [result])
    }
  }

  return Array.from(groups.entries()).map(([section, items]) => ({ section, items }))
}

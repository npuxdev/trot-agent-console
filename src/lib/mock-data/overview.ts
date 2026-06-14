import type { Alert, TopAgent } from "@/lib/types"

import { traces } from "./traces"

export const alerts: Alert[] = [
  {
    alert: "High A2A latency on CRM lookup",
    agent: "Fraud Review Agent",
    agentId: "fraud-review",
    status: "degraded",
  },
  {
    alert: "MCP timeout threshold exceeded",
    agent: "Claims Resolution Agent",
    agentId: "claims-resolution",
    status: "warning",
  },
  {
    alert: "Policy cache miss rate elevated",
    agent: "Policy Lookup Agent",
    agentId: "policy-lookup",
    status: "warning",
  },
  {
    alert: "Refund workflow completed",
    agent: "Refund Agent",
    agentId: "refund",
    status: "success",
  },
]

export const topAgents: TopAgent[] = [
  { name: "Claims Resolution Agent", agentId: "claims-resolution", team: "Customer Ops", volume: "1.1M req/hr" },
  { name: "Fraud Review Agent", agentId: "fraud-review", team: "Risk", volume: "842K req/hr" },
  { name: "Policy Lookup Agent", agentId: "policy-lookup", team: "Underwriting", volume: "615K req/hr" },
  { name: "Refund Agent", agentId: "refund", team: "Customer Ops", volume: "488K req/hr" },
  { name: "Triage Agent", agentId: "triage", team: "Support", volume: "312K req/hr" },
]

export const recentTraces = traces

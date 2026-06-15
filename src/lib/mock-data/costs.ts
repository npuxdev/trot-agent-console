import type { CostByAgent, CostByModel, HighCostTrace } from "@/lib/types"

export const costSummary = {
  totalSpend: 12680,
  totalTokens: "54.6M",
  avgCostPerTrace: "$0.038",
  period: "Last 24h",
}

export const costByAgent: CostByAgent[] = [
  { agentId: "claims-resolution", agentName: "Claims Resolution Agent", team: "Customer Ops", spend: 4200, tokens: "18.4M" },
  { agentId: "fraud-review", agentName: "Fraud Review Agent", team: "Risk", spend: 3100, tokens: "12.1M" },
  { agentId: "policy-lookup", agentName: "Policy Lookup Agent", team: "Underwriting", spend: 2200, tokens: "8.6M" },
  { agentId: "refund", agentName: "Refund Agent", team: "Customer Ops", spend: 1800, tokens: "5.2M" },
  { agentId: "triage", agentName: "Triage Agent", team: "Support", spend: 1100, tokens: "3.9M" },
]

export const costByModel: CostByModel[] = [
  { model: "gpt-4.1", spend: 6200, tokens: "24.2M", requests: "380K" },
  { model: "gpt-4.1-mini", spend: 2600, tokens: "12.4M", requests: "980K" },
  { model: "deepseek-v4", spend: 2100, tokens: "8.4M", requests: "520K" },
  { model: "text-embedding-3", spend: 1400, tokens: "4.0M", requests: "890K" },
  { model: "gemma-3-4b", spend: 380, tokens: "5.6M", requests: "2.4M" },
]

export const highCostTraces: HighCostTrace[] = [
  {
    traceId: "TRC-7419-A",
    operation: "Customer Process Request",
    agent: "Claims Resolution Agent",
    cost: "$0.18",
    reason: "Model retry overhead (2 attempts)",
  },
  {
    traceId: "TRC-7417-B",
    operation: "Fraud A2A Review",
    agent: "Fraud Review Agent",
    cost: "$0.09",
    reason: "Extended A2A session with CRM dependency",
  },
  {
    traceId: "TRC-7415-A",
    operation: "Customer Profile",
    agent: "Claims Resolution Agent",
    cost: "$0.04",
    reason: "Standard profile retrieval",
  },
]

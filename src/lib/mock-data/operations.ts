import type { OperationsSummary } from "@/lib/types"

export const operationsSummary: OperationsSummary = {
  activeAgents: 248,
  totalAgents: 262,
  governanceScore: 87,
  budgetUtilization: 12400,
  budgetLimit: 18000,
  pendingApprovals: 7,
  openViolations: 5,
  a2aHandoffsToday: "2.4M",
  avgConfidenceScore: 0.91,
}

export const workforceScenarios = [
  {
    id: "onboard",
    phase: "Onboard",
    title: "Deploy Claims Resolution v4.8.2",
    description:
      "Platform Admin Dana Okafor approved agent deployment with scoped MCP access and model routing policy. Tool permissions limited to CRM Search, Policy Cache, and Customer Profile.",
    actor: "Dana Okafor",
    time: "Jun 12, 09:14",
    status: "completed" as const,
    link: "/agents",
  },
  {
    id: "govern",
    phase: "Govern",
    title: "MCP Timeout policy blocks runaway CRM calls",
    description:
      "When CRM Search exceeded 2.0s on TRC-7419-A, the timeout policy triggered a retry with backoff. Model retry limit policy escalated to human review after second failure.",
    actor: "System (automated)",
    time: "Jun 14, 09:41",
    status: "active" as const,
    link: "/approvals",
  },
  {
    id: "investigate",
    phase: "Investigate",
    title: "Trace TRC-7419-A reveals blast radius",
    description:
      "Operators traced failure propagation from Salesforce API → CRM Search MCP → Claims Resolution → Fraud Review A2A chain. 847 downstream traces affected in 12 minutes.",
    actor: "Risk Team",
    time: "Jun 14, 09:45",
    status: "active" as const,
    link: "/topology?incident=TRC-7419-A",
  },
  {
    id: "audit",
    phase: "Audit",
    title: "Policy change review for A2A latency SLO",
    description:
      "Risk team proposes tightening A2A latency SLO from 1.5s to 1.2s p95. Impact analysis shows 23% increase in escalation volume but 40% reduction in cascading failures.",
    actor: "Marcus Chen",
    time: "Jun 14, 10:02",
    status: "pending" as const,
    link: "/audit?policy=a2a-latency-slo",
  },
  {
    id: "optimize",
    phase: "Optimize",
    title: "Route triage to gpt-4.1-mini for cost efficiency",
    description:
      "Model routing policy updated to prefer gpt-4.1-mini for classification tasks under 500 tokens. Projected savings: $1,200/day with no confidence score degradation.",
    actor: "FinOps Team",
    time: "Jun 13, 16:30",
    status: "completed" as const,
    link: "/costs",
  },
]

export const pendingApprovals = [
  {
    id: "apr-001",
    type: "Low-confidence action",
    agent: "Claims Resolution Agent",
    action: "Auto-resolve claim CLM-88421 ($12,400)",
    confidence: 0.62,
    threshold: 0.85,
    requestedAt: "4 min ago",
    traceId: "TRC-7419-A",
  },
  {
    id: "apr-002",
    type: "Sensitive data access",
    agent: "Fraud Review Agent",
    action: "Query full SSN for customer CUS-99201",
    confidence: 0.78,
    threshold: 0.90,
    requestedAt: "8 min ago",
    traceId: "TRC-7417-B",
  },
  {
    id: "apr-003",
    type: "Budget threshold",
    agent: "Claims Resolution Agent",
    action: "Continue multi-step reasoning (est. $0.24 additional)",
    confidence: 0.88,
    threshold: 0.85,
    requestedAt: "12 min ago",
    traceId: "TRC-7419-A",
  },
  {
    id: "apr-004",
    type: "Unauthorized tool",
    agent: "Policy Lookup Agent",
    action: "Invoke crm-search (not in allowlist)",
    confidence: 0.95,
    threshold: 1.0,
    requestedAt: "18 min ago",
  },
  {
    id: "apr-005",
    type: "Recursive loop detected",
    agent: "Triage Agent",
    action: "A2A handoff to Claims → Triage (3rd iteration)",
    confidence: 0.71,
    threshold: 0.80,
    requestedAt: "22 min ago",
  },
]

import type { Policy } from "@/lib/types"

export const policies: Policy[] = [
  {
    id: "mcp-timeout",
    name: "MCP Timeout Threshold",
    scope: "All MCP calls",
    type: "Latency",
    threshold: "2.0s max",
    status: "warning",
    boundAgentIds: ["claims-resolution", "fraud-review", "policy-lookup", "triage"],
    violations: [
      {
        id: "viol-001",
        policyId: "mcp-timeout",
        agentId: "claims-resolution",
        agentName: "Claims Resolution Agent",
        message: "CRM Search exceeded 2.0s timeout on TRC-7419-A",
        time: "2 min ago",
        traceId: "TRC-7419-A",
      },
    ],
  },
  {
    id: "a2a-latency-slo",
    name: "A2A Latency SLO",
    scope: "Fraud Review Agent",
    type: "Latency",
    threshold: "1.5s p95",
    status: "degraded",
    boundAgentIds: ["fraud-review"],
    violations: [
      {
        id: "viol-002",
        policyId: "a2a-latency-slo",
        agentId: "fraud-review",
        agentName: "Fraud Review Agent",
        message: "A2A review latency breached due to degraded CRM lookup",
        time: "3 min ago",
        traceId: "TRC-7419-A",
      },
    ],
  },
  {
    id: "model-retry-limit",
    name: "Model Retry Limit",
    scope: "Claims Resolution Agent",
    type: "Retry",
    threshold: "Max 2 retries",
    status: "warning",
    boundAgentIds: ["claims-resolution"],
    violations: [
      {
        id: "viol-003",
        policyId: "model-retry-limit",
        agentId: "claims-resolution",
        agentName: "Claims Resolution Agent",
        message: "Model retry limit reached (2 attempts) on TRC-7419-A",
        time: "2 min ago",
        traceId: "TRC-7419-A",
      },
    ],
  },
  {
    id: "refund-approval-gate",
    name: "Refund Approval Gate",
    scope: "Refund Agent",
    type: "Authorization",
    threshold: "Dual approval required",
    status: "success",
    boundAgentIds: ["refund"],
    violations: [],
  },
]

export function getPolicyById(id: string): Policy | undefined {
  return policies.find((p) => p.id === id)
}

export const allViolations = policies.flatMap((p) => p.violations)

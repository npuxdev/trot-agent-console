import type { McpServer } from "@/lib/types"

export const mcpServers: McpServer[] = [
  {
    id: "crm-search",
    name: "CRM Search",
    status: "degraded",
    version: "v2.4.1",
    endpoint: "mcp://crm-search.prod.internal:8443",
    latencyP95: "2.84s",
    timeoutThreshold: "2.0s",
    connectedAgentIds: ["claims-resolution", "fraud-review"],
    lastIncidentTraceId: "TRC-7419-A",
    description: "Customer relationship management search and lookup service.",
  },
  {
    id: "policy-cache",
    name: "Policy Cache",
    status: "warning",
    version: "v1.8.0",
    endpoint: "mcp://policy-cache.prod.internal:8443",
    latencyP95: "0.52s",
    timeoutThreshold: "1.0s",
    connectedAgentIds: ["claims-resolution", "fraud-review", "policy-lookup"],
    description: "Cached policy document retrieval with elevated miss rate.",
  },
  {
    id: "refund-gateway",
    name: "Refund Gateway",
    status: "success",
    version: "v1.2.3",
    endpoint: "mcp://refund-gateway.prod.internal:8443",
    latencyP95: "0.18s",
    timeoutThreshold: "1.5s",
    connectedAgentIds: ["refund"],
    description: "Payment refund processing and approval gateway.",
  },
  {
    id: "customer-profile",
    name: "Customer Profile",
    status: "success",
    version: "v3.0.1",
    endpoint: "mcp://customer-profile.prod.internal:8443",
    latencyP95: "0.31s",
    timeoutThreshold: "1.0s",
    connectedAgentIds: ["claims-resolution", "triage"],
    description: "Customer profile and identity resolution service.",
  },
]

export function getMcpServerById(id: string): McpServer | undefined {
  return mcpServers.find((s) => s.id === id)
}

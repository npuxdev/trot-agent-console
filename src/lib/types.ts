export type Status = "success" | "warning" | "degraded"

export type AgentStatus = "healthy" | "warning" | "degraded"

export type Agent = {
  id: string
  name: string
  team: string
  status: AgentStatus
  version: string
  environment: string
  errorRate: string
  avgLatency: string
  volume: string
  mcpServerIds: string[]
  policyIds: string[]
  lastTraceId: string
}

export type Trace = {
  id: string
  operation: string
  agent: string
  agentId: string
  duration: string
  durationMs: number
  status: Status
  time: string
  highlighted?: boolean
  team: string
  environment: string
  version: string
  description: string
  degradedMs?: number
  degradedPct?: number
  hasSpanDetail: boolean
  defaultSpanId?: string
}

export type SpanColor = "green" | "orange" | "red" | "none"

export type NestedBar = {
  label: string
  startMs: number
  durationMs: number
  color: "red" | "green"
}

export type TraceSpan = {
  id: string
  label: string
  depth: number
  startMs: number
  durationMs: number
  color: SpanColor
  highlighted?: boolean
  icon?: "warning" | "retry"
  barLabel?: string
  nestedBars?: NestedBar[]
  details?: {
    spanId: string
    startTime: string
    endTime: string
    duration: string
    logs?: string[]
    tags?: string[]
  }
}

export type Alert = {
  alert: string
  agent: string
  agentId: string
  status: Status
}

export type TopAgent = {
  name: string
  agentId: string
  team: string
  volume: string
}

export type McpServer = {
  id: string
  name: string
  status: Status
  version: string
  endpoint: string
  latencyP95: string
  timeoutThreshold: string
  connectedAgentIds: string[]
  lastIncidentTraceId?: string
  description: string
}

export type PolicyViolation = {
  id: string
  policyId: string
  agentId: string
  agentName: string
  message: string
  time: string
  traceId?: string
}

export type Policy = {
  id: string
  name: string
  scope: string
  type: string
  threshold: string
  status: Status
  boundAgentIds: string[]
  violations: PolicyViolation[]
}

export type CostByAgent = {
  agentId: string
  agentName: string
  team: string
  spend: number
  tokens: string
}

export type CostByModel = {
  model: string
  spend: number
  tokens: string
  requests: string
}

export type HighCostTrace = {
  traceId: string
  operation: string
  agent: string
  cost: string
  reason: string
}

export type AuditOutcome = "success" | "warning" | "failure"

export type AuditEvent = {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  agentId: string
  agentName: string
  outcome: AuditOutcome
  relatedTraceId?: string
  relatedPolicyId?: string
}

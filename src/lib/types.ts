export type Status = "success" | "warning" | "degraded"

export type AgentStatus = "healthy" | "warning" | "degraded"

export type AgentAutonomy = "Autonomous" | "Supervised" | "Manual"

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
  owner: string
  model: string
  autonomy: AgentAutonomy
  lastDeployed: string
  costPerExecution: string
  escalationPath: string
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
  cost?: string
  baselineMs?: number
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
  baselineMs?: number
  details?: {
    spanId: string
    startTime: string
    endTime: string
    duration: string
    cost?: string
    baselineDelta?: string
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
  authMethod: string
  toolCount: number
  scopes: string[]
  schemaVersion: string
  lastSync: string
  costPerCall: string
}

export type PolicyCategory =
  | "tool-access"
  | "model-routing"
  | "data-classification"
  | "spending"
  | "escalation"
  | "approval"
  | "latency"
  | "retry"

export type PolicyEnforcement = "block" | "warn" | "require-approval" | "audit-only"

export type PolicyViolation = {
  id: string
  policyId: string
  agentId: string
  agentName: string
  message: string
  time: string
  traceId?: string
  severity?: "critical" | "high" | "medium" | "low"
  violationType?:
    | "unauthorized-tool"
    | "token-overrun"
    | "sensitive-data"
    | "recursive-loop"
    | "low-confidence"
    | "latency-breach"
    | "retry-exceeded"
}

export type Policy = {
  id: string
  name: string
  scope: string
  type: string
  category: PolicyCategory
  threshold: string
  status: Status
  boundAgentIds: string[]
  violations: PolicyViolation[]
  enforcement: PolicyEnforcement
  owner: string
  lastModified: string
  description?: string
  affectedMcpIds?: string[]
  affectedModelIds?: string[]
}

export type PolicySimulationResult = {
  policyId: string
  policyName: string
  agentsAffected: number
  tracesBlocked: number
  estimatedCostImpact: string
  approvalQueueIncrease: string
  riskReduction: string
}

export type TopologyNodeType =
  | "agent"
  | "mcp"
  | "model"
  | "api"
  | "database"
  | "external"

export type TopologyNode = {
  id: string
  label: string
  type: TopologyNodeType
  x: number
  y: number
  status: Status | AgentStatus
  trustZone: "production" | "restricted" | "external"
  metrics?: {
    volume?: string
    latency?: string
    cost?: string
    errorRate?: string
  }
  subtitle?: string
}

export type TopologyEdgeKind =
  | "tool-call"
  | "a2a"
  | "model-inference"
  | "data-access"
  | "api-call"
  | "governed-by"

export type TopologyEdge = {
  id: string
  source: string
  target: string
  kind: TopologyEdgeKind
  volume?: string
  latency?: string
  cost?: string
  status: Status
  incidentPath?: boolean
  label?: string
}

export type TopologyTrustBoundary = {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  level: "production" | "restricted" | "external"
}

export type OperationsSummary = {
  activeAgents: number
  totalAgents: number
  governanceScore: number
  budgetUtilization: number
  budgetLimit: number
  pendingApprovals: number
  openViolations: number
  a2aHandoffsToday: string
  avgConfidenceScore: number
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

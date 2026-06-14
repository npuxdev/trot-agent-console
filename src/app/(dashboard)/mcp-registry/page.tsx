import { PageHeader } from "@/components/page-header"
import { McpSummaryCards } from "@/components/mcp-registry/mcp-summary-cards"
import { McpAgentsTable, McpServersGrid } from "@/components/mcp-registry/mcp-server-card"

export default function McpRegistryPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="MCP Registry" />
      <McpSummaryCards />
      <McpServersGrid />
      <McpAgentsTable />
    </div>
  )
}

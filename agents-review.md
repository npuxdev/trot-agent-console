# Technical walkthrough

This note describes the TROT agent console as it exists in the repository. It is a Next.js frontend. Data is imported from TypeScript modules under `src/lib/mock-data/`. There are no route handlers, server actions, database clients, or authentication.

Commit history, oldest first:

| Commit | Date | What landed |
| --- | --- | --- |
| [`36632dd`](https://github.com/npuxdev/trot-agent-console/commit/36632dd) | 2026-06-14 | Create Next App scaffold |
| [`c11ba8c`](https://github.com/npuxdev/trot-agent-console/commit/c11ba8c) | 2026-06-14 | Observability dashboard: agents, MCP registry, policies, audit, costs, settings, paper-toned UI |
| [`7db919b`](https://github.com/npuxdev/trot-agent-console/commit/7db919b) | 2026-06-14 | TROT branding, operations center, topology, governance workspace |
| [`aa8751d`](https://github.com/npuxdev/trot-agent-console/commit/aa8751d) | 2026-06-14 | Approvals route, fleet context, global search, status banner, environment and time controls |
| [`6d865f4`](https://github.com/npuxdev/trot-agent-console/commit/6d865f4) | 2026-06-14 | Incident replay, agent lifecycle, policy simulation history, UI polish |
| [`71d97b4`](https://github.com/npuxdev/trot-agent-console/commit/71d97b4) | 2026-06-14 | Page headers sit flush under the status banner (`src/components/dashboard-main.tsx`) |

`Explaination.md` is an earlier product write-up of the same scenario. The filename is spelled that way in the tree.

## Layout

[`src/app/layout.tsx`](src/app/layout.tsx) sets the document title and loads Geist Sans and Geist Mono. [`src/app/(dashboard)/layout.tsx`](src/app/(dashboard)/layout.tsx) wraps every page in `DateRangeProvider`, a fixed sidebar, and `DashboardMain`.

[`src/components/dashboard-main.tsx`](src/components/dashboard-main.tsx) renders the status banner and, while `isLoading` is true, a full-main overlay that disables pointer events. [`src/components/shared/date-range-context.tsx`](src/components/shared/date-range-context.tsx) sets that flag for 1500ms when the environment or time range changes. The selected values are local React state in [`src/components/shared/environment-time-control.tsx`](src/components/shared/environment-time-control.tsx). They are not passed into the mock-data selectors.

[`src/components/shared/global-status-indicator.tsx`](src/components/shared/global-status-indicator.tsx) links to `/topology/replay?incident=…` when `getSystemStatus()` returns a primary trace id, otherwise to `/topology`. [`src/lib/system-status.ts`](src/lib/system-status.ts) marks the system degraded when any MCP server is degraded or has `lastIncidentTraceId`, or when any agent status is `degraded`. With the current fixtures that is one incident server (CRM Search) and two impacted agents (Claims Resolution and Fraud Review, via the server’s `connectedAgentIds` plus the degraded agent record). The `critical` style exists and is not returned by the current function.

Sidebar items, descriptions, and badges come from [`src/lib/navigation.ts`](src/lib/navigation.ts). Badges are computed at module load from the fixtures: agent count, degraded MCP count, violation count, pending approvals, audit events today, trace count, and total spend.

## Data model

Shared types live in [`src/lib/types.ts`](src/lib/types.ts). [`src/lib/mock-data/index.ts`](src/lib/mock-data/index.ts) re-exports the fixtures.

The named records and the headline numbers are different datasets:

- [`src/lib/mock-data/agents.ts`](src/lib/mock-data/agents.ts) defines five agents. The sidebar badge uses `agents.length`.
- [`src/lib/mock-data/operations.ts`](src/lib/mock-data/operations.ts) sets `activeAgents: 248` and `totalAgents: 262` for the operations posture cards. `openViolations: 5` on that object is not read by the UI. The governance-score subtitle uses `allViolations.length` from [`src/lib/mock-data/policies.ts`](src/lib/mock-data/policies.ts), which is 8.

The incident thread used across pages is trace `TRC-7419-A`: CRM Search exceeds a 2.0s timeout, Claims Resolution retries, and the failure is shown propagating to Fraud Review.

People, contact details, and credentials in the fixtures are placeholders. [`src/lib/mock-data/user.ts`](src/lib/mock-data/user.ts) and the settings members list use `@nest.io` addresses. [`src/lib/mock-data/contacts.ts`](src/lib/mock-data/contacts.ts) uses `555` phone numbers and synthetic Slack team/user ids, and builds `https://slack.com/app_redirect` links from them. MCP endpoints use a `mcp://…prod.internal` scheme. The settings API-key panel hardcodes masked strings (`nest_live_••••8f2a`, `nest_ci_••••11d7`) in [`src/components/settings/settings-workspace.tsx`](src/components/settings/settings-workspace.tsx).

## Routes and behavior

Route files under `src/app/(dashboard)/` are thin. Each one renders a `PageHeader` and a workspace component. `next build` prerenders all of them as static pages.

### Operations Center — `/`

[`src/app/(dashboard)/page.tsx`](src/app/(dashboard)/page.tsx) composes posture cards, the workforce section, alerts, and recent traces.

[`src/components/overview/overview-workforce-section.tsx`](src/components/overview/overview-workforce-section.tsx) reads `workforceScenarios` and can hide the narrative. Dismissal writes `nest:workforce-narrative-dismissed` to `localStorage` and is restored in an effect on mount. Quick actions and the approval preview are in [`src/components/overview/operations-center.tsx`](src/components/overview/operations-center.tsx). Alert rows open the agent detail sheet. Recent traces link into Observability.

### Agent Topology — `/topology`

[`src/components/topology/topology-graph.tsx`](src/components/topology/topology-graph.tsx) draws an SVG. Node positions, zone rectangles, and edges are constants in [`src/lib/mock-data/topology.ts`](src/lib/mock-data/topology.ts) (`topologyLayout` is 960×760, nodes are 128×44). Edges are anchored to the side of a node closest to its peer. Hover and selection are component state. The incident banner links to replay and to the trace. There is no physics simulation or pan/zoom.

### Agents — `/agents`

[`src/components/agents/agents-table.tsx`](src/components/agents/agents-table.tsx) filters the five agents and opens [`src/components/agents/agent-detail-sheet.tsx`](src/components/agents/agent-detail-sheet.tsx). The sheet links to `/agents/lifecycle?agent=` and `/topology/replay?incident=`. Those query parameters are not read by the destination pages.

### MCP Registry — `/mcp-registry`

Server cards and the agents-by-server table live in [`src/components/mcp-registry/mcp-server-card.tsx`](src/components/mcp-registry/mcp-server-card.tsx). Selection opens [`src/components/mcp-registry/mcp-server-detail-sheet.tsx`](src/components/mcp-registry/mcp-server-detail-sheet.tsx).

### Policies — `/policies`

[`src/components/policies/policies-table.tsx`](src/components/policies/policies-table.tsx) lists policies and violations and links each policy to `/policies/history?policy=`. The history page ignores that parameter and always renders `a2aLatencySloHistory`.

### Approvals — `/approvals`

[`src/components/governance/governance-workspace.tsx`](src/components/governance/governance-workspace.tsx) renders the queue, a simulation picker (`selectedSim` state), violations, categories, and active policies. The Approve and Deny buttons have no click handlers. “View simulation history” links to the policy history route.

### Audit — `/audit`

[`src/components/audit/audit-log-table.tsx`](src/components/audit/audit-log-table.tsx) paginates events and filters when `?policy=` is present. Row selection opens [`src/components/audit/audit-event-detail-sheet.tsx`](src/components/audit/audit-event-detail-sheet.tsx), which can link to replay.

### Observability — `/observability`

[`src/components/observability/observability-workspace.tsx`](src/components/observability/observability-workspace.tsx) reads `?trace=` and falls back to `DEFAULT_TRACE_ID` in [`src/lib/mock-data/traces.ts`](src/lib/mock-data/traces.ts). Spans for a trace come from `getSpansForTrace`. Degraded traces open with the waterfall expanded. [`src/components/observability/trace-waterfall.tsx`](src/components/observability/trace-waterfall.tsx) positions bars from each span’s `startMs` and `durationMs` against the trace’s `durationMs`. Selecting a span shows logs, tags, cost, and baseline delta when the fixture includes them.

### Costs — `/costs`

Spend bars are width percentages in [`src/components/costs/spend-by-agent-chart.tsx`](src/components/costs/spend-by-agent-chart.tsx) and [`src/components/costs/spend-by-model-table.tsx`](src/components/costs/spend-by-model-table.tsx). Both have a chart/table toggle. `?agent=` selects an agent in the spend-by-agent view. High-cost rows open [`src/components/costs/cost-detail-sheet.tsx`](src/components/costs/cost-detail-sheet.tsx).

### Settings

[`src/components/settings/settings-workspace.tsx`](src/components/settings/settings-workspace.tsx) is a vertical Base UI tabs layout. `?tab=` sets the default tab when it matches a known value. Toggles and the API-key actions do not persist. [`src/app/(dashboard)/settings/profile/page.tsx`](src/app/(dashboard)/settings/profile/page.tsx) renders the profile panel on its own route. The account menu in [`src/components/sidebar-account.tsx`](src/components/sidebar-account.tsx) is how settings is reached. Settings is not in `navSections`.

### Incident replay — `/topology/replay`

[`src/components/incident-replay/replay-workspace.tsx`](src/components/incident-replay/replay-workspace.tsx) keeps `currentIndex` and `isPlaying`. Play advances with `setInterval` over `replayTimeline` in [`src/lib/mock-data/incident-replay.ts`](src/lib/mock-data/incident-replay.ts). The current event drives [`src/components/incident-replay/replay-topology.tsx`](src/components/incident-replay/replay-topology.tsx) (highlighted nodes and edges) and [`src/components/incident-replay/event-inspector.tsx`](src/components/incident-replay/event-inspector.tsx). `?incident=` is not read. The page always plays the same timeline.

### Agent lifecycle — `/agents/lifecycle`

[`src/components/agent-lifecycle/lifecycle-workspace.tsx`](src/components/agent-lifecycle/lifecycle-workspace.tsx) always uses `claimsAgentLifecycle` from [`src/lib/mock-data/agent-lifecycle.ts`](src/lib/mock-data/agent-lifecycle.ts). Stage selection is local state, initialized to `lifecycle.currentStage`. The stepper, readiness panel, and events table are presentational.

### Policy history — `/policies/history`

[`src/components/policy-history/policy-history-workspace.tsx`](src/components/policy-history/policy-history-workspace.tsx) always uses `a2aLatencySloHistory` from [`src/lib/mock-data/policy-history.ts`](src/lib/mock-data/policy-history.ts). It resolves `affectedAgentIds` against the agents fixture and composes the impact, diff, simulation comparison, timeline, approval chain, and rollback cards.

## Search

[`src/components/shared/global-search.tsx`](src/components/shared/global-search.tsx) filters a static index built in [`src/lib/global-search.ts`](src/lib/global-search.ts): sidebar pages, the settings page, settings tabs, and trace records. Keyboard handling moves `activeIndex` and navigates with `router.push`. Trace results go to `/observability?trace=`.

## Visual system

[`src/app/globals.css`](src/app/globals.css) defines a stone ramp and status colors (`--nest-green` `#166534`, blue, amber, orange, red). `--radius` is `0`, so controls and cards are square. Shared card and header classes are in [`src/lib/card-styles.ts`](src/lib/card-styles.ts) and [`src/lib/layout-styles.ts`](src/lib/layout-styles.ts). The mark in the sidebar is [`public/trot-logo.png`](public/trot-logo.png), rendered by [`src/components/trot-logo.tsx`](src/components/trot-logo.tsx) with a plain `<img>`.

Detail views use the sheet primitive in [`src/components/ui/sheet.tsx`](src/components/ui/sheet.tsx). Tables that need search and facets use [`src/components/shared/filterable-table.tsx`](src/components/shared/filterable-table.tsx). Pagination state is local in [`src/components/shared/table-pagination.tsx`](src/components/shared/table-pagination.tsx) and resets to page 1 when `items` or `pageSize` changes.

## Checks

`npm run build` (Next.js 16.2.9) compiles, typechecks, and prerenders the 14 application routes. `npm run lint` fails on `react-hooks/set-state-in-effect` in:

- [`src/components/observability/observability-workspace.tsx`](src/components/observability/observability-workspace.tsx)
- [`src/components/overview/overview-workforce-section.tsx`](src/components/overview/overview-workforce-section.tsx)
- [`src/components/shared/global-search.tsx`](src/components/shared/global-search.tsx)
- [`src/components/shared/table-pagination.tsx`](src/components/shared/table-pagination.tsx)

Lint also warns on unused imports in `readiness-panel.tsx`, `governance-workspace.tsx`, and `simulation-comparison.tsx`, and on the logo `<img>`. There is no automated test script.

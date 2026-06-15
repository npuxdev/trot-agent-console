import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass, tableHeadClass, tableRowClass } from "@/lib/card-styles"
import type { LifecycleEvent } from "@/lib/types"

type LifecycleEventsTableProps = {
  events: LifecycleEvent[]
}

const stageLabels: Record<string, string> = {
  design: "Design",
  simulate: "Simulate",
  deploy: "Deploy",
  observe: "Observe",
  govern: "Govern",
  improve: "Improve",
  retire: "Retire",
}

export function LifecycleEventsTable({ events }: LifecycleEventsTableProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className={tableHeadClass}>
                <th className="px-4 py-2.5 font-medium">Timestamp</th>
                <th className="px-4 py-2.5 font-medium">Stage</th>
                <th className="px-4 py-2.5 font-medium">Event</th>
                <th className="px-4 py-2.5 font-medium">Actor</th>
                <th className="px-4 py-2.5 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className={tableRowClass}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {event.timestamp}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex h-5 items-center bg-muted/60 px-1.5 text-[10px] font-medium uppercase">
                      {stageLabels[event.stage] ?? event.stage}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium">{event.eventType}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {event.actor}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {event.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

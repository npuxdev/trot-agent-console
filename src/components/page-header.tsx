import { EnvironmentTimeControl } from "@/components/shared/environment-time-control"
import { GlobalSearch } from "@/components/shared/global-search"

type PageHeaderProps = {
  title: string
  showControls?: boolean
}

export function PageHeader({ title, showControls = true }: PageHeaderProps) {
  return (
    <header
      className={
        showControls
          ? "flex items-center justify-between gap-3 pb-3"
          : "flex items-center gap-3 pb-3"
      }
    >
      <h1 className="shrink-0 text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {showControls ? (
        <div className="flex shrink-0 items-center justify-end gap-2">
          <GlobalSearch />
          <EnvironmentTimeControl />
        </div>
      ) : null}
    </header>
  )
}

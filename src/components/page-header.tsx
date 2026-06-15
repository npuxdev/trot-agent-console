import { EnvironmentTimeControl } from "@/components/shared/environment-time-control"
import { GlobalSearch } from "@/components/shared/global-search"
import { pageHeaderClass } from "@/lib/layout-styles"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  showControls?: boolean
  children?: React.ReactNode
}

export function PageHeader({ title, showControls = true, children }: PageHeaderProps) {
  return (
    <header className={cn(pageHeaderClass)}>
      <div
        className={
          showControls
            ? "flex items-center justify-between gap-3"
            : "flex items-center gap-3"
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
      </div>
      {children}
    </header>
  )
}

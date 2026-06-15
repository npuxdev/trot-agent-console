import { DateRangeController } from "@/components/shared/date-range-controller"
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
          ? "grid grid-cols-[1fr_auto_1fr] items-center gap-3 pb-3"
          : "flex items-center gap-3 pb-3"
      }
    >
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {showControls ? (
        <>
          <GlobalSearch />
          <div className="flex items-center justify-end gap-2">
            <DateRangeController />
          </div>
        </>
      ) : null}
    </header>
  )
}

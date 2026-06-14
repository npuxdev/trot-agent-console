import { CalendarDays, ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PageHeaderProps = {
  title: string
  showControls?: boolean
}

export function PageHeader({ title, showControls = true }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 pb-3">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {showControls && (
        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="h-9 border-border bg-white pl-9 shadow-none"
            />
          </div>
          <Button
            variant="outline"
            className="h-9 gap-2 border-nest-green/20 bg-nest-green-light text-[#166534] hover:bg-nest-green-light/80"
          >
            <CalendarDays className="size-4" />
            Date range
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </div>
      )}
    </header>
  )
}

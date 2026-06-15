import { AppSidebar } from "@/components/app-sidebar"
import { DashboardMain } from "@/components/dashboard-main"
import { DateRangeProvider } from "@/components/shared/date-range-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DateRangeProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </DateRangeProvider>
  )
}

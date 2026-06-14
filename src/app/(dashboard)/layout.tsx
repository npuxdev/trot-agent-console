import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto px-5 py-4">{children}</main>
    </div>
  )
}

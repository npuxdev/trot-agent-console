import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ProfilePanel } from "@/components/settings/profile-panel"

export default function ProfilePage() {
  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/settings" className="hover:text-foreground">
          Settings
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Profile</span>
      </nav>
      <PageHeader title="Profile" showControls={false} />
      <ProfilePanel />
    </div>
  )
}

import { Mail, MapPin, Shield, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { overviewCardClass } from "@/lib/card-styles"
import { currentUser } from "@/lib/mock-data/user"

function Field({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input defaultValue={value} className="h-9 bg-background" />
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function ProfilePanel() {
  const meta = [
    { icon: Mail, label: "Email", value: currentUser.email },
    { icon: Shield, label: "Role", value: currentUser.role },
    { icon: Users, label: "Team", value: currentUser.team },
    { icon: MapPin, label: "Timezone", value: currentUser.timezone },
  ]

  return (
    <div className="space-y-4">
      <Card className={overviewCardClass}>
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <span className="flex size-16 shrink-0 items-center justify-center bg-nest-green text-xl font-semibold text-white">
            {currentUser.initials}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold tracking-tight">
              {currentUser.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentUser.role} · {currentUser.team}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Member since {currentUser.joined}
            </p>
          </div>
          <Button variant="outline" size="sm">
            Change avatar
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={overviewCardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Personal details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Full name" value={currentUser.name} />
            <Field
              label="Email address"
              value={currentUser.email}
              hint="Used for sign-in and critical alerts."
            />
            <Field label="Timezone" value={currentUser.timezone} />
            <div className="flex gap-2 pt-1">
              <Button size="sm">Save changes</Button>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={overviewCardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y divide-border/60">
              {meta.map((row) => {
                const Icon = row.icon
                return (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center bg-muted/60 text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="truncate text-sm font-medium">
                        {row.value}
                      </dd>
                    </div>
                  </div>
                )
              })}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

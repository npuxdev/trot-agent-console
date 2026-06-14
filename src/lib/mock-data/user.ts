export type CurrentUser = {
  name: string
  email: string
  role: string
  team: string
  initials: string
  timezone: string
  joined: string
}

export const currentUser: CurrentUser = {
  name: "Dana Okafor",
  email: "dana.okafor@nest.io",
  role: "Platform Admin",
  team: "Reliability Engineering",
  initials: "DO",
  timezone: "America/Los_Angeles (PT)",
  joined: "Mar 2024",
}

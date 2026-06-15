export type OnCallContact = {
  name: string
  slackTeamId: string
  slackUserId: string
  phone: string
}

export const onCallContacts: Record<string, OnCallContact> = {
  "Dana Okafor": {
    name: "Dana Okafor",
    slackTeamId: "T08NEST01",
    slackUserId: "U08DANA01",
    phone: "+14155550101",
  },
  "Marcus Chen": {
    name: "Marcus Chen",
    slackTeamId: "T08NEST01",
    slackUserId: "U08MARC01",
    phone: "+14155550234",
  },
  "Priya Nair": {
    name: "Priya Nair",
    slackTeamId: "T08NEST01",
    slackUserId: "U08PRIY01",
    phone: "+14155550367",
  },
}

export function getOnCallContact(name: string): OnCallContact | undefined {
  return onCallContacts[name]
}

export function slackDmUrl(contact: OnCallContact): string {
  return `https://slack.com/app_redirect?team=${contact.slackTeamId}&user=${contact.slackUserId}`
}

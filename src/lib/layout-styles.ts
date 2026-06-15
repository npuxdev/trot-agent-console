/** Fixed 50px operational strip — shrink-0 prevents flex collapse in main layout */
export const statusBannerClass =
  "flex h-[50px] min-h-[50px] shrink-0 w-full items-center gap-2 px-5 text-[13px] leading-none"

/** Page-level incident / alert strips — match global banner height */
export const incidentStripClass =
  "flex h-[50px] min-h-[50px] shrink-0 items-center gap-3 overflow-hidden px-5 text-[13px] leading-none"

/** Secondary filter / context bars aligned to banner height */
export const contextBarClass =
  "flex h-[50px] min-h-[50px] shrink-0 items-center gap-2 px-5 text-sm"

/** Consistent page title bar across all routes */
export const pageHeaderClass =
  "-mx-5 mb-4 flex min-h-[64px] shrink-0 flex-col justify-center border-b border-border bg-stone-header px-5 py-3"

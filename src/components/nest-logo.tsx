import { cn } from "@/lib/utils"

export function NestLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="28" height="28" rx="0" fill="#22C55E" />
        <path
          d="M8 20V8h2.8l4.2 6.2L19 8h3.2l-5.8 8.4L22.4 20H19l-4.6-6.8L9.6 20H8z"
          fill="white"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Nest
      </span>
    </div>
  )
}

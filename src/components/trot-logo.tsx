import { cn } from "@/lib/utils"

export function TrotLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/trot-logo.png"
        alt="TROT"
        className="h-7 w-auto"
        width={88}
        height={28}
      />
    </div>
  )
}

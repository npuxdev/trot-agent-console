import { cn } from "@/lib/utils"

export function TrotLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/trot-logo.png"
        alt="TROT"
        className="h-[1.925rem] w-auto"
        width={97}
        height={31}
      />
    </div>
  )
}

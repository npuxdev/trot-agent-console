import Link from "next/link"
import { ArrowUpRight, ShieldCheck, User } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { overviewCardClass } from "@/lib/card-styles"
import type { ApprovalChain } from "@/lib/types"

type ApprovalChainCardProps = {
  chain: ApprovalChain
}

export function ApprovalChainCard({ chain }: ApprovalChainCardProps) {
  return (
    <Card className={overviewCardClass}>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Approval Chain</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 border border-border/60 px-3 py-2">
            <User className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground uppercase">
                Requested by
              </p>
              <p className="text-sm font-medium">{chain.requestedBy}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border border-border-strong bg-muted px-3 py-2">
            <User className="size-4 shrink-0 text-nest-green" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground uppercase">
                Reviewed by
              </p>
              <p className="text-sm font-medium">{chain.reviewedBy}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Approval type</span>
            <span className="text-right font-medium">{chain.approvalType}</span>
          </div>
          <div>
            <p className="text-muted-foreground">Reason</p>
            <p className="mt-0.5 text-xs leading-relaxed">{chain.reason}</p>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Audit ID</span>
            <span className="font-mono text-xs font-medium">
              {chain.auditId}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Related incident</span>
            <Link
              href={`/topology/replay?incident=${chain.relatedIncident}`}
              className="inline-flex items-center gap-1 font-mono text-xs font-medium text-nest-blue hover:underline"
            >
              {chain.relatedIncident}
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import Link from "next/link"

import { cn } from "@/lib/utils"
import { LANDING_INTERACTIVE } from "@/components/landing/constants"

type PrimaryCtaProps = {
  className?: string
  onClick?: () => void
}

export function PrimaryCta({ className, onClick }: PrimaryCtaProps) {
  return (
    <Link
      href="/getstarted"
      onClick={onClick}
      className={cn(
        "landing-cta-button inline-flex items-center justify-center rounded-lg border px-3 py-2 text-base font-semibold",
        LANDING_INTERACTIVE,
        className,
      )}
    >
      Create your workspace
    </Link>
  )
}

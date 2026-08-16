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
        "landing-cta-button inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-base font-bold",
        LANDING_INTERACTIVE,
        className,
      )}
    >
      Start for free
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  )
}

export function SecondaryCta({ className }: { className?: string }) {
  return (
    <a
      href="#how-it-works"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150",
        className,
      )}
    >
      See how it works
    </a>
  )
}

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
        "inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-base font-semibold text-black",
        LANDING_INTERACTIVE,
        "hover:bg-[#e8e8e8]",
        className,
      )}
    >
      Create your workspace
    </Link>
  )
}

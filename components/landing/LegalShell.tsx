import Link from "next/link"
import type { ReactNode } from "react"

import { DroplertMark } from "@/components/brand/DroplertMark"
import { LANDING_INTERACTIVE } from "@/components/landing/constants"
import { cn } from "@/lib/utils"

type LegalShellProps = {
  title: string
  children: ReactNode
}

export function LegalShell({ title, children }: LegalShellProps) {
  return (
    <div className="landing-page min-h-screen bg-[#030712] text-white">
      <a className="landing-skip" href="#content">
        Skip to content
      </a>
      <header className="px-6 py-8 md:px-8">
        <DroplertMark />
      </header>
      <main id="content" className="mx-auto max-w-[680px] px-6 pb-24 md:px-8">
        <h1 className="text-4xl font-semibold text-balance">{title}</h1>
        <div className="mt-8 space-y-6 text-base text-[#9b9b9b] text-pretty">{children}</div>
        <p className="mt-16">
          <Link
            href="/"
            className={cn(
              "text-white hover:text-[#9b9b9b]",
              LANDING_INTERACTIVE,
            )}
          >
            Back to Droplert
          </Link>
        </p>
      </main>
    </div>
  )
}

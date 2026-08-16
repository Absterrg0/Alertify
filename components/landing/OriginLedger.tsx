import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { HARBOR_ORIGIN } from "@/components/landing/constants"

export type LedgerRoute = {
  path: string
  note?: string
  active?: boolean
}

type OriginLedgerProps = {
  origin?: string
  routes: readonly LedgerRoute[]
  children?: ReactNode
  caption?: string
}

export function OriginLedger({
  origin = HARBOR_ORIGIN,
  routes,
  children,
  caption,
}: OriginLedgerProps) {
  return (
    <figure className="landing-gradient-card">
      <div className="landing-gradient-card__inner rounded-[calc(1rem-1px)] bg-[#161b22] px-6 py-6">
        <p className="font-[var(--font-geist-mono),ui-monospace,monospace] text-sm text-[#8b949e]">
          {origin}
        </p>
        <ul className="mt-6">
          {routes.map((route) => (
            <li
              key={route.path}
              className={cn(
                "flex flex-wrap items-baseline justify-between gap-4 border-t border-white/10 py-4",
                route.active ? "text-violet-300" : "text-white/30",
              )}
            >
              <span className="flex items-center gap-3 font-[var(--font-geist-mono),ui-monospace,monospace] text-base">
                {route.active ? (
                  <i className="block size-2 rounded-full animate-pulse bg-violet-400" aria-hidden="true" />
                ) : (
                  <i className="block size-2 rounded-full border border-white/30" aria-hidden="true" />
                )}
                {route.path}
              </span>
              {route.note ? (
                <span className="text-sm text-[#8b949e] text-pretty">{route.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
        {children}
      </div>
      {caption ? (
        <figcaption className="px-4 py-3 text-xs text-[#8b949e] text-pretty">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

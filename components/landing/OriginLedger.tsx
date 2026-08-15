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
    <figure className="overflow-hidden rounded-2xl bg-[#181818] p-2">
      <div className="rounded-lg bg-[#1f1f1f] px-6 py-6">
        <p className="font-[var(--font-geist-mono),ui-monospace,monospace] text-sm text-[#9b9b9b]">
          {origin}
        </p>
        <ul className="mt-6">
          {routes.map((route) => (
            <li
              key={route.path}
              className={cn(
                "flex flex-wrap items-baseline justify-between gap-4 border-t border-[#313131] py-4",
                route.active ? "text-white" : "text-white/40",
              )}
            >
              <span className="flex items-center gap-3 font-[var(--font-geist-mono),ui-monospace,monospace] text-base">
                {route.active ? (
                  <i className="block size-2 bg-white" aria-hidden="true" />
                ) : (
                  <i className="block size-2 border border-white/30" aria-hidden="true" />
                )}
                {route.path}
              </span>
              {route.note ? (
                <span className="text-sm text-[#9b9b9b] text-pretty">{route.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
        {children}
      </div>
      {caption ? (
        <figcaption className="px-4 py-3 text-xs text-[#9b9b9b] text-pretty">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

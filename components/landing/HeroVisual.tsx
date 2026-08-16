import Image from "next/image"
import { BellIcon } from "@phosphor-icons/react/dist/ssr/Bell"
import { GlobeSimpleIcon } from "@phosphor-icons/react/dist/ssr/GlobeSimple"

export function HeroVisual() {
  return (
    <div className="relative">
      <div className="landing-gradient-card">
        <div className="landing-gradient-card__inner overflow-hidden">
          <div className="overflow-hidden rounded-[calc(1rem-1px)] bg-[#161b22]">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 bg-[#0d1117]">
              <span className="flex gap-1" aria-hidden="true">
                <i className="block size-2 rounded-full bg-[#ff5f57]" />
                <i className="block size-2 rounded-full bg-[#ffbd2e]" />
                <i className="block size-2 rounded-full bg-[#28ca41]" />
              </span>
              <p className="flex min-w-0 items-center gap-2 rounded-lg bg-[#0d1117] px-3 py-1 text-xs text-[#8b949e]">
                <GlobeSimpleIcon aria-hidden="true" size={12} />
                <span className="truncate">ledger.harbor.test/changelog</span>
              </p>
            </div>

            <div className="relative">
              <Image
                src="/landing/harbor-ledger-docs.png"
                alt="Harbor Ledger changelog page with a sparse docs layout"
                width={1536}
                height={1024}
                className="h-auto w-full"
                priority
              />

              <aside
                className="absolute bottom-4 right-4 w-[min(100%-2rem,18rem)] rounded-xl border-t border-r border-b border-l-[3px] border-t-violet-500/30 border-r-violet-500/30 border-b-violet-500/30 border-l-violet-600 bg-[#0d1117] p-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                aria-label="Live product toast"
              >
                <p className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                  <BellIcon aria-hidden="true" size={14} />
                  Product update
                </p>
                <p className="mt-2 text-sm font-semibold text-white text-balance">
                  Version 2.4 is on the changelog
                </p>
                <p className="mt-2 text-sm text-[#8b949e] text-pretty">
                  New export filters for the April close.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#8b949e] text-pretty">
        Site ledger.harbor.test · Route /changelog · Window Now to Fri · Surface Toast
      </p>
    </div>
  )
}

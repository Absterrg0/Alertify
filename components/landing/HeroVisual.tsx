import Image from "next/image"
import { BellIcon } from "@phosphor-icons/react/dist/ssr/Bell"
import { GlobeSimpleIcon } from "@phosphor-icons/react/dist/ssr/GlobeSimple"

export function HeroVisual() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl bg-[#181818] p-2">
        <div className="overflow-hidden rounded-lg bg-[#1f1f1f]">
          <div className="flex items-center gap-3 border-b border-[#313131] px-4 py-3">
            <span className="flex gap-1" aria-hidden="true">
              <i className="block size-2 rounded-full bg-[#313131]" />
              <i className="block size-2 rounded-full bg-[#313131]" />
              <i className="block size-2 rounded-full bg-[#313131]" />
            </span>
            <p className="flex min-w-0 items-center gap-2 rounded-lg bg-[#181818] px-3 py-1 text-xs text-[#9b9b9b]">
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
              className="absolute bottom-4 right-4 w-[min(100%-2rem,18rem)] rounded-xl border border-[#313131] bg-[#181818] p-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              aria-label="Live product toast"
            >
              <p className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <BellIcon aria-hidden="true" size={14} />
                Product update
              </p>
              <p className="mt-2 text-sm font-semibold text-white text-balance">
                Version 2.4 is on the changelog
              </p>
              <p className="mt-2 text-sm text-[#9b9b9b] text-pretty">
                New export filters for the April close.
              </p>
            </aside>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#9b9b9b] text-pretty">
        Site ledger.harbor.test · Route /changelog · Window Now to Fri · Surface Toast
      </p>
    </div>
  )
}

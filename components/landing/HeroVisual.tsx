export function HeroVisual() {
  return (
    <div className="relative h-[520px] select-none" aria-hidden="true">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 rounded-3xl blur-3xl" />

      {/* Card 1: Toast notification - top right, slightly rotated */}
      <div className="absolute top-8 right-0 w-80 rounded-xl border border-white/10 bg-[#0d1117] p-4 shadow-2xl rotate-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Toast</span>
          <span className="ml-auto text-xs text-white/30">ledger.harbor.test/changelog</span>
        </div>
        <p className="text-sm font-semibold text-white">Version 2.4 ships new export filters</p>
        <p className="text-xs text-[#8b949e] mt-1">Available now on your changelog page.</p>
      </div>

      {/* Card 2: Alert - middle, slightly rotated other way */}
      <div className="absolute top-44 left-4 right-16 rounded-xl border border-cyan-500/20 bg-[#0d1117] p-4 shadow-2xl -rotate-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Alert</span>
          <span className="ml-auto text-xs text-white/30">ledger.harbor.test/billing</span>
        </div>
        <p className="text-sm font-semibold text-white">Scheduled maintenance window</p>
        <p className="text-xs text-[#8b949e] mt-1">Tue 14:00–16:00 UTC. Payments paused.</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 text-xs text-cyan-400">Acknowledge</span>
          <span className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-xs text-white/40">Dismiss</span>
        </div>
      </div>

      {/* Card 3: Dialog - bottom right */}
      <div className="absolute bottom-4 right-0 w-72 rounded-xl border border-white/10 bg-[#161b22] p-5 shadow-2xl rotate-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Dialog</span>
        </div>
        <p className="text-sm font-semibold text-white mb-1">We&apos;ve updated our pricing</p>
        <p className="text-xs text-[#8b949e]">Effective Mar 1. Review before your next billing cycle.</p>
        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-lg bg-violet-600 px-3 py-1.5 text-center text-xs font-semibold text-white">Review changes</span>
          <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/50">Later</span>
        </div>
      </div>

      {/* Floating route labels */}
      <div className="absolute top-0 left-0 rounded-lg border border-white/[0.06] bg-[#030712] px-3 py-1.5">
        <span className="font-mono text-xs text-[#8b949e]">/changelog</span>
        <span className="ml-2 size-1.5 inline-block rounded-full bg-violet-400 animate-pulse" />
      </div>
      <div className="absolute bottom-24 left-0 rounded-lg border border-white/[0.06] bg-[#030712] px-3 py-1.5">
        <span className="font-mono text-xs text-[#8b949e]">/billing</span>
        <span className="ml-2 size-1.5 inline-block rounded-full bg-cyan-400" />
      </div>
    </div>
  )
}

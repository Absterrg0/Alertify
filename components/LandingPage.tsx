import Link from "next/link"
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown"

import { DroplertMark } from "@/components/brand/DroplertMark"
import { CopyInstall } from "@/components/landing/CopyInstall"
import {
  FAQ_GROUPS,
  FAQ_JSON_LD,
  HARBOR_ORIGIN,
  LANDING_INTERACTIVE,
  LANDING_MOTION,
} from "@/components/landing/constants"
import { HeroVisual } from "@/components/landing/HeroVisual"
import { IslandNav } from "@/components/landing/IslandNav"
import { PrimaryCta } from "@/components/landing/PrimaryCta"
import { ScrollReveal } from "@/components/landing/ScrollReveal"
import { cn } from "@/lib/utils"

const FRAMEWORKS = ["Next.js", "React", "Remix", "Vite", "Astro", "SvelteKit"] as const

const BENTO_CARDS = [
  {
    id: "route-targeting",
    size: "large",
    title: "Route targeting",
    body: "Target /changelog, /billing, or a single docs page. Never interrupt the wrong visitor.",
    visual: (
      <div className="mb-4 rounded-lg border border-white/[0.07] bg-[#0a0d14] p-3 font-mono text-xs leading-relaxed">
        <p className="text-[#8b949e]">site routes</p>
        <p className="mt-1 text-white/40">/marketing</p>
        <p className="text-white/40">/docs/exports</p>
        <p className="mt-1 flex items-center gap-2 rounded-md bg-violet-500/10 px-2 py-1 text-violet-300">
          <span className="size-1.5 rounded-full bg-violet-400 inline-block animate-pulse" />
          /changelog
          <span className="ml-auto text-violet-400/70">active</span>
        </p>
        <p className="mt-1 text-white/40">/billing</p>
      </div>
    ),
  },
  {
    id: "no-socket",
    size: "small",
    title: "No live socket",
    body: "HTTP feed, not WebSocket. Reads on page load. Zero persistent connection.",
    visual: (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#0a0d14] px-3 py-2 font-mono text-xs">
        <span className="text-cyan-400">GET</span>
        <span className="text-[#8b949e] truncate">/feed/v1/site_abc</span>
        <span className="ml-auto text-emerald-400">200</span>
      </div>
    ),
  },
  {
    id: "three-surfaces",
    size: "small",
    title: "Three surfaces",
    body: "Toast, inline alert, or dialog. Pick the lightest interruption that fits the moment.",
    visual: (
      <div className="mb-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-md border border-violet-500/20 bg-violet-500/5 px-2 py-1.5 text-xs text-violet-300">
          <span className="size-1.5 rounded-full bg-violet-400 inline-block" /> Toast
        </div>
        <div className="flex items-center gap-2 rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-1.5 text-xs text-cyan-300">
          <span className="size-1.5 rounded-full bg-cyan-400 inline-block" /> Alert
        </div>
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 text-xs text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400 inline-block" /> Dialog
        </div>
      </div>
    ),
  },
  {
    id: "scheduled",
    size: "medium",
    title: "Scheduled windows",
    body: "Set a start and an end. The record disappears automatically when the window closes.",
    visual: (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#8b949e]">
        <span className="size-1.5 rounded-full bg-amber-400 inline-block" />
        Mar 1 → Mar 7 · Active
      </div>
    ),
  },
  {
    id: "zero-secrets",
    size: "medium",
    title: "Zero client secrets",
    body: "Public site ID only. Your publishing key never leaves the server.",
    visual: (
      <div className="mb-4 rounded-lg border border-white/[0.07] bg-[#0a0d14] p-3 font-mono text-xs">
        <p>
          <span className="text-[#8b949e]">siteId</span>
          <span className="text-white/40"> = </span>
          <span className="text-violet-300">&quot;site_public_id&quot;</span>
        </p>
        <p className="mt-1 text-white/20 line-through">publishingKey: &quot;sk_...&quot;</p>
      </div>
    ),
  },
  {
    id: "survives-refresh",
    size: "medium",
    title: "Survives refresh",
    body: "Campaign stays live until archived. The next page load always reads the current revision.",
    visual: (
      <div className="mb-4 flex items-center gap-3 text-xs text-[#8b949e]">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-violet-400 shrink-0">
          <path d="M4 10a6 6 0 0 1 10.5-4M16 10a6 6 0 0 1-10.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 6l.5 4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Feed revalidated · revision still active</span>
      </div>
    ),
  },
] as const

const FOOTER_LINKS = [
  { href: "#benefits", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const

export default function LandingPage() {
  return (
    <div className="landing-page bg-[#030712] text-white">
      <a className="landing-skip" href="#content">
        Skip to content
      </a>

      <IslandNav />

      <main id="content">
        {/* ── Hero ── */}
        <section aria-labelledby="hero-title" className="landing-hero px-4 pt-32 pb-20 sm:px-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="landing-hero-grid">
              {/* Left column */}
              <div className="max-w-[560px]">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
                  Route-targeted · No WebSockets
                </p>
                <h1
                  id="hero-title"
                  className="mt-6 text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
                >
                  Deliver the right
                  <br />
                  message to the
                  <br />
                  right page.
                </h1>
                <p className="mt-6 max-w-[480px] text-lg text-[#8b949e] text-pretty">
                  Droplert lets product teams publish scheduled announcements to exact routes on a verified site. The browser reads a versioned HTTP feed. No live socket. No secret in the client.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <PrimaryCta />
                  <a
                    href="#how-it-works"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white",
                      LANDING_MOTION,
                    )}
                  >
                    See how it works
                  </a>
                </div>
                <p className="mt-4 text-sm text-[#8b949e]">
                  Sign in with Google or GitHub · No credit card
                </p>
              </div>

              {/* Right column */}
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* ── Tech compatibility strip ── */}
        <section aria-label="Compatible with" className="border-y border-white/[0.06] bg-white/[0.02] py-5">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              Works with any JS framework
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-[#8b949e] text-sm font-medium">
              {FRAMEWORKS.map((fw) => (
                <span key={fw} className={cn("opacity-60 hover:opacity-100", LANDING_MOTION)}>
                  {fw}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem ── */}
        <ScrollReveal>
          <section aria-labelledby="problem-title" className="bg-[#0a0d16] px-4 py-24 sm:px-6 md:px-8">
            <div className="mx-auto max-w-6xl">
              <h2
                id="problem-title"
                className="max-w-4xl text-4xl font-extrabold tracking-tight text-balance md:text-5xl"
              >
                Sitewide banners are the wrong tool.
              </h2>
              <p className="mt-6 max-w-[640px] text-lg text-[#8b949e] text-pretty">
                A release note does not belong on billing. A maintenance window does not belong on a marketing page. Route-targeted delivery puts each message exactly where it matters.
              </p>

              <div className="mt-14 flex flex-col items-center gap-4 md:flex-row md:items-stretch">
                {/* Before card */}
                <div className="flex-1 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-red-400">Before</p>
                  <ul className="space-y-3 text-sm text-[#8b949e]">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">✗</span>
                      Global banner shown on <span className="text-white font-mono ml-1">all pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">✗</span>
                      <span className="font-mono text-white">/marketing</span> sees maintenance notice
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">✗</span>
                      <span className="font-mono text-white">/billing</span> sees release notes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">✗</span>
                      Every visitor interrupted, every time
                    </li>
                  </ul>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center text-2xl text-white/20 md:text-3xl" aria-hidden="true">
                  →
                </div>

                {/* After card */}
                <div className="flex-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-400">After</p>
                  <ul className="space-y-3 text-sm text-[#8b949e]">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      Toast only on <span className="font-mono text-white ml-1">/changelog</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      <span className="font-mono text-white">/billing</span> sees billing notice only
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      <span className="font-mono text-white">/marketing</span> sees nothing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      Right visitor, right message, right moment
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <hr className="landing-gradient-divider" />

        {/* ── Benefits bento ── */}
        <ScrollReveal>
          <section
            id="benefits"
            aria-labelledby="benefits-title"
            className="bg-[#030712] px-4 py-24 sm:px-6 md:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <h2 id="benefits-title" className="max-w-[680px] text-3xl font-semibold text-balance md:text-4xl">
                The announcement stays where the work is.
              </h2>
              <p className="mt-4 max-w-[560px] text-lg text-[#8b949e]">
                Everything you need to deliver the right message to the right page — nothing you don&apos;t.
              </p>

              {/* Bento grid */}
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {/* Row 1: large (3/5) + small (2/5) */}
                <div className="landing-bento-card sm:col-span-2 lg:col-span-3">
                  {BENTO_CARDS[0].visual}
                  <h3 className="text-lg font-semibold text-white">{BENTO_CARDS[0].title}</h3>
                  <p className="mt-2 text-sm text-[#8b949e]">{BENTO_CARDS[0].body}</p>
                </div>
                <div className="landing-bento-card sm:col-span-1 lg:col-span-2">
                  {BENTO_CARDS[1].visual}
                  <h3 className="text-base font-semibold text-white">{BENTO_CARDS[1].title}</h3>
                  <p className="mt-2 text-sm text-[#8b949e]">{BENTO_CARDS[1].body}</p>
                </div>

                {/* Row 2: small (2/5) + large (3/5) */}
                <div className="landing-bento-card sm:col-span-1 lg:col-span-2">
                  {BENTO_CARDS[2].visual}
                  <h3 className="text-base font-semibold text-white">{BENTO_CARDS[2].title}</h3>
                  <p className="mt-2 text-sm text-[#8b949e]">{BENTO_CARDS[2].body}</p>
                </div>
                <div className="landing-bento-card sm:col-span-2 lg:col-span-3">
                  {BENTO_CARDS[3].visual}
                  <h3 className="text-base font-semibold text-white">{BENTO_CARDS[3].title}</h3>
                  <p className="mt-2 text-sm text-[#8b949e]">{BENTO_CARDS[3].body}</p>
                </div>

                {/* Row 3: two mediums */}
                <div className="landing-bento-card sm:col-span-1 lg:col-span-2 lg:col-start-2">
                  {BENTO_CARDS[4].visual}
                  <h3 className="text-base font-semibold text-white">{BENTO_CARDS[4].title}</h3>
                  <p className="mt-2 text-sm text-[#8b949e]">{BENTO_CARDS[4].body}</p>
                </div>
                <div className="landing-bento-card sm:col-span-1 lg:col-span-2">
                  {BENTO_CARDS[5].visual}
                  <h3 className="text-base font-semibold text-white">{BENTO_CARDS[5].title}</h3>
                  <p className="mt-2 text-sm text-[#8b949e]">{BENTO_CARDS[5].body}</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── How It Works ── */}
        <ScrollReveal>
          <section
            id="how-it-works"
            aria-labelledby="how-title"
            className="bg-[#030712] px-4 sm:px-6 md:px-8"
            style={{ background: "radial-gradient(ellipse 50% 60% at -10% 50%, rgba(124,58,237,0.10) 0%, #030712 60%)" }}
          >
            <div className="mx-auto max-w-6xl pb-4">
              <div className="pt-24">
                <h2 id="how-title" className="max-w-[680px] text-3xl font-semibold text-balance md:text-4xl">
                  Three steps from origin to a live record.
                </h2>
              </div>

              {/* Step 1 */}
              <div className="landing-step-card">
                <div>
                  <span className="landing-step-number" aria-hidden="true">01</span>
                  <h3 className="text-2xl font-bold text-white">Verify a site</h3>
                  <p className="mt-3 text-base text-[#8b949e] text-pretty max-w-sm">
                    Confirm the exact origin that may receive the announcement. Add a DNS TXT record and Droplert confirms ownership in seconds.
                  </p>
                </div>
                <div className="landing-code-block">
                  <p className="text-[#8b949e]"># Add this TXT record to your DNS</p>
                  <p className="mt-2">
                    <span className="text-cyan-400">droplert-verify</span>
                    <span className="text-[#8b949e]"> IN TXT </span>
                    <span className="text-violet-400">&quot;droplert-site=abc123...&quot;</span>
                  </p>
                  <p className="mt-3 text-[#8b949e]"># Then verify in the dashboard</p>
                  <p>
                    <span className="text-emerald-400">✓</span>
                    <span className="text-[#8b949e] ml-2">ledger.harbor.test verified</span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="landing-step-card landing-step-card--reverse">
                <div>
                  <span className="landing-step-number" aria-hidden="true">02</span>
                  <h3 className="text-2xl font-bold text-white">Mount the SDK</h3>
                  <p className="mt-3 text-base text-[#8b949e] text-pretty max-w-sm">
                    Add the public site ID and the Droplert API origin in your app. No secret ever touches the browser.
                  </p>
                </div>
                <CopyInstall framed />
              </div>

              {/* Step 3 */}
              <div className="landing-step-card">
                <div>
                  <span className="landing-step-number" aria-hidden="true">03</span>
                  <h3 className="text-2xl font-bold text-white">Publish a campaign</h3>
                  <p className="mt-3 text-base text-[#8b949e] text-pretty max-w-sm">
                    Pick the route, the surface, and the window. Make the record available and it&apos;s live on the next page load.
                  </p>
                </div>
                <div className="landing-code-block">
                  <p className="text-[#8b949e]"># Campaign fields</p>
                  <p className="mt-2">
                    <span className="text-[#8b949e]">site   </span>
                    <span className="text-white">ledger.harbor.test</span>
                  </p>
                  <p>
                    <span className="text-[#8b949e]">route  </span>
                    <span className="text-violet-400">/changelog</span>
                  </p>
                  <p>
                    <span className="text-[#8b949e]">surface</span>
                    <span className="text-cyan-400"> Toast</span>
                  </p>
                  <p>
                    <span className="text-[#8b949e]">window </span>
                    <span className="text-white">Now → Fri 23:59</span>
                  </p>
                  <p className="mt-3">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-[#8b949e] ml-2">Campaign published · feed updated</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal>
          <section
            id="faq"
            aria-labelledby="faq-title"
            className="bg-[#030712] px-4 py-24 sm:px-6 md:px-8"
          >
            <div className="mx-auto max-w-[680px]">
              <h2 id="faq-title" className="text-3xl font-semibold text-balance md:text-4xl">
                Questions teams actually ask.
              </h2>
              <div className="mt-12">
                {FAQ_GROUPS.map((group) => (
                  <div key={group.label} className="border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#06b6d4]">{group.label}</p>
                    {group.items.map((item) => (
                      <details key={item.question} className="border-b border-white/10">
                        <summary
                          className={cn(
                            "flex cursor-pointer items-start justify-between gap-4 py-6 text-lg font-semibold text-balance",
                            LANDING_INTERACTIVE,
                          )}
                        >
                          {item.question}
                          <CaretDownIcon
                            aria-hidden="true"
                            size={20}
                            className={cn("landing-faq-caret mt-1 shrink-0", LANDING_MOTION)}
                          />
                        </summary>
                        <p className="pb-6 text-base text-[#8b949e] text-pretty">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Final CTA ── */}
        <ScrollReveal>
          <section
            aria-labelledby="final-title"
            className="landing-final-cta px-4 py-32 sm:px-6 md:px-8"
          >
            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
              <p className="font-mono text-sm text-[#8b949e]">{HARBOR_ORIGIN}/changelog</p>
              <h2
                id="final-title"
                className="text-4xl font-extrabold tracking-tight text-balance text-center md:text-5xl"
              >
                Deliver the right message
                <br />
                to the right page.
              </h2>
              <p className="max-w-md text-center text-lg text-[#8b949e]">
                Start free with Google or GitHub. No credit card required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <PrimaryCta />
                <a
                  href="#how-it-works"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white",
                    LANDING_MOTION,
                  )}
                >
                  See how it works
                </a>
              </div>
              <p className="text-sm text-[#8b949e]">Sign in with Google or GitHub · No credit card</p>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <footer className="bg-[#030712] px-4 py-12 sm:px-6 md:px-8">
        <hr className="landing-gradient-divider" />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 pt-12 md:flex-row md:items-center md:justify-between">
          <DroplertMark compact />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn("text-sm font-semibold text-white/60 hover:text-violet-400", LANDING_INTERACTIVE)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn("text-sm font-semibold text-white/60 hover:text-violet-400", LANDING_INTERACTIVE)}
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
    </div>
  )
}

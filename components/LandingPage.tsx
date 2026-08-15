import Link from "next/link"
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown"

import { DroplertMark } from "@/components/brand/DroplertMark"
import { CopyInstall } from "@/components/landing/CopyInstall"
import {
  FAQ_GROUPS,
  FAQ_JSON_LD,
  HARBOR_ORIGIN,
  HARBOR_ROUTES,
  LANDING_INTERACTIVE,
  LANDING_MOTION,
} from "@/components/landing/constants"
import { HeroVisual } from "@/components/landing/HeroVisual"
import { IslandNav } from "@/components/landing/IslandNav"
import { OriginLedger } from "@/components/landing/OriginLedger"
import { PrimaryCta } from "@/components/landing/PrimaryCta"
import { ScrollReveal } from "@/components/landing/ScrollReveal"
import { TaglineReveal } from "@/components/landing/TaglineReveal"
import { cn } from "@/lib/utils"

const BENEFITS = [
  {
    field: "/changelog",
    title: "Reach the route that needs it",
    body: "Target /changelog, /billing, or a single docs page instead of a sitewide banner.",
  },
  {
    field: "Next page load",
    title: "Keep the message after refresh",
    body: "A published revision stays available on the next page load through a cacheable feed.",
  },
  {
    field: "Public site ID",
    title: "Leave secrets off the client",
    body: "The installed reader only needs a public site ID and the API origin.",
  },
  {
    field: "Toast",
    title: "Choose how loud it is",
    body: "Toast, inline alert, or dialog, then set a start and an end.",
  },
] as const

const STEPS = [
  {
    title: "Verify a site",
    body: "Confirm the exact origin that may receive the announcement.",
    route: HARBOR_ORIGIN,
  },
  {
    title: "Mount the reader",
    body: "Add the public site ID and the Droplert API origin in your app.",
    route: "site_public_id",
  },
  {
    title: "Publish a campaign",
    body: "Pick the route, the surface, and the window, then make the record available.",
    route: "/changelog",
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
    <div className="landing-page bg-black text-white">
      <a className="landing-skip" href="#content">
        Skip to content
      </a>

      <IslandNav />

      <main id="content">
        <section aria-labelledby="hero-title" className="px-3 py-24 sm:px-6 md:px-8">
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="max-w-[680px]">
              <p className="font-[var(--font-geist-mono),ui-monospace,monospace] text-sm text-[#9b9b9b]">
                {HARBOR_ORIGIN}/changelog
              </p>
              <h1
                id="hero-title"
                className="mt-6 max-w-[680px] bg-gradient-to-r from-white to-[#9b9b9b] bg-clip-text text-4xl font-semibold leading-none text-transparent text-balance md:text-5xl lg:text-6xl"
              >
                Publish the update
                <br />
                on the route
                <br />
                your customer is on.
              </h1>
              <p className="mt-6 max-w-[680px] text-lg text-[#9b9b9b] text-pretty">
                Droplert is how product teams put a scheduled announcement inside a verified
                site. The browser reads a versioned HTTP feed. No live socket. No secret in the
                client.
              </p>
              <div className="mt-8">
                <PrimaryCta />
              </div>
              <p className="mt-4 text-sm text-[#9b9b9b]">
                No credit card. Continue with Google or GitHub.
              </p>
            </div>

            <div className="mt-16">
              <HeroVisual />
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section aria-labelledby="problem-title" className="bg-black px-4 py-24 sm:px-6 md:px-8">
            <div className="mx-auto grid max-w-6xl gap-12 xl:grid-cols-[680px_minmax(0,1fr)] xl:items-end">
              <div>
                <h2
                  id="problem-title"
                  className="max-w-[680px] text-3xl font-semibold text-balance md:text-4xl"
                >
                  Global banners treat every visitor the same.
                </h2>
                <p className="mt-6 max-w-[680px] text-lg text-[#9b9b9b] text-pretty">
                  A release note does not belong on billing. A maintenance window does not belong on
                  a marketing page. Droplert lets you verify an origin, pick the routes, and publish
                  a record the next page load can read.
                </p>
              </div>
              <OriginLedger
                routes={[
                  { path: "/marketing", note: "Wrong room" },
                  { path: "/billing", note: "Wrong room" },
                  { path: "/changelog", note: "This page", active: true },
                ]}
                caption="One origin. One path. One record."
              />
            </div>
          </section>
        </ScrollReveal>

        <TaglineReveal />

        <ScrollReveal>
          <section
            id="benefits"
            aria-labelledby="benefits-title"
            className="bg-black px-4 py-24 sm:px-6 md:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <h2 id="benefits-title" className="max-w-[680px] text-3xl font-semibold text-balance md:text-4xl">
                The announcement stays where the work is.
              </h2>
              <div className="mt-16 grid gap-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
                <OriginLedger
                  routes={HARBOR_ROUTES}
                  caption="The marker sits on the path that may show the message."
                />
                <ol>
                  {BENEFITS.map((item) => (
                    <li key={item.title} className="border-t border-[#313131] py-8 first:border-t-0 first:pt-0">
                      <p className="font-[var(--font-geist-mono),ui-monospace,monospace] text-sm text-[#9b9b9b]">
                        {item.field}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-balance">{item.title}</h3>
                      <p className="mt-2 text-base text-[#9b9b9b] text-pretty">{item.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section
            id="how-it-works"
            aria-labelledby="how-title"
            className="bg-black px-4 py-24 sm:px-6 md:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <h2 id="how-title" className="max-w-[680px] text-3xl font-semibold text-balance md:text-4xl">
                Three steps from origin to a live record.
              </h2>
              <ol className="mt-16 max-w-6xl">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="relative grid gap-4 border-t border-[#313131] py-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
                    <p className="font-[var(--font-geist-mono),ui-monospace,monospace] text-sm text-white">
                      {step.route}
                    </p>
                    <div>
                      <h3 className="text-xl font-semibold text-balance">{step.title}</h3>
                      <p className="mt-2 max-w-[680px] text-base text-[#9b9b9b] text-pretty">{step.body}</p>
                    </div>
                    {index < STEPS.length - 1 ? (
                      <span
                        className="pointer-events-none absolute bottom-0 left-0 hidden h-8 w-px bg-[#313131] md:block"
                        aria-hidden="true"
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section
            id="proof"
            aria-labelledby="proof-title"
            className="bg-black px-4 py-24 sm:px-6 md:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <h2 id="proof-title" className="max-w-[680px] text-3xl font-semibold text-balance md:text-4xl">
                Honest product facts, then a snippet you can paste.
              </h2>
              <div className="mt-16 overflow-hidden rounded-2xl bg-[#181818] p-2">
                <div className="rounded-lg bg-[#1f1f1f]">
                  <dl className="grid gap-6 px-6 py-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-[#9b9b9b]">Origin</dt>
                      <dd className="mt-2 font-[var(--font-geist-mono),ui-monospace,monospace] text-base text-white">
                        {HARBOR_ORIGIN}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[#9b9b9b]">Route</dt>
                      <dd className="mt-2 font-[var(--font-geist-mono),ui-monospace,monospace] text-base text-white">
                        /changelog
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[#9b9b9b]">Window</dt>
                      <dd className="mt-2 text-base text-white">Now to Fri</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[#9b9b9b]">Surface</dt>
                      <dd className="mt-2 text-base text-white">Toast</dd>
                    </div>
                  </dl>
                  <p className="border-t border-[#313131] px-6 py-4 text-sm text-[#9b9b9b] text-pretty">
                    The browser reads a versioned HTTP feed. There is no live socket. The installed
                    reader only receives a public site ID and the API origin. A published revision
                    stays available until you archive it or the window ends. Start with Google or
                    GitHub. No credit card.
                  </p>
                  <div className="border-t border-[#313131] p-2">
                    <CopyInstall framed={false} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section
            id="faq"
            aria-labelledby="faq-title"
            className="bg-black px-4 py-24 sm:px-6 md:px-8"
          >
            <div className="mx-auto max-w-[680px]">
              <h2 id="faq-title" className="text-3xl font-semibold text-balance md:text-4xl">
                Questions teams actually ask.
              </h2>
              <div className="mt-12">
                {FAQ_GROUPS.map((group) => (
                  <div key={group.label} className="border-t border-[#313131] pt-8 first:border-t-0 first:pt-0">
                    <p className="text-sm font-semibold text-white/60">{group.label}</p>
                    {group.items.map((item) => (
                      <details key={item.question} className="border-b border-[#313131]">
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
                        <p className="pb-6 text-base text-[#9b9b9b] text-pretty">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section aria-labelledby="final-title" className="bg-black px-4 py-24 sm:px-6 md:px-8">
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[680px]">
                <p className="font-[var(--font-geist-mono),ui-monospace,monospace] text-sm text-[#9b9b9b]">
                  {HARBOR_ORIGIN}/changelog
                </p>
                <h2 id="final-title" className="mt-4 text-3xl font-semibold text-balance md:text-4xl">
                  Publish the update on the route your customer is on.
                </h2>
              </div>
              <PrimaryCta />
            </div>
          </section>
        </ScrollReveal>
      </main>

      <footer className="border-t border-[#313131] bg-black px-4 py-12 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <DroplertMark compact />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn("text-sm font-semibold text-white/60 hover:text-white", LANDING_INTERACTIVE)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn("text-sm font-semibold text-white/60 hover:text-white", LANDING_INTERACTIVE)}
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

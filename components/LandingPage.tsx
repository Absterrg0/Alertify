"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Globe2,
  Menu,
  Radio,
  ShieldCheck,
  X,
} from "lucide-react"
import { DroplertMark } from "@/components/brand/DroplertMark"

const featureRows = [
  {
    number: "01",
    title: "Durable delivery",
    copy: "Publish once and let the feed stay available for every new page load. Visible pages refresh without keeping a socket open.",
  },
  {
    number: "02",
    title: "Schedule with intent",
    copy: "Set a campaign window before you publish. Announcements can arrive when a launch, maintenance window, or release actually starts.",
  },
  {
    number: "03",
    title: "Target the right routes",
    copy: "Keep a campaign focused with route targeting, so a homepage note does not become a product-wide interruption.",
  },
  {
    number: "04",
    title: "Shape the surface",
    copy: "Five visual presets and five motion options give teams a deliberate system for making announcements feel native to their product.",
  },
]

const stylePresets = [
  { name: "Minimal", detail: "quiet / direct", className: "style-tile--minimal" },
  { name: "Glass", detail: "soft / layered", className: "style-tile--glass" },
  { name: "Aurora", detail: "luminous / calm", className: "style-tile--aurora" },
  { name: "Editorial", detail: "warm / considered", className: "style-tile--editorial" },
  { name: "Neon", detail: "sharp / high-signal", className: "style-tile--neon" },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="landing-shell noise-overlay">
      <header className="landing-header">
        <div className="mx-auto flex min-h-[4.4rem] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <DroplertMark />

          <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
            <a className="landing-nav-link" href="#product">
              Product
            </a>
            <a className="landing-nav-link" href="#workflow">
              How it works
            </a>
            <a className="landing-nav-link" href="#styles">
              Styles
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link className="landing-nav-link px-2 py-2" href="/dashboard">
              Dashboard
            </Link>
            <Link className="landing-nav-link px-2 py-2" href="/getstarted">
              Sign in
            </Link>
            <Link className="button-mint" href="/getstarted">
              Start building <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>

          <button
            type="button"
            className="button-icon md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-navigation" className="border-t border-white/[0.1] bg-[#090c11] md:hidden">
            <nav aria-label="Mobile navigation" className="mx-auto flex w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
              <a className="landing-nav-link border-b border-white/[0.08] py-3" href="#product" onClick={closeMenu}>
                Product
              </a>
              <a className="landing-nav-link border-b border-white/[0.08] py-3" href="#workflow" onClick={closeMenu}>
                How it works
              </a>
              <a className="landing-nav-link border-b border-white/[0.08] py-3" href="#styles" onClick={closeMenu}>
                Styles
              </a>
              <div className="flex items-center gap-3 pt-4">
                <Link className="button-quiet flex-1" href="/dashboard" onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link className="button-quiet flex-1" href="/getstarted" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link className="button-mint flex-1" href="/getstarted" onClick={closeMenu}>
                  Start building <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <section className="landing-hero" id="product">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.84fr_1.16fr] lg:gap-14">
            <div className="animate-rise-in">
              <p className="eyebrow">Durable website campaigns / sdk + http feed</p>
              <h1 className="landing-hero__title">
                Announcements that stay <em>useful.</em>
              </h1>
              <p className="landing-hero__copy">
                Droplert gives product teams a durable, scheduled way to publish in-page announcements. A small React component reads an HTTP feed, so every new page load gets the right campaign without running a realtime messaging stack.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link className="button-mint" href="/getstarted">
                  Start building <ArrowRight aria-hidden="true" size={15} />
                </Link>
                <a className="button-quiet" href="#workflow">
                  View the workflow <ChevronDown aria-hidden="true" size={15} />
                </a>
              </div>
              <div className="trust-row" aria-label="Technical highlights">
                <span>
                  <Check aria-hidden="true" size={12} className="text-[#70f0c0]" /> HTTP feed delivery
                </span>
                <span>
                  <Check aria-hidden="true" size={12} className="text-[#70f0c0]" /> No open sockets
                </span>
                <span>
                  <Check aria-hidden="true" size={12} className="text-[#70f0c0]" /> React + Next.js
                </span>
              </div>
            </div>

            <div className="animate-rise-in [animation-delay:120ms]" aria-label="Droplert product preview">
              <div className="product-canvas">
                <div className="browser-bar">
                  <div className="browser-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="browser-address">
                    <Globe2 aria-hidden="true" size={10} />
                    product.acme.dev / changelog
                  </div>
                  <span className="font-mono text-[0.52rem] text-[#70f0c0]">200 OK</span>
                </div>

                <div className="canvas-layout">
                  <div className="canvas-page">
                    <div className="canvas-page__copy">
                      <strong>Make the next release feel close.</strong>
                      <span>One clear message, delivered inside the product your users already know.</span>
                    </div>
                    <div className="demo-notification">
                      <div className="demo-notification__top">
                        <span>Campaign / active</span>
                        <span>09:42 UTC</span>
                      </div>
                      <strong className="mt-2 block text-[0.85rem] font-[560] tracking-[-0.03em] text-[#f3f3ee]">
                        Version 2.4 is ready to explore
                      </strong>
                      <p>
                        See what changed, then pick up exactly where you left off.
                      </p>
                    </div>
                  </div>

                  <aside className="canvas-controls" aria-label="Campaign feed and controls">
                    <div className="canvas-controls__head">
                      <strong>Campaign feed</strong>
                      <span>LIVE PREVIEW</span>
                    </div>
                    <div className="canvas-feed">
                      <span className="canvas-feed__label">delivery / http</span>
                      <div className="canvas-feed__row">
                        <span className="feed-status" />
                        <div>
                          <strong>Release notes</strong>
                          <span>active · route /changelog</span>
                        </div>
                      </div>
                      <div className="canvas-feed__row">
                        <span className="feed-status" style={{ background: "var(--violet)" }} />
                        <div>
                          <strong>Maintenance window</strong>
                          <span>scheduled · 18 Aug, 08:00</span>
                        </div>
                      </div>
                      <div className="canvas-feed__row">
                        <span className="feed-status" style={{ background: "var(--warning)" }} />
                        <div>
                          <strong>Invite your team</strong>
                          <span>draft · not delivered</span>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between px-1 font-mono text-[0.58rem] text-[#727b89]">
                <span>campaign_canvas / 01</span>
                <span className="inline-flex items-center gap-1.5 text-[#70f0c0]"><span className="status-dot status-dot--success" /> feed connected</span>
              </div>
            </div>
          </div>
        </section>

        <section className="value-strip" aria-label="How Droplert works">
          <div className="mx-auto grid w-full max-w-6xl px-5 sm:px-8 md:grid-cols-3">
            <div className="value-step">
              <span className="value-step__number">01 / PUBLISH</span>
              <strong>Publish once</strong>
              <span>Write the announcement and choose its window.</span>
            </div>
            <div className="value-step">
              <span className="value-step__number">02 / PERSIST</span>
              <strong>Durable feed</strong>
              <span>New page loads receive the active campaign immediately.</span>
            </div>
            <div className="value-step">
              <span className="value-step__number">03 / DELIVER</span>
              <strong>Lightweight SDK</strong>
              <span>A small component keeps the experience in your product.</span>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32" id="capabilities">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div>
              <p className="eyebrow">Built for product moments</p>
              <h2 className="editorial-heading mt-4">Control the message. Keep the stack light.</h2>
              <p className="editorial-copy mt-6">
                Your announcement system should feel like part of the product, not a second infrastructure project. Droplert keeps campaign state explicit and delivery easy to inspect.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 font-mono text-[0.62rem] text-[#9a8cff]">
                <Radio aria-hidden="true" size={13} /> DELIVERY MODEL / HTTP + POLLING
              </div>
            </div>
            <div>
              {featureRows.map((feature) => (
                <article className="feature-row" key={feature.number}>
                  <span className="feature-row__number">{feature.number}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-rule py-24 sm:py-32" id="styles">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Appearance system</p>
                <h2 className="editorial-heading mt-4">Five ways to make a notice feel native.</h2>
              </div>
              <p className="editorial-copy sm:max-w-[20rem]">
                Start with a preset, then tune the content, color, motion, and route for the moment at hand.
              </p>
            </div>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stylePresets.map((preset) => (
                <article className={`style-tile ${preset.className}`} key={preset.name}>
                  <span className="style-tile__label">{preset.name}</span>
                  <div className="style-tile__sample">
                    <strong>Small note, clear intent</strong>
                    <span>Ship the next step with context.</span>
                  </div>
                  <span className="style-tile__meta">{preset.detail}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-rule py-24 sm:py-32" id="workflow">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow">A calm path to publish</p>
              <h2 className="editorial-heading mt-4">From first install to first campaign in an afternoon.</h2>
              <p className="editorial-copy mt-6">
                Add the component, connect a public site ID, and keep campaign decisions in one focused control room.
              </p>
              <div className="code-snippet mt-8">
                <div className="code-snippet__top">
                  <span>app/layout.tsx</span>
                  <span>React / Next.js</span>
                </div>
                <pre>
                  <span className="code-keyword">import</span> {"{"} Droplert {"}"} <span className="code-keyword">from</span> <span className="code-string">&quot;droplert/react&quot;</span>
                  {"\n\n"}
                  <span className="code-keyword">export default function</span> RootLayout() {"{"}
                  {"\n  "}&lt;Droplert siteId={<span className="code-string">&quot;site_public_id&quot;</span>} /&gt;
                  {"\n"}{"}"}
                </pre>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              <article className="workflow-step">
                <span className="workflow-step__number">01 / CONNECT</span>
                <h3>Add a site</h3>
                <p>Verify the domain in your workspace and copy its public site ID.</p>
              </article>
              <article className="workflow-step">
                <span className="workflow-step__number">02 / INSTALL</span>
                <h3>Drop in the SDK</h3>
                <p>Use the small React component wherever your app owns its layout.</p>
              </article>
              <article className="workflow-step">
                <span className="workflow-step__number">03 / COMPOSE</span>
                <h3>Shape the moment</h3>
                <p>Pick a type, style, route, and schedule without touching your app release.</p>
              </article>
              <article className="workflow-step">
                <span className="workflow-step__number">04 / PUBLISH</span>
                <h3>Let the feed deliver</h3>
                <p>Active campaigns appear on new loads and refresh efficiently while visible.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="surface-card relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
              <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#70f0c0]/[0.07] blur-3xl" aria-hidden="true" />
              <div className="relative max-w-2xl">
                <p className="eyebrow">Your next product moment</p>
                <h2 className="editorial-heading mt-4">Make the announcement part of the experience.</h2>
                <p className="editorial-copy mt-6">
                  Start with one site, one clear message, and a delivery model your team can reason about.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link className="button-mint" href="/getstarted">
                    Open your workspace <ArrowUpRight aria-hidden="true" size={15} />
                  </Link>
                  <Link className="button-quiet" href="/dashboard">
                    View dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.12] py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <DroplertMark compact />
            <span className="font-mono text-[0.58rem] text-[#727b89]">durable campaigns for the web</span>
          </div>
          <div className="flex items-center gap-5 font-mono text-[0.6rem] text-[#727b89]">
            <Link className="hover:text-[#f3f3ee]" href="/getstarted">Sign in</Link>
            <Link className="hover:text-[#f3f3ee]" href="/dashboard">Dashboard</Link>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck aria-hidden="true" size={12} /> HTTP feed</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

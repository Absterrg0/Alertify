"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronDown,
  Globe2,
  Menu,
  Route,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { DroplertMark } from "@/components/brand/DroplertMark"

const proofItems = [
  { label: "Targeted routes", icon: Route },
  { label: "Scheduled delivery", icon: CalendarClock },
  { label: "No browser secrets", icon: ShieldCheck },
] as const

const outcomeCards = [
  {
    id: "01",
    eyebrow: "RELEASE NOTES",
    title: "Give the change a place to land.",
    copy: "Keep a release update close to the page where customers feel the difference.",
    href: "/alert",
    linkLabel: "Preview an alert",
    className: "briefing-outcome-card--release",
  },
  {
    id: "02",
    eyebrow: "PLANNED MAINTENANCE",
    title: "Set expectations before the window.",
    copy: "A scheduled notice can arrive on the exact routes affected, then quietly expire.",
    href: "/toast",
    linkLabel: "Preview a toast",
    className: "briefing-outcome-card--maintenance",
  },
  {
    id: "03",
    eyebrow: "ONBOARDING NUDGES",
    title: "Help the next step feel obvious.",
    copy: "Use a focused prompt to guide new customers without turning your product into a tour.",
    href: "/alert_dialog",
    linkLabel: "Preview a dialog",
    className: "briefing-outcome-card--onboarding",
  },
] as const

const flowSteps = [
  {
    number: "01",
    label: "Compose",
    copy: "Write the message and choose the surface it belongs on.",
    icon: Sparkles,
  },
  {
    number: "02",
    label: "Target",
    copy: "Match verified sites and routes to the people who need it.",
    icon: Route,
  },
  {
    number: "03",
    label: "Publish",
    copy: "Set a start or end window, then make the record available.",
    icon: CalendarClock,
  },
  {
    number: "04",
    label: "Learn",
    copy: "Read delivery and interaction events without guessing who saw what.",
    icon: ShieldCheck,
  },
] as const

const installSnippet = `import { Droplert } from "droplert/react"
import "droplert/styles.css"

export default function AppLayout({ children }) {
  return (
    <>
      {children}
      <Droplert
        siteId="site_public_id"
        apiUrl="https://droplert.abstergo.dev"
      />
    </>
  )
}`

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="briefing-page">
      <a className="briefing-skip-link" href="#outcomes">
        Skip to content
      </a>

      <header className="briefing-header">
        <div className="briefing-container briefing-header__inner">
          <DroplertMark className="briefing-brand" />

          <nav aria-label="Primary navigation" className="briefing-nav briefing-nav--desktop">
            <a href="#outcomes">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#install">Install</a>
          </nav>

          <div className="briefing-header__actions briefing-header__actions--desktop">
            <Link className="briefing-signin" href="/getstarted">
              Sign in
            </Link>
            <Link className="briefing-button briefing-button--primary briefing-button--small" href="/getstarted">
              Start building <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>

          <button
            type="button"
            className="briefing-menu-button"
            aria-expanded={mobileMenuOpen}
            aria-controls="briefing-mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div id="briefing-mobile-navigation" className="briefing-mobile-panel">
            <nav aria-label="Mobile navigation" className="briefing-container briefing-mobile-panel__nav">
              <a href="#outcomes" onClick={closeMenu}>
                Product <ArrowRight aria-hidden="true" size={16} />
              </a>
              <a href="#how-it-works" onClick={closeMenu}>
                How it works <ArrowRight aria-hidden="true" size={16} />
              </a>
              <a href="#install" onClick={closeMenu}>
                Install <ArrowRight aria-hidden="true" size={16} />
              </a>
              <div className="briefing-mobile-panel__actions">
                <Link className="briefing-button briefing-button--secondary" href="/getstarted" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link className="briefing-button briefing-button--primary" href="/getstarted" onClick={closeMenu}>
                  Start building <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <section className="briefing-hero" aria-labelledby="hero-title">
          <div className="briefing-container briefing-hero__grid">
            <div className="briefing-hero__intro">
              <p className="briefing-eyebrow">
                <span className="briefing-eyebrow__dot" aria-hidden="true" /> IN-PRODUCT ANNOUNCEMENTS
              </p>
              <h1 id="hero-title">
                <span className="briefing-hero__heading-line">Put the right</span>{" "}
                <span className="briefing-hero__heading-line">update in front of</span>{" "}
                <span className="briefing-hero__heading-line">the right customer.</span>
              </h1>
              <p className="briefing-hero__copy">
                Droplert helps product teams publish targeted announcements inside the pages where they matter. Set routes and a schedule once; a durable HTTP feed keeps the message available without a permanent browser connection.
              </p>
              <div className="briefing-hero__actions">
                <Link className="briefing-button briefing-button--primary" href="/getstarted">
                  Start building <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <a className="briefing-button briefing-button--secondary" href="#how-it-works">
                  See how it works <ChevronDown aria-hidden="true" size={16} />
                </a>
              </div>
              <ul className="briefing-proof" aria-label="Droplert product details">
                {proofItems.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <Icon aria-hidden="true" size={14} />
                    <span>{label}</span>
                  </li>
                ))}
                <li className="briefing-proof__technical">
                  <span className="briefing-proof__signal" aria-hidden="true" />
                  <span>HTTP feed</span>
                </li>
              </ul>
            </div>

            <div className="briefing-hero__visual">
              <div className="briefing-scene" aria-label="A product page with an active targeted announcement and campaign controls">
                <div className="briefing-scene__browserbar">
                  <div className="briefing-scene__browser-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="briefing-scene__address">
                    <Globe2 aria-hidden="true" size={12} />
                    yourapp.dev/changelog
                  </div>
                  <span className="briefing-scene__browser-status">preview</span>
                </div>

                <div className="briefing-scene__body">
                  <article className="briefing-product-page">
                    <nav className="briefing-product-nav" aria-label="Example product page navigation">
                      <span className="briefing-product-nav__brand"><i aria-hidden="true" /> yourapp</span>
                      <span>Docs</span>
                      <span>Releases</span>
                      <span>Account</span>
                    </nav>

                    <div className="briefing-product-page__content">
                      <p className="briefing-scene-label">RELEASES / 2.4</p>
                      <h2>Make every release easier to follow.</h2>
                      <p>One place for the notes, decisions, and details your team wants to share.</p>
                      <div className="briefing-product-page__lines" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="briefing-product-page__meta">
                        <span>4 min read</span>
                        <span>Updated today</span>
                      </div>
                    </div>

                    <div className="briefing-announcement">
                      <div className="briefing-announcement__top">
                        <span className="briefing-announcement__tag"><i aria-hidden="true" /> Product update</span>
                        <span>For changelog readers</span>
                      </div>
                      <strong>Version 2.4 is ready to explore</strong>
                      <p>New routes, clearer handoffs, fewer things to remember.</p>
                      <a href="/alert">
                        Read release notes <ArrowUpRight aria-hidden="true" size={13} />
                      </a>
                    </div>
                  </article>

                  <aside className="briefing-control-rail" aria-label="Active campaign controls">
                    <div className="briefing-control-rail__head">
                      <div>
                        <p>CAMPAIGN</p>
                        <strong>Release 2.4</strong>
                      </div>
                      <span className="briefing-live-state"><i aria-hidden="true" /> Live</span>
                    </div>
                    <div className="briefing-rule-list">
                      <div>
                        <span>Site</span>
                        <strong>yourapp.dev</strong>
                      </div>
                      <div>
                        <span>Route</span>
                        <strong>/changelog</strong>
                      </div>
                      <div>
                        <span>Window</span>
                        <strong>Now → Fri</strong>
                      </div>
                      <div>
                        <span>Surface</span>
                        <strong>Inline alert</strong>
                      </div>
                    </div>
                    <div className="briefing-control-rail__foot">
                      <span><Check aria-hidden="true" size={13} /> verified site</span>
                      <span>HTTP feed ready</span>
                    </div>
                  </aside>
                </div>
              </div>
              <div className="briefing-scene-caption">
                <span><i aria-hidden="true" /> Rendered in your product</span>
                <span>one route / one message</span>
              </div>
            </div>
          </div>
        </section>

        <section className="briefing-section briefing-outcomes" id="outcomes" aria-labelledby="outcomes-title">
          <div className="briefing-container">
            <div className="briefing-section-heading">
              <div>
                <p className="briefing-eyebrow"><span className="briefing-eyebrow__dot" aria-hidden="true" /> AFTER THE SHIP</p>
                <h2 id="outcomes-title">Built for the moment after you ship.</h2>
              </div>
              <p>Turn a finished product moment into a message that reaches people in context—without another dashboard to keep alive.</p>
            </div>

            <div className="briefing-outcomes__grid">
              {outcomeCards.map((card) => (
                <article className={`briefing-outcome-card ${card.className}`} key={card.id}>
                  <div className="briefing-outcome-card__heading">
                    <span>{card.id}</span>
                    <p>{card.eyebrow}</p>
                  </div>
                  <div className="briefing-outcome-card__stage">
                    {card.id === "01" ? (
                      <div className="briefing-message briefing-message--release">
                        <span>Release note</span>
                        <strong>Version 2.4 is ready.</strong>
                        <p>See what changed in the product you use every day.</p>
                        <b>Read the update <ArrowUpRight aria-hidden="true" size={12} /></b>
                      </div>
                    ) : null}
                    {card.id === "02" ? (
                      <div className="briefing-message briefing-message--maintenance">
                        <div className="briefing-message__mini-nav"><i aria-hidden="true" /> yourapp <span>×</span></div>
                        <div className="briefing-message__toast">
                          <CalendarClock aria-hidden="true" size={15} />
                          <div><strong>Maintenance starts at 22:00 UTC</strong><p>We&apos;ll be back shortly.</p></div>
                        </div>
                      </div>
                    ) : null}
                    {card.id === "03" ? (
                      <div className="briefing-message briefing-message--onboarding">
                        <div className="briefing-message__dialog-top"><span>Welcome to your workspace</span><span>×</span></div>
                        <strong>Start with one verified site.</strong>
                        <p>Connect your first origin and publish a nudge when you&apos;re ready.</p>
                        <span className="briefing-message__dialog-action">Add a site <ArrowRight aria-hidden="true" size={12} /></span>
                      </div>
                    ) : null}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                  <Link className="briefing-text-link" href={card.href}>
                    {card.linkLabel} <ArrowUpRight aria-hidden="true" size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="briefing-section briefing-how" id="how-it-works" aria-labelledby="how-title">
          <div className="briefing-container">
            <div className="briefing-section-heading briefing-section-heading--compact">
              <div>
                <p className="briefing-eyebrow"><span className="briefing-eyebrow__dot" aria-hidden="true" /> HOW IT WORKS</p>
                <h2 id="how-title">A small loop from message to meaning.</h2>
              </div>
              <p>Every campaign is a record you can inspect. Droplert serves it from a versioned HTTP feed, so the browser can fetch on load and revalidate later—no persistent client socket needed.</p>
            </div>

            <ol className="briefing-flow" aria-label="Droplert campaign workflow">
              {flowSteps.map(({ number, label, copy, icon: Icon }, index) => (
                <li className="briefing-flow__step" key={label}>
                  <div className="briefing-flow__top">
                    <span>{number}</span>
                    <span className="briefing-flow__icon"><Icon aria-hidden="true" size={16} /></span>
                  </div>
                  <h3>{label}</h3>
                  <p>{copy}</p>
                  {index < flowSteps.length - 1 ? <span className="briefing-flow__connector" aria-hidden="true" /> : null}
                </li>
              ))}
            </ol>

            <div className="briefing-feed-note">
              <ShieldCheck aria-hidden="true" size={18} />
              <p><strong>Durable by default.</strong> A published revision stays available to the next page load, with ETag revalidation keeping unchanged fetches lightweight.</p>
              <span>HTTP / VERSIONED / CACHEABLE</span>
            </div>
          </div>
        </section>

        <section className="briefing-section briefing-control" id="control" aria-labelledby="control-title">
          <div className="briefing-container briefing-control__grid">
            <div className="briefing-control__copy">
              <p className="briefing-eyebrow"><span className="briefing-eyebrow__dot" aria-hidden="true" /> CONTROL THE MOMENT</p>
              <h2 id="control-title">Give every update a place, a route, and a window.</h2>
              <p>Keep the campaign decision-making close to the product context. Verify the origin, choose the routes, set the timing, and pick an accessible surface—all before the message reaches a customer.</p>
              <Link className="briefing-text-link" href="/dashboard">
                Open the campaign workspace <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            </div>

            <div className="briefing-rule-sheet" aria-label="Campaign rule sheet">
              <div className="briefing-rule-sheet__head">
                <div><span>CAMPAIGN RULES</span><strong>Release 2.4</strong></div>
                <span className="briefing-ready-state"><i aria-hidden="true" /> Ready</span>
              </div>
              <div className="briefing-rule-sheet__body">
                <div className="briefing-rule-sheet__row">
                  <span><Globe2 aria-hidden="true" size={15} /> Verified site</span>
                  <strong>yourapp.dev <Check aria-hidden="true" size={14} /></strong>
                </div>
                <div className="briefing-rule-sheet__row">
                  <span><Route aria-hidden="true" size={15} /> Route rules</span>
                  <strong>/changelog <small>exact match</small></strong>
                </div>
                <div className="briefing-rule-sheet__row">
                  <span><CalendarClock aria-hidden="true" size={15} /> Schedule</span>
                  <strong>Now → 18:00 UTC</strong>
                </div>
                <div className="briefing-rule-sheet__surfaces">
                  <div><span>Accessible surfaces</span><small>choose the lightest interruption</small></div>
                  <div className="briefing-surface-options" aria-label="Selected notification surface">
                    <span className="briefing-surface-option">Toast</span>
                    <span className="briefing-surface-option briefing-surface-option--selected">Inline</span>
                    <span className="briefing-surface-option">Dialog</span>
                  </div>
                </div>
              </div>
              <div className="briefing-rule-sheet__foot"><span>PUBLIC READ</span><span>NO BROWSER SECRET</span></div>
            </div>
          </div>
        </section>

        <section className="briefing-install" id="install" aria-labelledby="install-title">
          <div className="briefing-container">
            <div className="briefing-section-heading briefing-section-heading--install">
              <div>
                <p className="briefing-eyebrow"><span className="briefing-eyebrow__dot" aria-hidden="true" /> INSTALL</p>
                <h2 id="install-title">Three small steps to put it in your app.</h2>
              </div>
              <p>The reader stays lightweight and the public contract stays explicit. Add a verified site, mount the reader, then publish your first campaign.</p>
            </div>

            <div className="briefing-install__grid">
              <ol className="briefing-install__steps">
                <li><span>01</span><div><strong>Add a verified site</strong><p>Confirm the exact origin that will receive the announcement.</p></div></li>
                <li><span>02</span><div><strong>Mount the reader</strong><p>Use the public site ID and the Droplert API origin in your app.</p></div></li>
                <li><span>03</span><div><strong>Publish a campaign</strong><p>Choose the route, surface, and delivery window from your workspace.</p></div></li>
              </ol>

              <div className="briefing-code-block">
                <div className="briefing-code-block__head"><span>app/layout.tsx</span><span>REACT / PUBLIC CONFIG</span></div>
                <pre aria-label="Droplert React installation example"><code>{installSnippet}</code></pre>
                <div className="briefing-code-block__foot"><span>VERSIONED HTTP FEED</span><span>ORIGIN ONLY</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="briefing-final" aria-labelledby="final-title">
          <div className="briefing-container briefing-final__inner">
            <div>
              <p className="briefing-eyebrow"><span className="briefing-eyebrow__dot" aria-hidden="true" /> READY WHEN THE MESSAGE IS</p>
              <h2 id="final-title">Make the next product moment findable.</h2>
            </div>
            <Link className="briefing-button briefing-button--primary" href="/getstarted">
              Start building <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="briefing-footer">
        <div className="briefing-container briefing-footer__inner">
          <DroplertMark compact className="briefing-brand" />
          <div className="briefing-footer__links">
            <Link href="/getstarted">Sign in</Link>
            <Link href="/dashboard">Dashboard</Link>
            <span><ShieldCheck aria-hidden="true" size={14} /> HTTP feed delivery</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

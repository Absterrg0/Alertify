"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarClock,
  Check,
  Globe2,
  Menu,
  MessageSquare,
  MousePointerClick,
  PanelsTopLeft,
  PenLine,
  Route,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { DroplertMark } from "@/components/brand/DroplertMark"

const tickerItems = [
  "Route-targeted",
  "Scheduled windows",
  "No browser secrets",
  "Versioned HTTP feed",
  "ETag revalidation",
  "Verified origins",
  "Impressions · clicks · dismissals",
] as const

const navLinks = [
  { href: "#surfaces", label: "Surfaces" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
] as const

const stats = [
  { value: "3", label: "surfaces", detail: "Inline alert, toast, and dialog" },
  { value: "5", label: "presets", detail: "From minimal to neon" },
  { value: "15m", label: "revalidation", detail: "Visible pages quietly refresh" },
  { value: "0", label: "browser secrets", detail: "Only a public site ID ships" },
] as const

const surfaces = [
  {
    id: "01",
    tone: "yellow",
    icon: PanelsTopLeft,
    label: "Inline alert",
    title: "Give release notes a place to land.",
    copy: "Pin a change right next to the feature it touches, then let it expire on schedule.",
    href: "/alert",
  },
  {
    id: "02",
    tone: "pink",
    icon: Bell,
    label: "Toast",
    title: "Warn before the maintenance window.",
    copy: "A short, dismissible heads-up on exactly the routes that will be affected.",
    href: "/toast",
  },
  {
    id: "03",
    tone: "blue",
    icon: MessageSquare,
    label: "Dialog",
    title: "Make the next step feel obvious.",
    copy: "Guide a new customer to one clear action without building a product tour.",
    href: "/alert_dialog",
  },
] as const

const steps = [
  { number: "01", label: "Compose", copy: "Write the message, pick a surface, tune a preset.", icon: PenLine, tone: "yellow" },
  { number: "02", label: "Target", copy: "Choose verified sites and the routes that matter.", icon: Route, tone: "pink" },
  { number: "03", label: "Schedule", copy: "Publish now or set a start and end window.", icon: CalendarClock, tone: "green" },
  { number: "04", label: "Measure", copy: "Read impressions, clicks, and dismissals per campaign.", icon: MousePointerClick, tone: "blue" },
] as const

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="lp">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>

      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-ticker__track">
          {[0, 1].map((copy) => (
            <div className="lp-ticker__group" key={copy}>
              {tickerItems.map((item) => (
                <span key={item}>
                  {item} <Sparkles size={14} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="lp-header">
        <div className="lp-wrap lp-header__inner">
          <DroplertMark />

          <nav aria-label="Primary navigation" className="lp-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="lp-header__actions">
            <Link className="lp-link" href="/getstarted">
              Sign in
            </Link>
            <Link className="lp-btn lp-btn--ink lp-btn--sm" href="/getstarted">
              Start building <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <button
            type="button"
            className="lp-menu-button"
            aria-expanded={mobileMenuOpen}
            aria-controls="lp-mobile-nav"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav id="lp-mobile-nav" aria-label="Mobile navigation" className="lp-mobile-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label} <ArrowRight aria-hidden="true" size={18} />
              </a>
            ))}
            <div className="lp-mobile-nav__actions">
              <Link className="lp-btn lp-btn--white" href="/getstarted" onClick={closeMenu}>
                Sign in
              </Link>
              <Link className="lp-btn lp-btn--yellow" href="/getstarted" onClick={closeMenu}>
                Start building <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main">
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-wrap lp-hero__grid">
            <div className="lp-hero__copy">
              <p className="lp-chip lp-chip--green">
                <span className="lp-pulse" aria-hidden="true" /> In-product announcements
              </p>
              <h1 id="hero-title">
                Put the <mark className="lp-hl lp-hl--yellow">right update</mark> in front of the{" "}
                <mark className="lp-hl lp-hl--pink">right customer.</mark>
              </h1>
              <p className="lp-hero__lede">
                Droplert publishes targeted announcements inside the pages where they matter. Pick the routes and the
                schedule once — a durable HTTP feed does the rest, with no socket left open in your visitors&apos; browsers.
              </p>
              <div className="lp-hero__actions">
                <Link className="lp-btn lp-btn--yellow lp-btn--lg" href="/getstarted">
                  Start building <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <a className="lp-btn lp-btn--white lp-btn--lg" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <ul className="lp-hero__proof" aria-label="Highlights">
                <li><Check aria-hidden="true" size={15} /> Route targeting</li>
                <li><Check aria-hidden="true" size={15} /> Scheduled windows</li>
                <li><Check aria-hidden="true" size={15} /> No browser secrets</li>
              </ul>
            </div>

            <div className="lp-hero__stage" aria-label="Example: a product page showing a targeted Droplert announcement">
              <div className="lp-window">
                <div className="lp-window__bar">
                  <span className="lp-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="lp-window__url"><Globe2 aria-hidden="true" size={12} /> yourapp.dev/changelog</span>
                </div>
                <div className="lp-window__body">
                  <div className="lp-fake-nav" aria-hidden="true">
                    <b>yourapp</b>
                    <span>Docs</span>
                    <span>Releases</span>
                    <span>Account</span>
                  </div>
                  <div className="lp-inline-alert">
                    <span className="lp-inline-alert__icon"><Sparkles aria-hidden="true" size={16} /></span>
                    <div>
                      <strong>Version 2.4 is ready to explore</strong>
                      <p>New routes, clearer handoffs, fewer things to remember.</p>
                    </div>
                    <span className="lp-inline-alert__cta">Read notes <ArrowUpRight aria-hidden="true" size={13} /></span>
                  </div>
                  <p className="lp-fake-kicker">Releases / 2.4</p>
                  <p className="lp-fake-title">Make every release easier to follow.</p>
                  <div className="lp-fake-lines" aria-hidden="true"><span /><span /><span /><span /></div>
                </div>
              </div>

              <div className="lp-float lp-float--rules">
                <div className="lp-float__head">
                  <span>Campaign</span>
                  <span className="lp-live"><i aria-hidden="true" /> Live</span>
                </div>
                <strong>Release 2.4</strong>
                <dl>
                  <div><dt>Route</dt><dd>/changelog</dd></div>
                  <div><dt>Window</dt><dd>Now → Fri</dd></div>
                  <div><dt>Surface</dt><dd>Inline</dd></div>
                </dl>
              </div>

              <div className="lp-float lp-float--toast">
                <CalendarClock aria-hidden="true" size={18} />
                <div>
                  <strong>Maintenance at 22:00 UTC</strong>
                  <p>Back in 20 minutes.</p>
                </div>
                <X aria-hidden="true" size={14} />
              </div>

              <div className="lp-burst" aria-hidden="true">
                <span>100%<br />HTTP</span>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-stats" aria-label="Droplert at a glance">
          <div className="lp-wrap lp-stats__grid">
            {stats.map((stat) => (
              <div className="lp-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <p>{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section" id="surfaces" aria-labelledby="surfaces-title">
          <div className="lp-wrap">
            <div className="lp-heading">
              <p className="lp-chip lp-chip--pink">Surfaces</p>
              <h2 id="surfaces-title">Three surfaces. Zero dashboards to babysit.</h2>
              <p>Turn a finished product moment into a message that reaches people in context — then let it expire on its own.</p>
            </div>

            <div className="lp-surfaces">
              {surfaces.map(({ id, tone, icon: Icon, label, title, copy, href }) => (
                <article className={`lp-surface lp-surface--${tone}`} key={id}>
                  <div className="lp-surface__top">
                    <span className="lp-surface__label"><Icon aria-hidden="true" size={15} /> {label}</span>
                    <span className="lp-surface__id">{id}</span>
                  </div>
                  <div className="lp-surface__stage" aria-hidden="true">
                    {id === "01" ? (
                      <div className="lp-mini lp-mini--alert">
                        <Sparkles size={14} />
                        <div><b>Version 2.4 is ready</b><small>See what changed today.</small></div>
                      </div>
                    ) : null}
                    {id === "02" ? (
                      <div className="lp-mini lp-mini--toast">
                        <CalendarClock size={14} />
                        <div><b>Maintenance at 22:00</b><small>Back shortly.</small></div>
                        <X size={12} />
                      </div>
                    ) : null}
                    {id === "03" ? (
                      <div className="lp-mini lp-mini--dialog">
                        <b>Welcome aboard 👋</b>
                        <small>Connect your first site to publish.</small>
                        <span>Add a site →</span>
                      </div>
                    ) : null}
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <Link className="lp-surface__link" href={href}>
                    Try the {label.toLowerCase()} <ArrowUpRight aria-hidden="true" size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--how" id="how-it-works" aria-labelledby="how-title">
          <div className="lp-wrap">
            <div className="lp-heading">
              <p className="lp-chip lp-chip--yellow">How it works</p>
              <h2 id="how-title">From message to meaning in four moves.</h2>
              <p>Every campaign is an immutable record served from a versioned feed. Browsers fetch it on load and revalidate later.</p>
            </div>

            <ol className="lp-steps">
              {steps.map(({ number, label, copy, icon: Icon, tone }) => (
                <li className={`lp-step lp-step--${tone}`} key={label}>
                  <div className="lp-step__top">
                    <span className="lp-step__num">{number}</span>
                    <span className="lp-step__icon"><Icon aria-hidden="true" size={20} /></span>
                  </div>
                  <h3>{label}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="lp-section" id="features" aria-labelledby="features-title">
          <div className="lp-wrap">
            <div className="lp-heading">
              <p className="lp-chip lp-chip--blue">Features</p>
              <h2 id="features-title">Control the where, the when, and the who.</h2>
            </div>

            <div className="lp-bento">
              <article className="lp-tile lp-tile--green lp-tile--wide">
                <Route aria-hidden="true" size={22} />
                <h3>Route rules that read like paths.</h3>
                <p>Exact matches or trailing wildcards, evaluated by the installed client. No regex required.</p>
                <div className="lp-codechips" aria-label="Example route rules">
                  <code>{"/*"}</code>
                  <code>/pricing</code>
                  <code>/dashboard/*</code>
                  <code>/changelog</code>
                </div>
              </article>

              <article className="lp-tile lp-tile--yellow">
                <CalendarClock aria-hidden="true" size={22} />
                <h3>Scheduling windows.</h3>
                <p>Start later, end automatically.</p>
                <div className="lp-timeline" aria-hidden="true">
                  <span>Mon</span><span className="is-on">Tue</span><span className="is-on">Wed</span><span className="is-on">Thu</span><span>Fri</span>
                </div>
              </article>

              <article className="lp-tile lp-tile--white">
                <ShieldCheck aria-hidden="true" size={22} />
                <h3>Verified origins.</h3>
                <p>Prove ownership with a DNS TXT record before anything ships.</p>
                <code className="lp-tile__code">_droplert-verification</code>
              </article>

              <article className="lp-tile lp-tile--pink">
                <Globe2 aria-hidden="true" size={22} />
                <h3>A durable feed.</h3>
                <p>Cacheable, versioned, and cheap to revalidate.</p>
                <code className="lp-tile__code">304 Not Modified</code>
              </article>

              <article className="lp-tile lp-tile--blue">
                <MousePointerClick aria-hidden="true" size={22} />
                <h3>Real delivery events.</h3>
                <p>Impressions, clicks, and dismissals, stored per campaign.</p>
                <div className="lp-bars" aria-hidden="true">
                  <span style={{ height: "45%" }} /><span style={{ height: "70%" }} /><span style={{ height: "55%" }} /><span style={{ height: "90%" }} /><span style={{ height: "65%" }} />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="lp-install" id="install" aria-labelledby="install-title">
          <div className="lp-wrap lp-install__grid">
            <div className="lp-install__copy">
              <p className="lp-chip lp-chip--yellow">Install</p>
              <h2 id="install-title">Three steps. One component.</h2>
              <ol className="lp-install__steps">
                <li><span>1</span><div><strong>Add a verified site</strong><p>Confirm the exact origin that will receive announcements.</p></div></li>
                <li><span>2</span><div><strong>Mount the reader</strong><p>Drop in the component with your public site ID.</p></div></li>
                <li><span>3</span><div><strong>Publish a campaign</strong><p>Choose route, surface, and window from the workspace.</p></div></li>
              </ol>
            </div>

            <div className="lp-code">
              <div className="lp-code__bar">
                <span className="lp-dots" aria-hidden="true"><i /><i /><i /></span>
                <span>app/layout.tsx</span>
              </div>
              <pre aria-label="Droplert React installation example"><code>
                <span className="t-k">import</span> {"{ "}<span className="t-v">Droplert</span>{" }"} <span className="t-k">from</span> <span className="t-s">&quot;droplert/react&quot;</span>{"\n"}
                <span className="t-k">import</span> <span className="t-s">&quot;droplert/styles.css&quot;</span>{"\n\n"}
                <span className="t-k">export default function</span> <span className="t-f">AppLayout</span>{"({ children }) {\n"}
                {"  "}<span className="t-k">return</span>{" (\n    <>\n      {children}\n      <"}<span className="t-v">Droplert</span>{"\n        "}<span className="t-a">siteId</span>=<span className="t-s">&quot;site_public_id&quot;</span>{"\n        "}<span className="t-a">apiUrl</span>=<span className="t-s">&quot;https://droplert.abstergo.dev&quot;</span>{"\n      />\n    </>\n  )\n}"}
              </code></pre>
            </div>
          </div>
        </section>

        <section className="lp-final" aria-labelledby="final-title">
          <div className="lp-wrap">
            <div className="lp-final__card">
              <span className="lp-final__shape lp-final__shape--a" aria-hidden="true" />
              <span className="lp-final__shape lp-final__shape--b" aria-hidden="true" />
              <h2 id="final-title">Make the next product moment impossible to miss.</h2>
              <Link className="lp-btn lp-btn--ink lp-btn--lg" href="/getstarted">
                Start building — it&apos;s quick <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer__top">
            <DroplertMark compact />
            <nav aria-label="Footer navigation">
              <Link href="/getstarted">Sign in</Link>
              <Link href="/dashboard">Dashboard</Link>
              <a href="#install">Install</a>
            </nav>
          </div>
          <p className="lp-footer__word" aria-hidden="true">Droplert</p>
          <p className="lp-footer__note">Durable, scheduled in-product campaigns · by Abstergo</p>
        </div>
      </footer>
    </div>
  )
}

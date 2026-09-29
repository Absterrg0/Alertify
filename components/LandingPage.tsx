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

const navLinks = [
  { href: "#surfaces", label: "Surfaces" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
] as const

const facts = [
  { value: "3", label: "Surfaces", detail: "Inline alert, toast, dialog" },
  { value: "5", label: "Presets", detail: "Minimal through neon" },
  { value: "15 min", label: "Revalidation", detail: "Visible pages refresh quietly" },
  { value: "0", label: "Browser secrets", detail: "Only a public site ID ships" },
] as const

const surfaces = [
  {
    tone: "yellow",
    icon: PanelsTopLeft,
    label: "Inline alert",
    title: "Give release notes a place to land.",
    copy: "Pin a change next to the feature it touches, then let it expire on schedule.",
    href: "/alert",
  },
  {
    tone: "pink",
    icon: Bell,
    label: "Toast",
    title: "Warn before the maintenance window.",
    copy: "A short, dismissible heads-up on exactly the routes that will be affected.",
    href: "/toast",
  },
  {
    tone: "blue",
    icon: MessageSquare,
    label: "Dialog",
    title: "Make the next step obvious.",
    copy: "Guide a new customer to one clear action without building a product tour.",
    href: "/alert_dialog",
  },
] as const

const steps = [
  { number: "01", label: "Compose", copy: "Write the message, pick a surface, and tune a preset.", icon: PenLine },
  { number: "02", label: "Target", copy: "Choose verified sites and the routes that matter.", icon: Route },
  { number: "03", label: "Schedule", copy: "Publish now or set a start and end window.", icon: CalendarClock },
  { number: "04", label: "Measure", copy: "Read impressions, clicks, and dismissals per campaign.", icon: MousePointerClick },
] as const

const features = [
  { icon: Route, title: "Route rules", copy: "Exact paths or trailing wildcards, evaluated by the installed client." },
  { icon: CalendarClock, title: "Scheduling windows", copy: "Start later and end automatically — no cleanup deploys." },
  { icon: ShieldCheck, title: "Verified origins", copy: "Prove ownership with a DNS TXT record before anything ships." },
  { icon: Globe2, title: "Durable HTTP feed", copy: "Versioned, cacheable, and cheap to revalidate with ETags." },
  { icon: MousePointerClick, title: "Delivery events", copy: "Impressions, clicks, and dismissals stored per campaign." },
  { icon: Sparkles, title: "Surface presets", copy: "Five tuned looks you can adjust down to color and radius." },
] as const

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="lp">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>

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
            <Link className="btn btn--primary btn--sm" href="/getstarted">
              Start building
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
            {mobileMenuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav id="lp-mobile-nav" aria-label="Mobile navigation" className="lp-mobile-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label} <ArrowRight aria-hidden="true" size={16} />
              </a>
            ))}
            <div className="lp-mobile-nav__actions">
              <Link className="btn btn--secondary" href="/getstarted" onClick={closeMenu}>
                Sign in
              </Link>
              <Link className="btn btn--primary" href="/getstarted" onClick={closeMenu}>
                Start building
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main">
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-wrap lp-hero__grid">
            <div className="lp-hero__copy">
              <p className="lp-kicker">
                <span className="lp-kicker__mark" aria-hidden="true" /> In-product announcements
              </p>
              <h1 id="hero-title">
                Put the right update in front of the <mark>right customer.</mark>
              </h1>
              <p className="lp-hero__lede">
                Droplert publishes targeted announcements inside the pages where they matter. Set the routes and the
                schedule once — a durable HTTP feed handles delivery, with no socket held open in your visitors&apos;
                browsers.
              </p>
              <div className="lp-hero__actions">
                <Link className="btn btn--primary btn--lg" href="/getstarted">
                  Start building <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <a className="btn btn--secondary btn--lg" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <ul className="lp-hero__proof" aria-label="Highlights">
                <li><Check aria-hidden="true" size={14} /> Route targeting</li>
                <li><Check aria-hidden="true" size={14} /> Scheduled windows</li>
                <li><Check aria-hidden="true" size={14} /> No browser secrets</li>
              </ul>
            </div>

            <div className="lp-hero__visual" aria-label="Example: a product page showing a targeted Droplert announcement">
              <div className="lp-window">
                <div className="lp-window__bar">
                  <span className="lp-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="lp-window__url"><Globe2 aria-hidden="true" size={12} /> yourapp.dev/changelog</span>
                </div>
                <div className="lp-window__body">
                  <div className="lp-page">
                    <div className="lp-page__nav" aria-hidden="true">
                      <b>yourapp</b>
                      <span>Docs</span>
                      <span className="is-current">Releases</span>
                      <span>Account</span>
                    </div>
                    <div className="lp-alert">
                      <Sparkles aria-hidden="true" size={16} />
                      <div>
                        <strong>Version 2.4 is ready to explore</strong>
                        <p>New routes, clearer handoffs, fewer things to remember.</p>
                      </div>
                    </div>
                    <p className="lp-page__kicker">Releases / 2.4</p>
                    <p className="lp-page__title">Make every release easier to follow.</p>
                    <div className="lp-page__lines" aria-hidden="true"><span /><span /><span /></div>
                  </div>
                  <aside className="lp-rail" aria-label="Campaign settings">
                    <div className="lp-rail__head">
                      <span>Campaign</span>
                      <span className="lp-live"><i aria-hidden="true" /> Live</span>
                    </div>
                    <strong>Release 2.4</strong>
                    <dl>
                      <div><dt>Site</dt><dd>yourapp.dev</dd></div>
                      <div><dt>Route</dt><dd>/changelog</dd></div>
                      <div><dt>Window</dt><dd>Now → Fri</dd></div>
                      <div><dt>Surface</dt><dd>Inline alert</dd></div>
                    </dl>
                  </aside>
                </div>
              </div>
              <div className="lp-toast">
                <CalendarClock aria-hidden="true" size={16} />
                <div>
                  <strong>Maintenance tonight, 22:00 UTC</strong>
                  <p>Exports pause for about 20 minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-facts" aria-label="Droplert at a glance">
          <div className="lp-wrap">
            <dl className="lp-facts__grid">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    <strong>{fact.value}</strong>
                    <span>{fact.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="lp-section" id="surfaces" aria-labelledby="surfaces-title">
          <div className="lp-wrap">
            <div className="lp-heading">
              <div>
                <p className="lp-label">Surfaces</p>
                <h2 id="surfaces-title">Three surfaces, each for a different moment.</h2>
              </div>
              <p>Turn a finished product moment into a message that reaches people in context — then let it expire on its own.</p>
            </div>

            <div className="lp-surfaces">
              {surfaces.map(({ tone, icon: Icon, label, title, copy, href }) => (
                <article className="lp-surface" key={label}>
                  <div className={`lp-surface__stage lp-surface__stage--${tone}`} aria-hidden="true">
                    {tone === "yellow" ? (
                      <div className="lp-mini lp-mini--alert">
                        <Sparkles size={14} />
                        <div><b>Version 2.4 is ready</b><small>See what changed today.</small></div>
                      </div>
                    ) : null}
                    {tone === "pink" ? (
                      <div className="lp-mini lp-mini--toast">
                        <CalendarClock size={14} />
                        <div><b>Maintenance at 22:00</b><small>Back shortly.</small></div>
                        <X size={12} />
                      </div>
                    ) : null}
                    {tone === "blue" ? (
                      <div className="lp-mini lp-mini--dialog">
                        <b>Welcome aboard</b>
                        <small>Connect your first site to publish.</small>
                        <span>Add a site</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="lp-surface__body">
                    <p className="lp-surface__label"><Icon aria-hidden="true" size={14} /> {label}</p>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <Link className="lp-arrow-link" href={href}>
                      Try the {label.toLowerCase()} <ArrowUpRight aria-hidden="true" size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--tinted" id="how-it-works" aria-labelledby="how-title">
          <div className="lp-wrap">
            <div className="lp-heading">
              <div>
                <p className="lp-label">How it works</p>
                <h2 id="how-title">From message to measurement in four steps.</h2>
              </div>
              <p>Every campaign is an immutable record served from a versioned feed. Browsers fetch it on load and revalidate later.</p>
            </div>

            <ol className="lp-steps">
              {steps.map(({ number, label, copy, icon: Icon }) => (
                <li className="lp-step" key={label}>
                  <div className="lp-step__top">
                    <span className="lp-step__num">{number}</span>
                    <Icon aria-hidden="true" size={18} />
                  </div>
                  <h3>{label}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="lp-section" id="features" aria-labelledby="features-title">
          <div className="lp-wrap lp-features">
            <div className="lp-features__intro">
              <p className="lp-label">Features</p>
              <h2 id="features-title">Control where, when, and for whom.</h2>
              <p>Everything you need to ship a message responsibly — and nothing you have to keep running.</p>
              <div className="lp-routes" aria-label="Example route rules">
                <span>Route rules</span>
                <code>{"/*"}</code>
                <code>/pricing</code>
                <code>/dashboard/*</code>
              </div>
            </div>
            <ul className="lp-features__grid">
              {features.map(({ icon: Icon, title, copy }) => (
                <li key={title}>
                  <span className="lp-features__icon"><Icon aria-hidden="true" size={17} /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lp-section lp-section--tinted" id="install" aria-labelledby="install-title">
          <div className="lp-wrap lp-install">
            <div>
              <p className="lp-label">Install</p>
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

        <section className="lp-cta" aria-labelledby="cta-title">
          <div className="lp-wrap">
            <div className="lp-cta__box">
              <div>
                <h2 id="cta-title">Make the next product moment easy to find.</h2>
                <p>Add a site, mount the reader, and publish your first campaign in minutes.</p>
              </div>
              <Link className="btn btn--accent btn--lg" href="/getstarted">
                Start building <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer__inner">
          <DroplertMark compact />
          <nav aria-label="Footer navigation">
            <Link href="/getstarted">Sign in</Link>
            <Link href="/dashboard">Dashboard</Link>
            <a href="#install">Install</a>
          </nav>
          <p>Durable, scheduled in-product campaigns.</p>
        </div>
      </footer>
    </div>
  )
}

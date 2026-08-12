"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, ShieldCheck, X } from "lucide-react"
import { DroplertMark } from "@/components/brand/DroplertMark"

const systemRecords = [
  {
    number: "01",
    label: "DURABLE DELIVERY",
    title: "The feed is the source of truth.",
    copy: "Publish once and keep the campaign available for every new page load. The client reads a versioned HTTP feed, not a transient browser connection.",
    detail: "HTTP / VERSIONED / CACHEABLE",
  },
  {
    number: "02",
    label: "SCHEDULED WINDOWS",
    title: "Make time part of the message.",
    copy: "Set a start and optional end before publishing. Launch notes, maintenance windows, and release prompts arrive when their context is actually useful.",
    detail: "START / END / PRIORITY",
  },
  {
    number: "03",
    label: "ROUTE TARGETING",
    title: "Carry the message to the right surface.",
    copy: "Route rules keep a campaign focused. A note for /changelog can stay a note for /changelog instead of becoming a product-wide interruption.",
    detail: "PATH RULES / VERIFIED ORIGINS",
  },
  {
    number: "04",
    label: "INSPECTABLE ANALYTICS",
    title: "Know what was delivered.",
    copy: "Delivery and interaction events are stored independently, so impressions, clicks, and dismissals can be understood without coupling them to feed retrieval.",
    detail: "IMPRESSION / CLICK / DISMISS",
  },
] as const

const surfacePresets = [
  {
    name: "Minimal",
    code: "MINIMAL",
    detail: "QUIET / DIRECT",
    href: "/alert?preset=MINIMAL",
    className: "surface-register__item--minimal",
    type: "ALERT",
  },
  {
    name: "Glass",
    code: "GLASS",
    detail: "SOFT / LAYERED",
    href: "/toast?preset=GLASS",
    className: "surface-register__item--glass",
    type: "TOAST",
  },
  {
    name: "Aurora",
    code: "AURORA",
    detail: "AMBIENT / CALM",
    href: "/alert?preset=AURORA",
    className: "surface-register__item--aurora",
    type: "ALERT",
  },
  {
    name: "Editorial",
    code: "EDITORIAL",
    detail: "TYPE / VOICE",
    href: "/alert_dialog?preset=EDITORIAL",
    className: "surface-register__item--editorial",
    type: "ALERT DIALOG",
  },
  {
    name: "Neon",
    code: "NEON",
    detail: "HIGH / SIGNAL",
    href: "/toast?preset=NEON",
    className: "surface-register__item--neon",
    type: "TOAST",
  },
] as const

const proofItems = ["ETag revalidation", "15 min visible refresh", "verified origins", "no browser secret"]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="landing-shell dispatch-page">
      <a className="landing-skip-link" href="#system">
        Skip to system
      </a>

      <header className="landing-header dispatch-header">
        <div className="landing-frame dispatch-header__inner">
          <div className="dispatch-identity">
            <DroplertMark className="dispatch-brand" />
            <span className="dispatch-identity__code">DL / CAMPAIGN SYSTEM</span>
          </div>

          <nav aria-label="Primary navigation" className="dispatch-nav dispatch-nav--desktop">
            <a className="dispatch-nav__link" href="#system">
              <span>01</span> System
            </a>
            <a className="dispatch-nav__link" href="#surfaces">
              <span>02</span> Surfaces
            </a>
            <a className="dispatch-nav__link" href="#install">
              <span>03</span> Install
            </a>
          </nav>

          <div className="dispatch-header__actions dispatch-header__actions--desktop">
            <Link className="dispatch-header__signin" href="/getstarted">
              Sign in
            </Link>
            <Link className="dispatch-button dispatch-button--cobalt dispatch-button--small" href="/getstarted">
              Start building <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>

          <button
            type="button"
            className="dispatch-menu-button"
            aria-expanded={mobileMenuOpen}
            aria-controls="dispatch-mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div id="dispatch-mobile-navigation" className="dispatch-mobile-panel">
            <nav aria-label="Mobile navigation" className="landing-frame dispatch-mobile-panel__nav">
              <a className="dispatch-mobile-panel__link" href="#system" onClick={closeMenu}>
                <span>01</span> System <ArrowRight aria-hidden="true" size={15} />
              </a>
              <a className="dispatch-mobile-panel__link" href="#surfaces" onClick={closeMenu}>
                <span>02</span> Surfaces <ArrowRight aria-hidden="true" size={15} />
              </a>
              <a className="dispatch-mobile-panel__link" href="#install" onClick={closeMenu}>
                <span>03</span> Install <ArrowRight aria-hidden="true" size={15} />
              </a>
              <div className="dispatch-mobile-panel__actions">
                <Link className="dispatch-header__signin" href="/getstarted" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link className="dispatch-button dispatch-button--cobalt" href="/getstarted" onClick={closeMenu}>
                  Start building <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main>
        <section className="dispatch-hero" aria-labelledby="hero-title">
          <div className="landing-frame dispatch-hero__grid">
            <div className="dispatch-hero__intro">
              <p className="dispatch-kicker">
                <span className="dispatch-kicker__mark" aria-hidden="true" /> DL / 0001 — DURABLE CAMPAIGN DELIVERY
              </p>
              <h1 className="dispatch-hero__title" id="hero-title">
                Move from product moment to <span>visible campaign.</span>
              </h1>
              <p className="dispatch-hero__copy">
                Droplert gives technical teams a quiet way to compose, verify, publish, and inspect in-page campaigns. A durable HTTP feed keeps each message available to the next page load without operating a permanent connection or exposing an owner credential.
              </p>
              <div className="dispatch-hero__actions">
                <Link className="dispatch-button dispatch-button--cobalt" href="/getstarted">
                  Start building <ArrowRight aria-hidden="true" size={15} />
                </Link>
                <a className="dispatch-button dispatch-button--outline" href="#system">
                  Read the system <ChevronDown aria-hidden="true" size={15} />
                </a>
              </div>
              <ul className="dispatch-proof-list" aria-label="Droplert delivery details">
                {proofItems.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" size={13} /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="dispatch-plate-wrap">
              <div className="dispatch-plate" aria-label="Campaign dispatch plate">
                <div className="dispatch-plate__masthead">
                  <span>DISPATCH PLATE / ACTIVE CAMPAIGN</span>
                  <span>PLATE 001</span>
                </div>
                <div className="dispatch-plate__body">
                  <section className="dispatch-plate__record" aria-label="Active campaign record">
                    <div className="dispatch-plate__record-top">
                      <span>CAMPAIGN 017</span>
                      <span className="dispatch-plate__active"><i aria-hidden="true" /> ACTIVE</span>
                    </div>
                    <h2>Version 2.4 is ready to explore</h2>
                    <p>See what changed, then pick up exactly where you left off.</p>
                    <dl className="dispatch-plate__metadata">
                      <div>
                        <dt>ROUTE</dt>
                        <dd>/changelog</dd>
                      </div>
                      <div>
                        <dt>WINDOW</dt>
                        <dd>NOW → 18:00 UTC</dd>
                      </div>
                      <div>
                        <dt>ORIGIN</dt>
                        <dd>product.acme.dev</dd>
                      </div>
                      <div>
                        <dt>PRESET</dt>
                        <dd>EDITORIAL</dd>
                      </div>
                    </dl>
                    <div className="dispatch-plate__record-foot">
                      <span>REVISION 17</span>
                      <span>PRIORITY / 02</span>
                    </div>
                  </section>

                  <section className="dispatch-plate__surface" aria-label="Rendered notification specimen">
                    <div className="dispatch-plate__surface-label">
                      <span>VISIBLE SURFACE</span>
                      <span>390 × AUTO</span>
                    </div>
                    <div className="dispatch-specimen">
                      <div className="dispatch-specimen__bar" aria-hidden="true" />
                      <div className="dispatch-specimen__content">
                        <span className="dispatch-specimen__eyebrow">RELEASE NOTE / 02</span>
                        <strong>Version 2.4 is ready to explore</strong>
                        <p>New routes, sharper handoffs, fewer things to remember.</p>
                        <span className="dispatch-specimen__link">Read the update <ArrowUpRight aria-hidden="true" size={12} /></span>
                      </div>
                    </div>
                    <span className="dispatch-plate__surface-foot">IN-PAGE / EDITORIAL SURFACE</span>
                  </section>
                </div>
                <div className="dispatch-plate__feed">
                  <div>
                    <span className="dispatch-plate__feed-label">REQUEST</span>
                    <code>GET /api/v1/sites/site_7F3.../feed</code>
                  </div>
                  <div>
                    <span className="dispatch-plate__feed-label">RESPONSE</span>
                    <strong>200 OK</strong>
                    <code>ETag &quot;site-17&quot;</code>
                  </div>
                  <div>
                    <span className="dispatch-plate__feed-label">NEXT CHECK</span>
                    <strong>15 MIN / VISIBLE</strong>
                    <code>If-None-Match → 304</code>
                  </div>
                </div>
              </div>
              <div className="dispatch-plate__caption">
                <span>HTTP FEED / ETag REVALIDATION</span>
                <span>ONE RECORD / MANY PAGE LOADS</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dispatch-system" id="system" aria-labelledby="system-title">
          <div className="landing-frame">
            <div className="dispatch-section-intro">
              <div>
                <p className="dispatch-kicker"><span className="dispatch-kicker__mark" aria-hidden="true" /> 01 / SYSTEM</p>
                <h2 className="dispatch-section-title" id="system-title">A campaign is a record, not a live wire.</h2>
              </div>
              <p className="dispatch-section-copy">Compose once, verify the destination, publish to a durable feed, and let the visible surface do the receiving. The lifecycle stays legible at every step.</p>
            </div>

            <ol className="dispatch-rail" aria-label="Droplert campaign lifecycle">
              {[
                ["01", "COMPOSE", "message + surface"],
                ["02", "VERIFY", "origin + routes"],
                ["03", "PUBLISH", "window + priority"],
                ["04", "VISIBLE", "feed + surface"],
              ].map(([number, label, detail], index) => (
                <li className="dispatch-rail__step" key={label}>
                  <span className="dispatch-rail__number">{number}</span>
                  <span className="dispatch-rail__marker" aria-hidden="true" />
                  <strong>{label}</strong>
                  <span>{detail}</span>
                  {index < 3 ? <span className="dispatch-rail__connector" aria-hidden="true" /> : null}
                </li>
              ))}
            </ol>

            <div className="dispatch-records">
              {systemRecords.map((record) => (
                <article className="dispatch-record" key={record.number}>
                  <span className="dispatch-record__number">{record.number}</span>
                  <div className="dispatch-record__title">
                    <span>{record.label}</span>
                    <h3>{record.title}</h3>
                  </div>
                  <p>{record.copy}</p>
                  <span className="dispatch-record__detail">{record.detail}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dispatch-surfaces" id="surfaces" aria-labelledby="surfaces-title">
          <div className="landing-frame">
            <div className="dispatch-section-intro dispatch-section-intro--surfaces">
              <div>
                <p className="dispatch-kicker"><span className="dispatch-kicker__mark" aria-hidden="true" /> 02 / SURFACES</p>
                <h2 className="dispatch-section-title" id="surfaces-title">Five surfaces. One appearance contract.</h2>
              </div>
              <p className="dispatch-section-copy">Preset color, motion, placement, route rules, and schedule stay configurable at publish time. Choose a starting language, then make it yours.</p>
            </div>

            <div className="surface-register" aria-label="Notification preset register">
              {surfacePresets.map((preset, index) => (
                <Link className={`surface-register__item ${preset.className}`} href={preset.href} key={preset.code}>
                  <div className="surface-register__head">
                    <span>{String(index + 1).padStart(2, "0")} / {preset.type}</span>
                    <ArrowUpRight aria-hidden="true" size={14} />
                  </div>
                  <div className="surface-register__sample">
                    {preset.code === "MINIMAL" ? (
                      <div className="surface-sample surface-sample--minimal">
                        <span>PRODUCT UPDATE</span>
                        <strong>Small note, clear intent.</strong>
                        <p>One line of context is enough.</p>
                      </div>
                    ) : null}
                    {preset.code === "GLASS" ? (
                      <div className="surface-sample surface-sample--glass">
                        <span>NOW / 02</span>
                        <strong>Keep the thread visible.</strong>
                        <p>A soft arrival for a light touch.</p>
                      </div>
                    ) : null}
                    {preset.code === "AURORA" ? (
                      <div className="surface-sample surface-sample--aurora">
                        <span>FIELD NOTE</span>
                        <strong>Make room for what is next.</strong>
                        <p>Ambient, but still easy to read.</p>
                      </div>
                    ) : null}
                    {preset.code === "EDITORIAL" ? (
                      <div className="surface-sample surface-sample--editorial">
                        <span>RELEASE / 02</span>
                        <strong>The change has a place to land.</strong>
                        <p>Give the headline a little more air.</p>
                        <b>READ THE NOTE ↗</b>
                      </div>
                    ) : null}
                    {preset.code === "NEON" ? (
                      <div className="surface-sample surface-sample--neon">
                        <span>LIVE SIGNAL</span>
                        <strong>New route detected.</strong>
                        <p>High signal, no hidden state.</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="surface-register__foot">
                    <strong>{preset.name}</strong>
                    <span>{preset.detail}</span>
                  </div>
                </Link>
              ))}
            </div>
            <p className="surface-register__note"><span aria-hidden="true">↗</span> Open a composer with this preset preselected.</p>
          </div>
        </section>

        <section className="dispatch-install" id="install" aria-labelledby="install-title">
          <div className="landing-frame">
            <div className="dispatch-section-intro dispatch-section-intro--dark">
              <div>
                <p className="dispatch-kicker"><span className="dispatch-kicker__mark" aria-hidden="true" /> 03 / INSTALL</p>
                <h2 className="dispatch-section-title" id="install-title">Install a reader. Publish a record.</h2>
              </div>
              <p className="dispatch-section-copy">A verified origin and a public site ID are enough to connect the feed. The owner credential stays in Droplert, never in the browser.</p>
            </div>

            <div className="dispatch-install__grid">
              <ol className="dispatch-install__steps">
                <li>
                  <span>01</span>
                  <div><strong>Verify the origin</strong><p>Add the exact site URL in your workspace and confirm it.</p></div>
                </li>
                <li>
                  <span>02</span>
                  <div><strong>Install the package</strong><p>Bring the small React reader into the app that owns the surface.</p></div>
                </li>
                <li>
                  <span>03</span>
                  <div><strong>Mount the reader</strong><p>Give it the public site ID and the Droplert API origin once.</p></div>
                </li>
                <li>
                  <span>04</span>
                  <div><strong>Publish the campaign</strong><p>Compose the message, choose its routes and window, then publish.</p></div>
                </li>
              </ol>

              <div className="dispatch-code-block">
                <div className="dispatch-code-block__head">
                  <span>app/layout.tsx</span>
                  <span>REACT / NEXT APP ROUTER</span>
                </div>
                <pre aria-label="Droplert React installation example"><code><span className="dispatch-code-line dispatch-code__comment">$ npm install droplert-cli</span><span className="dispatch-code-line dispatch-code-line--blank" aria-hidden="true" /><span className="dispatch-code-line"><span className="dispatch-code__keyword">import</span>{" { Droplert } "}<span className="dispatch-code__keyword">from</span>{" "}<span className="dispatch-code__string">&quot;droplert/react&quot;</span></span><span className="dispatch-code-line"><span className="dispatch-code__keyword">import</span>{" "}<span className="dispatch-code__string">&quot;droplert/styles.css&quot;</span></span><span className="dispatch-code-line dispatch-code-line--blank" aria-hidden="true" /><span className="dispatch-code-line"><span className="dispatch-code__keyword">export default function</span>{" RootLayout({ children }) {"}</span><span className="dispatch-code-line">{"  "}<span className="dispatch-code__tag">return</span>{" ("}</span><span className="dispatch-code-line">{"    <>"}</span><span className="dispatch-code-line">{"      {children}"}</span><span className="dispatch-code-line">{"      <Droplert"}</span><span className="dispatch-code-line">{"        siteId="}<span className="dispatch-code__string">&quot;site_public_id&quot;</span></span><span className="dispatch-code-line">{"        apiUrl="}<span className="dispatch-code__string">&quot;https://droplert.abstergo.dev&quot;</span></span><span className="dispatch-code-line">{"      />"}</span><span className="dispatch-code-line">{"    </>"}</span><span className="dispatch-code-line">{"  )"}</span><span className="dispatch-code-line">{"}"}</span></code></pre>
                <div className="dispatch-code-block__foot">
                  <span>FEED / PUBLIC READ</span>
                  <span>NO BROWSER SECRET</span>
                </div>
              </div>
            </div>

            <div className="dispatch-polling-note">
              <ShieldCheck aria-hidden="true" size={17} />
              <p><strong>ETag polling, without the ceremony.</strong> Visible pages fetch on load and revalidate at roughly 15-minute intervals. An unchanged feed returns <code>304 Not Modified</code>; a changed revision delivers the next record. No permanent socket is required.</p>
            </div>
          </div>
        </section>

        <section className="dispatch-final" aria-labelledby="final-title">
          <div className="landing-frame dispatch-final__inner">
            <div>
              <p className="dispatch-kicker"><span className="dispatch-kicker__mark" aria-hidden="true" /> READY WHEN THE MESSAGE IS</p>
              <h2 className="dispatch-final__title" id="final-title">Put the next product moment on the record.</h2>
            </div>
            <Link className="dispatch-button dispatch-button--cobalt" href="/getstarted">
              Open your workspace <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="dispatch-footer">
        <div className="landing-frame dispatch-footer__inner">
          <div className="dispatch-footer__identity">
            <DroplertMark compact className="dispatch-brand" />
            <span>DL / DURABLE CAMPAIGNS FOR THE WEB</span>
          </div>
          <div className="dispatch-footer__links">
            <Link href="/getstarted">Sign in</Link>
            <Link href="/dashboard">Dashboard</Link>
            <span><ShieldCheck aria-hidden="true" size={13} /> VERIFIED HTTP FEED</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { HouseIcon } from "@phosphor-icons/react/dist/ssr/House"

import { DroplertMark } from "@/components/brand/DroplertMark"
import { PrimaryCta } from "@/components/landing/PrimaryCta"
import { LANDING_INTERACTIVE, LANDING_MOTION } from "@/components/landing/constants"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home", current: true },
  { href: "#benefits", label: "Product", current: false },
  { href: "#how-it-works", label: "How it works", current: false },
  { href: "#faq", label: "FAQ", current: false },
] as const

const FOCUSABLE = "a[href], button:not([disabled])"

export function IslandNav() {
  const [open, setOpen] = useState(false)
  const overlayId = useId()
  const overlayRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const overlay = overlayRef.current
    const trigger = triggerRef.current
    if (!overlay) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const getFocusable = () => Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE))

    getFocusable()[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== "Tab") return
      const items = getFocusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
      trigger?.focus()
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto mx-auto mt-6 flex w-max items-center gap-3 rounded-full border border-white/[0.1] bg-[#030712]/85 px-3 py-2 backdrop-blur-xl",
            LANDING_MOTION,
          )}
        >
          <DroplertMark compact className="text-white" />

          <div className="hidden items-center gap-4 md:flex">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "text-sm font-semibold",
                    LANDING_INTERACTIVE,
                    link.current ? "text-white" : "text-[#8b949e] hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold text-[#8b949e] hover:text-white",
                    LANDING_INTERACTIVE,
                  )}
                >
                  {link.label}
                </a>
              ),
            )}
            <Link
              href="/getstarted"
              className={cn("inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors", LANDING_MOTION)}
            >
              Get started
            </Link>
          </div>

          <button
            ref={triggerRef}
            type="button"
            className={cn(
              "relative grid size-8 place-items-center rounded-full text-white",
              LANDING_INTERACTIVE,
              "hover:bg-white/[0.06]",
            )}
            aria-expanded={open}
            aria-controls={overlayId}
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-px w-4 bg-white",
                LANDING_MOTION,
                open ? "rotate-45" : "-translate-y-1",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-px w-4 bg-white",
                LANDING_MOTION,
                open ? "-rotate-45" : "translate-y-1",
              )}
            />
          </button>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id={overlayId}
        role="dialog"
        aria-modal={open || undefined}
        aria-label="Site navigation"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-40 bg-[#030712]/90 backdrop-blur-3xl",
          LANDING_MOTION,
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex min-h-full flex-col justify-center px-8 py-24">
          <ul className="mx-auto flex w-full max-w-[680px] flex-col gap-6">
            {NAV_LINKS.map((link, index) => {
              const delay = ["delay-100", "delay-150", "delay-200", "delay-300"][index]
              const className = cn(
                "flex items-center gap-3 text-3xl font-semibold text-white md:text-4xl",
                LANDING_INTERACTIVE,
                delay,
                open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
              )

              const inner = (
                <>
                  {link.current ? <HouseIcon aria-hidden="true" size={28} weight="regular" /> : null}
                  <span>{link.label}</span>
                </>
              )

              return (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      aria-current={link.current ? "page" : undefined}
                      className={className}
                      onClick={close}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <a href={link.href} className={className} onClick={close}>
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
            <li>
              <Link
                href="/getstarted"
                onClick={close}
                className={cn(
                  "inline-block text-3xl font-semibold text-white/70 md:text-4xl",
                  LANDING_INTERACTIVE,
                  "delay-500",
                  open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
                )}
              >
                Sign in
              </Link>
            </li>
            <li
              className={cn(
                "pt-4",
                LANDING_MOTION,
                "delay-700",
                open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
              )}
            >
              <PrimaryCta onClick={close} />
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

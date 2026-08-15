import Link from "next/link"

import { DroplertMark } from "@/components/brand/DroplertMark"
import { PrimaryCta } from "@/components/landing/PrimaryCta"
import { LANDING_INTERACTIVE } from "@/components/landing/constants"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="landing-page flex min-h-screen flex-col bg-black text-white">
      <a className="landing-skip" href="#content">
        Skip to content
      </a>
      <header className="px-6 py-8 md:px-8">
        <DroplertMark />
      </header>
      <main id="content" className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center px-6 pb-24 md:px-8">
        <p className="text-sm font-semibold text-white/60">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-balance md:text-5xl">
          This page is not on the route.
        </h1>
        <p className="mt-6 text-lg text-[#9b9b9b] text-pretty">
          The URL does not match a Droplert page. Go home, or create a workspace if you meant to
          publish.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <PrimaryCta />
          <Link
            href="/"
            className={cn(
              "text-base font-semibold text-white hover:text-[#9b9b9b]",
              LANDING_INTERACTIVE,
            )}
          >
            Back to Droplert
          </Link>
        </div>
      </main>
    </div>
  )
}

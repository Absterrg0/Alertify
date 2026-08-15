"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { LANDING_MOTION } from "@/components/landing/constants"

const MUTED = "rgba(255, 255, 255, 0.3)"
const FULL = "#ffffff"

const TAGLINE_LINES = [
  ["The", "message", "stays", "on", "the", "page"],
  ["after", "the", "tab", "is", "closed."],
] as const

const TAGLINE_WORDS = TAGLINE_LINES.flatMap((words, lineIndex) =>
  words.map((word, wordIndex) => ({
    word,
    lineIndex,
    lastInLine: wordIndex === words.length - 1,
  })),
).map((item, index) => ({ ...item, index }))

export function TaglineReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRefs = useRef<Array<HTMLSpanElement | null>>(Array(TAGLINE_WORDS.length).fill(null))

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const words = wordRefs.current.filter((node): node is HTMLSpanElement => node !== null)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      for (const word of words) word.style.color = FULL
      return
    }

    let ticking = false
    let listening = false

    const update = () => {
      ticking = false
      const trigger = window.innerHeight * 0.58
      for (const word of words) {
        const rect = word.getBoundingClientRect()
        const readingOffset = (rect.left / Math.max(window.innerWidth, 1)) * 48
        const crossed = rect.top + rect.height / 2 + readingOffset < trigger
        word.style.color = crossed ? FULL : MUTED
      }
    }

    const onScrollOrResize = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const attach = () => {
      if (listening) return
      listening = true
      window.addEventListener("scroll", onScrollOrResize, { passive: true })
      window.addEventListener("resize", onScrollOrResize)
      onScrollOrResize()
    }

    const detach = () => {
      if (!listening) return
      listening = false
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) attach()
        else detach()
      },
      { rootMargin: "20% 0px 20% 0px" },
    )

    observer.observe(section)
    return () => {
      observer.disconnect()
      detach()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Product tagline"
      className="bg-black px-4 py-24 sm:px-6 md:px-8"
    >
      <div className="mx-auto max-w-[680px]">
        <p className="text-4xl font-semibold leading-tight text-balance md:text-5xl lg:text-6xl">
          {TAGLINE_WORDS.map((item) => (
            <span key={item.index}>
              <span
                ref={(node) => {
                  wordRefs.current[item.index] = node
                }}
                className={cn("inline-block", LANDING_MOTION)}
                style={{ color: MUTED }}
              >
                {item.word}
              </span>
              {item.lastInLine ? <br /> : " "}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

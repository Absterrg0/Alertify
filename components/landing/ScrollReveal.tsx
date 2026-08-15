"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "motion-reduce:translate-y-0 motion-reduce:blur-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? "translate-y-0 blur-0 opacity-100" : "translate-y-16 blur-md opacity-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

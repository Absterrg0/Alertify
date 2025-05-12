"use client"
import { useState, useRef } from "react"
import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const CardHoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string
    description: string
    icon?: React.ReactNode
  }[]
  className?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)


  return (
    <div ref={containerRef} className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative z-10 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 p-8 transition-all duration-300 hover:shadow-xl">
            <div className="space-y-4">
              {item.icon && <div className="text-teal-500 dark:text-teal-400">{item.icon}</div>}
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          </div>
          {hoveredIndex === idx && (
            <motion.div
              className="absolute inset-0 z-0 bg-gradient-to-r from-teal-500 to-purple-600 opacity-70 blur-lg"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}


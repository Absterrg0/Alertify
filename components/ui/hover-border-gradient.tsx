"use client"
import type React from "react"
import { ElementType, ComponentPropsWithoutRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Define generic polymorphic component props
type HoverBorderGradientProps<T extends ElementType> = {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  as?: T
  from?: string
  to?: string
  fromOpacity?: number
  toOpacity?: number
} & ComponentPropsWithoutRef<T>

export const HoverBorderGradient = <T extends ElementType = "div">({
  children,
  containerClassName,
  className,
  as,
  from = "from-teal-500",
  to = "to-purple-600",
  fromOpacity = 1,
  toOpacity = 1,
  ...props
}: HoverBorderGradientProps<T>) => {
  const [hovered, setHovered] = useState(false)
  
  // Use the provided component type or default to div
  const Component = as || "div"

  return (
    <div
      className={cn("relative p-[1px] group/border", containerClassName)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute inset-0 rounded-[inherit] opacity-0 group-hover/border:opacity-100",
          `bg-gradient-to-r ${from} ${to}`,
        )}
        style={
          {
            "--tw-gradient-from-opacity": fromOpacity,
            "--tw-gradient-to-opacity": toOpacity,
          } as React.CSSProperties
        }
      />
      <Component {...props} className={cn("relative", className)}>
        {children}
      </Component>
    </div>
  )
}
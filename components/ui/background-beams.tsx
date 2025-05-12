"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({
  className,
  beamColor1 = "from-teal-500/30",
  beamColor2 = "from-purple-600/30",
}: {
  className?: string;
  beamColor1?: string;
  beamColor2?: string;
}) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }
    }
    
    const element = ref.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove)
    }
    
    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])
  
  return (
    <div 
      ref={ref}
      className={cn(
        "absolute pointer-events-none inset-0 overflow-hidden",
        className
      )}
    >
      <motion.div 
        className={cn(
          "absolute inset-0 opacity-50",
          "bg-gradient-to-r from-transparent via-transparent to-transparent"
        )}
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Primary beam */}
      <motion.div
        className={cn(
          "absolute opacity-70 blur-3xl w-96 h-96 rounded-full",
          beamColor1,
          "via-transparent to-transparent bg-gradient-to-r"
        )}
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
          duration: 0.3,
        }}
      />
      
      {/* Secondary beam */}
      <motion.div
        className={cn(
          "absolute opacity-70 blur-3xl w-96 h-96 rounded-full",
          beamColor2,
          "via-transparent to-transparent bg-gradient-to-r"
        )}
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 250,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 90,
          duration: 0.4,
        }}
      />
      
      {/* Static beams for initial visual interest */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
      
      {/* Overlay gradient to add depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/5 dark:to-white/5" />
    </div>
  )
}
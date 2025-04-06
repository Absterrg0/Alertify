"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const TextRevealCard = ({
  preTitle = "Introducing",
  title = "Your Product",
  revealTitle = "Amazing Features",
  description = "Engage your users with a powerful and customizable solution.",
  ctaText = "Get Started",
  ctaLink = "/get-started",
  secondaryText = "Watch Demo",
  secondaryLink = "#demo",
  className,
}: {
  preTitle?: string
  title?: string
  revealTitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  secondaryText?: string
  secondaryLink?: string
  className?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    
    // Add a subtle parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const { clientX, clientY } = e
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      
      const x = (clientX - left) / width - 0.5
      const y = (clientY - top) / height - 0.5
      
      const elements = containerRef.current.querySelectorAll('.parallax-element')
      elements.forEach((el) => {
        const intensity = Number((el as HTMLElement).dataset.intensity) || 20
        const translateX = x * intensity
        const translateY = y * intensity
        
        ;(el as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`
      })
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950 py-20 md:py-32",
        className
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 dark:bg-teal-900/30 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 dark:bg-pink-900/20 rounded-full blur-3xl opacity-20" style={{ animationDelay: '3s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] dark:bg-grid-white/[0.02]" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-noise-pattern opacity-20 dark:opacity-10" />
      </div>
      
      <div 
        ref={containerRef}
        className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center"
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 to-purple-500/10 dark:from-teal-500/20 dark:to-purple-500/20 text-sm font-medium text-teal-700 dark:text-teal-300"
        >
          <span className="parallax-element" data-intensity="5">{preTitle}</span>
        </motion.div>
        
        {/* Main Title with Reveal Effect */}
        <div 
          className="relative mb-6 max-w-4xl mx-auto perspective-1000"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence>
            {!isHovered && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-5xl md:text-7xl font-bold tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-purple-600 dark:from-teal-400 dark:to-purple-400 parallax-element" data-intensity="10">
                  {title}
                </span>
              </motion.h1>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isHovered && (
              <motion.h1
                initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="absolute inset-0 text-5xl md:text-7xl font-bold tracking-tight flex items-center justify-center"
              >
                <span className="text-white parallax-element" data-intensity="15">
                  {revealTitle}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-600 rounded-2xl -z-10 parallax-element" data-intensity="5"></div>
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto parallax-element"
          data-intensity="8"
        >
          {description}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center parallax-element"
          data-intensity="12"
        >
          <Link 
            href={ctaLink}
            className="group relative px-8 py-3 rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center">
              {ctaText} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </Link>
          
          <Link 
            href={secondaryLink}
            className="px-8 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center justify-center"
          >
            {secondaryText}
          </Link>
        </motion.div>
        
        {/* Floating Elements */}
        {isMounted && (
          <>
            <div className="absolute top-1/3 left-10 md:left-20 w-20 h-20 parallax-element" data-intensity="30">
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-md border border-teal-500/20 dark:border-teal-500/30 bg-teal-500/5 dark:bg-teal-500/10"
              />
            </div>
            <div className="absolute bottom-1/4 right-10 md:right-20 w-32 h-32 parallax-element" data-intensity="25">
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border border-purple-500/20 dark:border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10"
              />
            </div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 parallax-element" data-intensity="15">
              <motion.div 
                initial={{ y: 0 }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full backdrop-blur-md bg-white/20 dark:bg-white/5 rotate-45"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Define styles for global CSS
const globalCss = `
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.perspective-1000 {
  perspective: 1000px;
}

.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.bg-noise-pattern {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
`;

// You'll need to add this to your global.css file or similar
export { globalCss };
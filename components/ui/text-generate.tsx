"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string
  className?: string
}) => {
  const [renderedText, setRenderedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (renderedText.length < words.length) {
        setRenderedText(words.slice(0, renderedText.length + 1))
      } else {
        setIsComplete(true)
      }
    }, 20)

    return () => clearTimeout(timeout)
  }, [renderedText, words])

  return (
    <div className={cn("font-bold", className)}>
      <motion.div className="inline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {renderedText}
        {!isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="inline-block ml-1 h-4 w-1 bg-teal-500 dark:bg-teal-400"
          />
        )}
      </motion.div>
    </div>
  )
}


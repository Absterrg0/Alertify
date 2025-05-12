"use client"

import { useState } from "react"
import Image from "next/image"

interface PresetCardProps {
  id: string
  name: string
  backgroundColor: string
  textColor: string
  borderColor: string
  logoUrl?: string
  isGradient?: boolean
  startColor?: string
  endColor?: string
  direction?: string
  isSelected: boolean
  onClick: () => void
}

export function PresetCard({
  id,
  name,
  backgroundColor,
  textColor,
  borderColor,
  logoUrl,
  isGradient = false,
  startColor,
  endColor,
  direction = "to right",
  isSelected,
  onClick,
}: PresetCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const backgroundStyle =
    isGradient && startColor && endColor
      ? { background: `linear-gradient(${direction}, ${startColor}, ${endColor})` }
      : { backgroundColor }

  return (
    <div
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all duration-300 border-2
        ${
          isSelected
            ? "border-teal-500 dark:border-teal-400 shadow-lg scale-105"
            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
        }
      `}
      style={backgroundStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center justify-center h-24">
        <h4 className="font-medium text-center" style={{ color: textColor }}>
          {name}
        </h4>
        {logoUrl && (
          <div className="h-12 w-12 mt-2 relative">
            <Image src={logoUrl || "/placeholder.svg"} alt={name} fill className="object-contain" />
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full p-1 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            />
          </svg>
        </div>
      )}

      {isHovered && !isSelected && (
        <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium" style={{ color: textColor }}>
            Select
          </span>
        </div>
      )}
    </div>
  )
}


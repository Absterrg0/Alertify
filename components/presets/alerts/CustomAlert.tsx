import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface AlertProps {
  title: string
  description: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
  background?: string // New prop for custom background
}

const CustomAlert = ({
  title,
  description,
  onClose,
  autoClose = true,
  duration = 5000,
  background = "linear-gradient(to right, #FF512F, #F09819)" // Default gradient
}: AlertProps) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto rounded-lg p-4 shadow-lg text-white transition-all duration-300"
      style={{ background }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-1 truncate">{title}</h3>
          <p className="text-xs opacity-90 line-clamp-2">{description}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close alert"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default CustomAlert

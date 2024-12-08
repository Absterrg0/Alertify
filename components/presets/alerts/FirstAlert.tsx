import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const alertVariants = cva(
  "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto rounded-lg border p-4 shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-500 text-blue-700",
        success: "bg-green-50 border-green-500 text-green-700",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
        error: "bg-red-50 border-red-500 text-red-700"
      }
    },
    defaultVariants: {
      variant: "info"
    }
  }
)

interface AlertProps extends VariantProps<typeof alertVariants> {
  title: string
  description: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const Alert = ({
  title,
  description,
  variant,
  onClose,
  autoClose = true,
  duration = 5000
}: AlertProps) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  return (
    <div className={alertVariants({ variant })}>
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

export default Alert
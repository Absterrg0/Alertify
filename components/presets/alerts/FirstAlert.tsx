'use client'

import * as React from 'react'
import { X, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  onClose?: () => void
  backgroundColor: string
  textColor: string
  borderColor: string
  preview: boolean
}

const MyAlert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, title, preview, description, textColor, borderColor, onClose, backgroundColor, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      // If not preview, set a timer to close the alert after 100000ms (100 seconds)
      if (!preview) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, 100000)

        return () => clearTimeout(timer)
      }
    }, [onClose, preview])

    return (
      <div>
        {/* The alert always renders */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={ref}
              role="alert"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            //@ts-expect-error Motion div doesnt have a classname prop i guess?
            className={cn(
                "transform -translate-x-1/2 w-full max-w-md mx-auto z-50 rounded-lg p-4 shadow-md",
                "flex items-start ",
                className
              )}
              style={{ background: backgroundColor, borderColor: borderColor }}
              {...props}
            >
              <div className="flex-1">
                <div className="flex items-center justify-center mb-3">
                  <Bell style={{ color: textColor }} className="mr-2" />
                  <h5
                    className="font-medium leading-none tracking-tight"
                    style={{ color: textColor }}
                  >
                    {title}
                  </h5>
                </div>
                {description && (
                  <div
                    style={{ color: textColor }}
                    className="text-sm text-center mt-2 opacity-90"
                  >
                    {description}
                  </div>
                )}
              </div>
              {onClose && (
                <button
                  onClick={() => {
                    setIsVisible(false);
                    onClose();
                  }}
                  className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

MyAlert.displayName = "Alert"

export { MyAlert }

'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import CustomAlert from '@/components/presets/alerts/CustomAlert'
import GradientColorPicker from '@/components/ui/gradient-color-picker'

export default function Home() {
  const [activeAlert, setActiveAlert] = useState(false)
  const [alertGradient, setAlertGradient] = useState('linear-gradient(to right, #FF512F, #F09819)')

  const handleShowAlert = () => {
    setActiveAlert(true)
  }

  const handleCloseAlert = () => {
    setActiveAlert(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
      <h1 className="text-2xl font-bold">Custom Alert with Gradient Picker</h1>

      <GradientColorPicker onColorChange={setAlertGradient} />

      <button
        onClick={handleShowAlert}
        className="rounded-md px-4 py-2 font-semibold text-white bg-gray-700 hover:bg-gray-800"
      >
        Show Alert
      </button>

      <AnimatePresence>
        {activeAlert && (
          <CustomAlert
            title="Custom Alert"
            description="This alert uses a custom gradient!"
            background={alertGradient} // Pass the custom gradient
            onClose={handleCloseAlert}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

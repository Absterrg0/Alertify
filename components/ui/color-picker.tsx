'use client'

import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  width?: string
  height?: string
  className?: string // Make className optional
  onColorChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ width, height, className, onColorChange }) => {
  const [color, setColor] = useState('#E0F2FE')

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onColorChange(newColor)
  }

  return (
    <div className={`space-y-4 ${className}`}> {/* Apply className here */}
      <div className="flex justify-center">
        <HexColorPicker
          style={{
            width: width === "auto" ? "100%" : width,  // Full width if "auto"
            height: height === "auto" ? "300px" : height, // Default height of 300px if "auto"
          }}
          color={color}
          onChange={handleColorChange}
        />
      </div>
    </div>
  )
}

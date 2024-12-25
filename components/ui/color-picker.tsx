'use client'

import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  onColorChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [color, setColor] = useState('#E0F2FE')

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onColorChange(newColor)
  }


  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <HexColorPicker style={{width:"400px",
          height:"220px"
        }}  color={color} onChange={handleColorChange} />
      </div>

    </div>
  )
}


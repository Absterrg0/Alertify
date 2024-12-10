'use client'

import React, { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { Label } from '@/components/ui/label'

interface ColorPickerProps {
  onColorChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [color, setColor] = useState('#E0F2FE')
  const [textColor, setTextColor] = useState('#000000')

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onColorChange(newColor)
  }

  const toggleTextColor = () => {
    setTextColor((prevColor) => (prevColor === '#000000' ? '#FFFFFF' : '#000000'))
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


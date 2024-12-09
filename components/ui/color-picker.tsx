'use client'

import React, { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ColorPickerProps {
  onColorChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [color, setColor] = useState('#000000')
  const [textColor, setTextColor] = useState('#FFFFFF')

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onColorChange(newColor)
  }

  const toggleTextColor = () => {
    setTextColor((prevColor) => (prevColor === '#FFFFFF' ? '#000000' : '#FFFFFF'))
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Color Picker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="color-input">Color:</Label>
          <HexColorInput
            id="color-input"
            color={color}
            onChange={handleColorChange}
            prefixed
            className="w-28 px-2 py-1 border rounded"
          />
        </div>
        <div
          className="w-full h-12 rounded flex items-center justify-center"
          style={{ backgroundColor: color, color: textColor }}
        >
          Preview Text
        </div>
        <Button onClick={toggleTextColor} className="w-full">
          Toggle Text Color
        </Button>
      </CardContent>
    </Card>
  )
}


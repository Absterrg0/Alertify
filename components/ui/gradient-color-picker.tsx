'use client'

import React, { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColorPickerProps {
  onColorChange: (gradient: string) => void
}

const gradientPresets = {
  sunset: ['#FF512F', '#F09819'],
  ocean: ['#2193b0', '#6dd5ed'],
  purple: ['#834d9b', '#d04ed6'],
  forest: ['#134E5E', '#71B280'],
  cherry: ['#EB3349', '#F45C43']
}

export const GradientColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const [startColor, setStartColor] = useState('#2193b0')
  const [endColor, setEndColor] = useState('#6dd5ed')
  const [direction, setDirection] = useState('to right')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  const handlePresetSelect = (preset: keyof typeof gradientPresets) => {
    setStartColor(gradientPresets[preset][0])
    setEndColor(gradientPresets[preset][1])
    updateGradient(gradientPresets[preset][0], gradientPresets[preset][1], direction)
  }

  const updateGradient = (start: string, end: string, dir: string) => {
    const gradient = `linear-gradient(${dir}, ${start}, ${end})`
    onColorChange(gradient)
  }

  const handleDirectionChange = (newDirection: string) => {
    const dir = newDirection === 'horizontal' ? 'to right' : 'to bottom'
    setDirection(dir)
    updateGradient(startColor, endColor, dir)
  }

  const toggleTextColor = () => {
    setTextColor(prev => prev === '#FFFFFF' ? '#000000' : '#FFFFFF')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Preset Gradients</Label>
        <Select onValueChange={handlePresetSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a preset" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(gradientPresets).map(preset => (
              <SelectItem key={preset} value={preset}>
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Direction</Label>
        <Select onValueChange={handleDirectionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Start Color</Label>
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowStartPicker(!showStartPicker)}
            style={{ backgroundColor: startColor }}
          >
            {startColor}
          </Button>
          {showStartPicker && (
            <div className="absolute z-10 mt-2">
              <HexColorPicker 
                color={startColor} 
                onChange={(color) => {
                  setStartColor(color)
                  updateGradient(color, endColor, direction)
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>End Color</Label>
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowEndPicker(!showEndPicker)}
            style={{ backgroundColor: endColor }}
          >
            {endColor}
          </Button>
          {showEndPicker && (
            <div className="absolute z-10 mt-2">
              <HexColorPicker 
                color={endColor} 
                onChange={(color) => {
                  setEndColor(color)
                  updateGradient(startColor, color, direction)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


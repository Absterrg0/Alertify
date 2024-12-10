'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '@/components/ui/color-picker'
import { Alert } from '@/components/presets/alerts/FirstAlert'
export default function AlertDemo() {
  const [showAlert, setShowAlert] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('#3B82F6')
  const [title, setTitle] = useState('Alert Title')
  const [description, setDescription] = useState('This is a description of the alert. It provides more context and information.')

  const handleShowAlert = () => {
    setShowAlert(true)
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">Alert Demo with Color Picker</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Alert Content</h2>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter alert title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter alert description"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Background Color</h2>
            <ColorPicker onColorChange={setBackgroundColor} />
          </div>
        </div>
        
        <Button onClick={handleShowAlert} className="w-full">Show Alert</Button>
      </div>
      
      {showAlert && (
        <Alert
          title={title}
          description={description}
          backgroundColor={backgroundColor}
          onClose={() => setShowAlert(false)}
          className='border-amber-900 border'
        />
      )}
    </div>
  )
}


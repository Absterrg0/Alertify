'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '@/components/ui/color-picker'
import { AlertDialog } from '@/components/presets/alert-dialog/FirstAlertDialog'
export default function AlertDialogDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('#3B82F6')
  const [title, setTitle] = useState('Alert Dialog Title')
  const [description, setDescription] = useState('This is a description of the alert dialog. It provides more context and information.')

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">Alert Dialog Demo with Color Picker</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Alert Dialog Content</h2>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter alert dialog title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter alert dialog description"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Background Color</h2>
            <ColorPicker onColorChange={setBackgroundColor} />
          </div>
        </div>
        
        <Button onClick={handleOpenDialog} className="w-full">Open Alert Dialog</Button>
      </div>
      {isDialogOpen&&(
              <AlertDialog
        onClose={()=>setIsDialogOpen(false)}
        title={title}
        description={description}
        backgroundColor={backgroundColor}
      />

      )}
      

    </div>
  )
}


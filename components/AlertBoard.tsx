'use client'

import * as React from 'react'
import { AlertCircle, Bell, MessageSquare, Lock, Waves, Droplet, Shell, Anchor, Play, Type, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MyAlert } from './presets/alerts/FirstAlert'
import { MyAlertDialog } from './presets/alert-dialog/FirstAlertDialog'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { ColorPicker } from './ui/color-picker'
import { Toast } from './presets/toasts/FirstToast'
import { SelectTrigger, SelectValue, SelectItem, SelectContent, Select } from './ui/select'

type NotificationType = 'alert' | 'alert-dialog' | 'toast'
type StyleType = 'native' | 'gradient' | 'logo'

const isPremium = true

export default function EnhancedAlertBoard() {
  const [selectedType, setSelectedType] = React.useState<NotificationType>('alert')
  const [selectedStyle, setSelectedStyle] = React.useState<StyleType>('native')
  const [title, setTitle] = React.useState('Oceanic Notification')
  const [startColor, setStartColor] = React.useState('#3B82F6')
  const [endColor, setEndColor] = React.useState('#2563EB')
  const [gradientDirection, setGradientDirection] = React.useState('to right')
  const [description, setDescription] = React.useState('Dive into the depths of our new features!')
  const [backgroundColor, setBackgroundColor] = React.useState('#E0F2FE')
  const [showPreview, setShowPreview] = React.useState(false)
  const [textColor, setTextColor] = React.useState('black')
  const [matchBorderColor, setMatchBorderColor] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('start')

  const toggleTextColor = () => {
    setTextColor(prevColor => prevColor === 'black' ? 'white' : 'black')
  }

  const matchColor = () => {
    setMatchBorderColor((prevState) => !prevState)
  }

  const gradientBackground = `linear-gradient(${gradientDirection}, ${startColor}, ${endColor})`

  const handlePreview = () => {
    setShowPreview(true)
  }

  const renderPreview = () => {
    const commonProps = {
      title,
      description,
      backgroundColor: selectedStyle === 'native' ? backgroundColor : gradientBackground,
      textColor,
      borderColor: matchBorderColor ? backgroundColor : 'transparent',
      onClose: () => {},
    }

    switch (selectedType) {
      case 'alert':
        return (
          <MyAlert {...commonProps} className="pointer-events-none border shadow-lg" />
        )
      case 'alert-dialog':
        return (
          <div className="flex justify-center items-center">
            <MyAlertDialog
              {...commonProps}
              isOpen={false}
              preview={true}
              className="pointer-events-none max-w-md w-full"
            />
          </div>
        )
      case 'toast':
        return (
          <div className="flex justify-end">
            <Toast {...commonProps} isOpen={false} preview={true} className="pointer-events-none" />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden p-8">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] bg-repeat"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto">
        <div className="flex items-center justify-center mb-12 space-x-4">
          <Waves className="h-12 w-12 text-cyan-400" />
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Droplert
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Notification Types */}
            <Card className="bg-zinc-800/50 backdrop-blur-lg border-zinc-700/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shell className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-semibold text-white">Notification Types</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'alert', icon: AlertCircle, label: 'Surface Alert', description: 'Floats at the top' },
                    { type: 'alert-dialog', icon: MessageSquare, label: 'Deep Dive', description: 'Full-screen experience' },
                    { type: 'toast', icon: Bell, label: 'Bubble Toast', description: 'Quick floating message' },
                  ].map(({ type, icon: Icon, label, description }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as NotificationType)}
                      className={cn(
                        "w-full p-4 rounded-lg transition-all duration-200 border border-zinc-600/50",
                        selectedType === type 
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                          : "bg-zinc-700/50 hover:bg-zinc-600/50 text-white"
                      )}
                    >
                      <div className="flex items-start">
                        <Icon className="h-5 w-5 mt-0.5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{label}</div>
                          <div className="text-sm opacity-80">{description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Style Options */}
            <Card className="bg-zinc-800/50 backdrop-blur-lg border-zinc-700/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Droplet className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-semibold text-white">Style Options</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'native', label: 'Calm Waters', description: 'Clean, minimal design' },
                    { type: 'gradient', label: 'Deep Ocean', description: 'Rich gradient effect', premium: true },
                    { type: 'logo', label: 'Coral Theme', description: 'Brand-focused style', premium: true },
                  ].map(({ type, label, description, premium }) => (
                    <button
                      key={type}
                      onClick={() => isPremium || !premium ? setSelectedStyle(type as StyleType) : null}
                      disabled={premium && !isPremium}
                      className={cn(
                        "w-full p-4 rounded-lg transition-all duration-200 border border-zinc-600/50",
                        selectedStyle === type 
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                          : "bg-zinc-700/50 hover:bg-zinc-600/50 text-white",
                        premium && !isPremium && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-left">
                          <div className="font-medium">{label}</div>
                          <div className="text-sm opacity-80">{description}</div>
                        </div>
                        {premium && !isPremium && <Lock className="h-5 w-5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="bg-zinc-800/50 backdrop-blur-lg border-zinc-700/50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <Anchor className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-semibold text-white">Customize Your Message</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Message Configuration */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-lg text-cyan-100">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter notification title"
                        className="mt-2 bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-lg text-cyan-100">Content</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter notification message"
                        className="mt-2 bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-gray-400 h-32"
                      />
                    </div>
                    {selectedStyle === 'gradient' && (
                      <div className="mt-6 space-y-3">
                        <Label className='text-lg text-cyan-100'>Gradient Direction</Label>
                        <Select
                          value={gradientDirection}
                          onValueChange={setGradientDirection}
                        >
                          <SelectTrigger className='text-lg text-cyan-100 bg-zinc-700/50 border-zinc-600/50'>
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to right">Horizontal</SelectItem>
                            <SelectItem value="to bottom">Vertical</SelectItem>
                            <SelectItem value="45deg">Diagonal ↘</SelectItem>
                            <SelectItem value="-45deg">Diagonal ↗</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Color Configuration */}
                  <div className="space-y-6">
                    {selectedStyle === 'native' && (
                      <>
                        <div className="space-y-8">
                          <div className="flex items-center justify-between px-6">
                            <h3 className="text-lg font-medium text-cyan-100">Background Color</h3>
                          </div>

                          {/* Color Picker */}
                          <div className="flex justify-center">
                            <ColorPicker onColorChange={setBackgroundColor} />
                          </div>
                          <div className='flex justify-between w-full'>
                            <Button
                              onClick={toggleTextColor}
                              className="flex items-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200"
                            >
                              <Type className="mr-2" />
                              Toggle Text Color
                            </Button>
                            <Button
                              onClick={matchColor}
                              className="flex items-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200"
                            >
                              Toggle Border
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Gradient Theme Section */}
                    {selectedStyle === 'gradient' && (
                      <div>
                        <h3 className="text-lg font-medium text-cyan-100 mb-4">Gradient Theme</h3>
                        <div className="flex border-b border-zinc-600 mb-4">
                          <button
                            className={`py-2 px-4 ${
                              activeTab === 'start' ? 'border-b-2 border-cyan-500 text-cyan-100' : 'text-gray-400'
                            }`}
                            onClick={() => setActiveTab('start')}
                          >
                            Start Color
                          </button>
                          <button
                            className={`py-2 px-4 ${
                              activeTab === 'end' ? 'border-b-2 border-cyan-500 text-cyan-100' : 'text-gray-400'
                            }`}
                            onClick={() => setActiveTab('end')}
                          >
                            End Color
                          </button>
                        </div>
                        <div className="mt-4">
                          {activeTab === 'start' && <ColorPicker onColorChange={setStartColor} />}
                          {activeTab === 'end' && <ColorPicker onColorChange={setEndColor} />}
                        </div>
                        <div className="flex justify-between mt-6">
                          <Button
                            onClick={toggleTextColor}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200"
                          >
                            <Type className="mr-2" />
                            Toggle Text Color
                          </Button>
                          <Button
                            onClick={matchColor}
                            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200"
                          >
                            Toggle Border
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-cyan-100">Preview</h3>
                    <Button
                      onClick={handlePreview}
                      variant="outline"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white border-none transition-colors duration-200"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Show Preview
                    </Button>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                    {renderPreview()}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handlePreview}
                  className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 transition-colors duration-200"
                >
                  <Waves className="mr-2 h-5 w-5" />
                  Select the websites
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}


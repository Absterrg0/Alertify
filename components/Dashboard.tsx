'use client'

import * as React from 'react'
import { AlertCircle, Bell, MessageSquare, Lock, Waves, Droplet, Shell, Anchor, Play, Type } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert } from './presets/alerts/FirstAlert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { GradientColorPicker } from './ui/gradient-color-picker'
import { ColorPicker } from './ui/color-picker'

type NotificationType = 'alert' | 'alert-dialog' | 'toast'
type StyleType = 'native' | 'gradient' | 'logo'

const isPremium = true

export default function OceanicNotificationDashboard() {
  const [selectedType, setSelectedType] = React.useState<NotificationType>('alert')
  const [selectedStyle, setSelectedStyle] = React.useState<StyleType>('native')
  const [title, setTitle] = React.useState('Oceanic Notification')
  const [description, setDescription] = React.useState('Dive into the depths of our new features!')
  const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false)
  const [calmWatersColor, setCalmWatersColor] = React.useState('#E0F2FE')
  const [gradientColor, setGradientColor] = React.useState('linear-gradient(135deg, #1a4b6e, #38bdf8)')
  const [showPreview, setShowPreview] = React.useState(false)
  const [textColor, setTextColor] = React.useState('black')
  const [borderColor,setBorderColor]=React.useState(calmWatersColor)
  const [matchBorderColor,setMatchBorderColor]=React.useState(false)
  const { toast } = useToast()

  const toggleTextColor = () => {
    setTextColor(prevColor => prevColor === 'black' ? 'white' : 'black')
  }

  const matchColor = () => {
    setMatchBorderColor((prevState) => {
      const newState = !prevState;
      setBorderColor(newState ? calmWatersColor: 'black');
      return newState;
    });
  };
  
  const getStyleClasses = (style: StyleType) => {
    switch (style) {
      case 'gradient':
        return gradientColor
      case 'logo':
        return 'bg-blue-600 text-white'
      default:
        return `background-color: ${calmWatersColor}; color: ${textColor};`
    }
  }

  const handlePreview = () => {
    switch (selectedType) {
      case 'alert':
        setShowPreview(true)
        setTimeout(() => setShowPreview(false), 3000)
        break
      case 'toast':
        toast({
          title,
          description,
          className: cn("backdrop-blur-md", getStyleClasses(selectedStyle)),
        })
        break
      case 'alert-dialog':
        setIsAlertDialogOpen(true)
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-cyan-900 to-blue-900 relative overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/waves-pattern.svg')] opacity-10 animate-wave"></div>
        <div className="absolute inset-0 bg-[url('/bubbles-pattern.svg')] opacity-5 animate-float"></div>
      </div>

      {/* Preview Alert */}
      {showPreview && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert
            title={title}
            description={description}
            backgroundColor={calmWatersColor}
            borderColor={borderColor}
            textColor={textColor}
            onClose={() => setShowPreview(false)}
            className="border-amber-900 border shadow-lg"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12 space-x-4">
          <Waves className="h-12 w-12 text-cyan-400" />
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Oceanic Notifications
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Notification Types */}
            <Card className="bg-white/5 backdrop-blur-lg border-cyan-500/20 overflow-hidden">
              <div className="p-6">
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
                        "w-full p-4 rounded-lg transition-all duration-200 border border-cyan-500/20",
                        selectedType === type 
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                          : "bg-white/5 hover:bg-white/10 text-white"
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
              </div>
            </Card>

            {/* Style Options */}
            <Card className="bg-white/5 backdrop-blur-lg border-cyan-500/20">
              <div className="p-6">
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
                        "w-full p-4 rounded-lg transition-all duration-200 border border-cyan-500/20",
                        selectedStyle === type 
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                          : "bg-white/5 hover:bg-white/10 text-white",
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
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="bg-white/5 backdrop-blur-lg border-cyan-500/20">
              <div className="p-8">
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
                        className="mt-2 bg-white/5 border-cyan-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-lg text-cyan-100">Content</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter notification message"
                        className="mt-2 bg-white/5 border-cyan-500/20 text-white placeholder:text-gray-400 h-32"
                      />
                    </div>
                  </div>

                  {/* Color Configuration */}
                  <div className="space-y-6">
  {/* Style Selector */}
  {selectedStyle === 'native' && (
    <>
      <div className="space-y-8">
        {/* Background Color Controls */}
        <div className="flex items-center justify-between px-6">
          <h3 className="text-lg font-medium text-cyan-100">Background Color</h3>
          <div className="flex gap-4">
            <Button
              onClick={toggleTextColor}
              className="flex items-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-md shadow-md"
            >
              <Type className="mr-2" />
            </Button>
            <Button
              onClick={matchColor}
              className="flex items-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-md shadow-md"
            >
              <Type className="mr-2" />
            </Button>
          </div>
        </div>

        {/* Color Picker */}
        <div className="flex justify-center">
          <ColorPicker onColorChange={setCalmWatersColor} />
        </div>
      </div>
    </>
  )}

  {/* Gradient Theme Section */}
  {selectedStyle === 'gradient' && (
    <div>
      <h3 className="text-lg font-medium text-cyan-100 mb-4">Gradient Theme</h3>
      <GradientColorPicker onColorChange={setGradientColor} />
    </div>
  )}
</div>

                </div>

                {/* Preview Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-cyan-100">Preview</h3>
                    <Button
                      onClick={() => handlePreview()}
                      variant="outline"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white border-none"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Show Preview
                    </Button>
                  </div>
                  <Alert
                    title={title}
                    description={description}
                    backgroundColor={calmWatersColor}
                    borderColor={borderColor}
                    textColor={textColor}
                    onClose={() => {}}
                    className="border-amber-900 border pointer-events-none"
                  />
                </div>

                {/* Action Button */}
                <Button
                  onClick={handlePreview}
                  className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <Waves className="mr-2 h-5 w-5" />
                  Release the Wave
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Toaster />

      {/* Alert Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Acknowledge</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
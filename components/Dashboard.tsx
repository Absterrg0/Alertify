"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Moon, Sun, Globe, AlertTriangle, Info, CheckCircle, XCircle, Lock, Droplet, Shell, MessageSquare, AlertCircle, Anchor, Type, Waves, Plus, Settings, User } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import { Input } from "./ui/input"
import ApiRequestManager from "./ApiLogs"
import { ColorPicker } from "./ui/color-picker"
import WebsiteManager from "./WebsiteList"
import NotificationPage from "./RecentAlerts"
import { cn } from "@/lib/utils"
import { Textarea } from "./ui/textarea"
import { Toast } from "./presets/toasts/FirstToast"
import { MyAlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import { MyAlert } from "./presets/alerts/FirstAlert"
type NotificationType = 'alert' | 'alert-dialog' | 'toast'
type StyleType = 'native' | 'gradient' | 'logo'
const isPremium = true

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false)
  const [selectedType, setSelectedType] = useState<NotificationType>('alert')
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('native')
  const [title, setTitle] = useState('Oceanic Notification')
  const [startColor, setStartColor] = useState('#3B82F6')
  const [endColor, setEndColor] = useState('#2563EB')
  const [gradientDirection, setGradientDirection] = useState('to right')
  const [description, setDescription] = useState('Dive into the depths of our new features!')
  const [backgroundColor, setBackgroundColor] = useState('#E0F2FE')
  const [showPreview, setShowPreview] = useState(false)
  const [textColor, setTextColor] = useState('black')
  const [matchBorderColor, setMatchBorderColor] = useState(false)
  const [activeTab, setActiveTab] = useState('start')
  const [additionWebsiteModal,setAdditionWebsiteModal]=useState(false)
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', isDark)
  }, [isDark])

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

  const handleWebsite = () => {
    setAdditionWebsiteModal(true)
  }

  const renderPreview = () => {
    switch (selectedType) {
      case 'alert':
        return (
          <MyAlert
            title={title}
            description={description}
            backgroundColor={selectedStyle === 'native' ? backgroundColor : gradientBackground}
            borderColor={matchBorderColor ? backgroundColor : 'black'}
            textColor={textColor}
            onClose={() => {}}
            className="pointer-events-none border"
          />
        )
      case 'alert-dialog':
        return (
          <div className='ml-56'>
            <MyAlertDialog
              isOpen={false}
              onClose={() => {}}
              title={title}
              description={description}
              backgroundColor={selectedStyle === 'native' ? backgroundColor : gradientBackground}
              textColor={textColor}
              borderColor={matchBorderColor ? backgroundColor : 'black'}
              preview={true}
              className='pointer-events-none'
            />
          </div>
        )
      case 'toast':
        return (
          <div className="pointer-events-none ml-60">
            <Toast
              isOpen={false}
              title={title}
              description={description}
              backgroundColor={selectedStyle === 'native' ? backgroundColor : gradientBackground}
              textColor={textColor}
              borderColor={matchBorderColor ? backgroundColor : "black"}
              onClose={() => {}}
              preview={true}
            />
          </div>
        )
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Anchor className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
              <h1 className="text-2xl font-bold text-ocean-600 dark:text-ocean-400">Ocean Monitor</h1>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-gray-600 dark:text-gray-300">
              <span className="text-sm">Hello,</span>
              <span className="font-semibold ml-1">John Doe</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Switch
              checked={isDark}
              onCheckedChange={setIsDark}
              id="dark-mode"
              className="data-[state=checked]:bg-ocean-400"
            />
            <Label htmlFor="dark-mode" className="cursor-pointer">
              {isDark ? 
                <Moon className="h-5 w-5 text-ocean-400" /> : 
                <Sun className="h-5 w-5 text-ocean-500" />
              }
            </Label>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <Button
              onClick={()=>{}}
              variant="ghost"
              className="flex items-center gap-2 hover:bg-ocean-50 dark:hover:bg-gray-700 p-2 rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-ocean-100 dark:bg-ocean-800 flex items-center justify-center">
                <User className="h-4 w-4 text-ocean-600 dark:text-ocean-400" />
              </div>
            </Button>
          </div>
        </nav>

        {showPreview && selectedType === 'alert' && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <MyAlert
              title={title}
              description={description}
              backgroundColor={selectedStyle === 'native' ? backgroundColor : gradientBackground}
              borderColor={matchBorderColor ? backgroundColor : 'black'}
              textColor={textColor}
              onClose={() => setShowPreview(false)}
              className="border-ocean-500 border shadow-lg animate-float"
            />
          </div>
        )}

        {showPreview && selectedType === 'alert-dialog' && (
          <MyAlertDialog
            isOpen={true}
            onClose={() => setShowPreview(false)}
            title={title}
            description={description}
            backgroundColor={selectedStyle === 'native' ? backgroundColor : gradientBackground}
            textColor={textColor}
            borderColor={matchBorderColor ? backgroundColor : 'black'}
            preview={false}
          />
        )}

        {showPreview && selectedType === 'toast' && (
          <Toast
            isOpen={true}
            title={title}
            description={description}
            backgroundColor={selectedStyle === 'native' ? backgroundColor : gradientBackground}
            textColor={textColor}
            borderColor={matchBorderColor ? backgroundColor : "black"}
            onClose={() => setShowPreview(false)}
            preview={false}
          />
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Websites List and Configuration */}
          <div className="lg:col-span-2 space-y-6">

            <WebsiteManager></WebsiteManager>

            {/* Alert Configuration */}
            <Card className="bg-white dark:bg-gray-800 shadow-xl border border-ocean-200 dark:border-ocean-700 transition-all duration-300">
              <CardHeader className="border-b border-ocean-200 dark:border-ocean-700">
                <CardTitle className="text-2xl font-bold text-ocean-600 dark:text-ocean-400">Notification Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Notification Types */}
                <div>
                  <h3 className="text-xl font-semibold text-ocean-700 dark:text-ocean-300 mb-4">Notification Types</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'alert', icon: AlertCircle, label: 'Surface Alert' },
                      { type: 'alert-dialog', icon: MessageSquare, label: 'Deep Dive' },
                      { type: 'toast', icon: Bell, label: 'Bubble Toast' },
                    ].map(({ type, icon: Icon, label }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type as NotificationType)}
                        className={cn(
                          "p-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center",
                          selectedType === type 
                            ? "bg-ocean-100 dark:bg-ocean-800 text-ocean-600 dark:text-ocean-300 shadow-md" 
                            : "bg-white dark:bg-gray-700 hover:bg-ocean-50 dark:hover:bg-ocean-900 text-gray-600 dark:text-gray-300",
                          "border border-ocean-200 dark:border-ocean-700"
                        )}
                      >
                        <Icon className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Options */}
                <div>
                  <h3 className="text-xl font-semibold text-ocean-700 dark:text-ocean-300 mb-4">Style Options</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'native', label: 'Calm Waters', description: 'Clean design' },
                      { type: 'gradient', label: 'Deep Ocean', description: 'Rich gradients', premium: true },
                      { type: 'logo', label: 'Coral Theme', description: 'Brand-focused', premium: true },
                    ].map(({ type, label, description, premium }) => (
                      <button
                        key={type}
                        onClick={() => isPremium || !premium ? setSelectedStyle(type as StyleType) : null}
                        disabled={premium && !isPremium}
                        className={cn(
                          "p-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center text-center",
                          selectedStyle === type 
                            ? "bg-ocean-100 dark:bg-ocean-800 text-ocean-600 dark:text-ocean-300 shadow-md" 
                            : "bg-white dark:bg-gray-700 hover:bg-ocean-50 dark:hover:bg-ocean-900 text-gray-600 dark:text-gray-300",
                          "border border-ocean-200 dark:border-ocean-700",
                          premium && !isPremium && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span className="text-sm font-medium mb-1">{label}</span>
                        <span className="text-xs">{description}</span>
                        {premium && !isPremium && <Lock className="h-4 w-4 mt-2" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Customization */}
                <div>
                  <h3 className="text-xl font-semibold text-ocean-700 dark:text-ocean-300 mb-4">Customize Your Message</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-ocean-600 dark:text-ocean-400">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter notification title"
                        className="mt-1 bg-white dark:bg-gray-700 border-ocean-200 dark:border-ocean-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-ocean-600 dark:text-ocean-400">Content</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter notification message"
                        className="mt-1 bg-white dark:bg-gray-700 border-ocean-200 dark:border-ocean-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 h-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Configuration */}
                <div>
                  <h3 className="text-xl font-semibold text-ocean-700 dark:text-ocean-300 mb-4">Color Configuration</h3>
                  {selectedStyle === 'native' ? (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-ocean-600 dark:text-ocean-400">Background Color</Label>
                      <div className="flex justify-center">
                        <ColorPicker onColorChange={setBackgroundColor} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <button
                          className={`py-2 px-4 ${
                            activeTab === 'start' ? 'border-b-2 border-ocean-500 text-ocean-600 dark:text-ocean-400' : 'text-ocean-500 dark:text-ocean-400'
                          }`}
                          onClick={() => setActiveTab('start')}
                        >
                          Start Color
                        </button>
                        <button
                          className={`py-2 px-4 ${
                            activeTab === 'end' ? 'border-b-2 border-ocean-500 text-ocean-600 dark:text-ocean-400' : 'text-ocean-500 dark:text-ocean-400'
                          }`}
                          onClick={() => setActiveTab('end')}
                        >
                          End Color
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <ColorPicker onColorChange={activeTab === 'start' ? setStartColor : setEndColor} />
                      </div>
                      <Select
                        value={gradientDirection}
                        onValueChange={setGradientDirection}
                      >
                        <SelectTrigger className='text-sm text-ocean-600 dark:text-ocean-400 bg-white dark:bg-gray-700 border-ocean-200 dark:border-ocean-600'>
                          <SelectValue placeholder="Select gradient direction" />
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

                {/* Preview */}
                <div>
                  <h3 className="text-xl font-semibold text-ocean-700 dark:text-ocean-300 mb-4">Preview</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    {renderPreview()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    onClick={toggleTextColor}
                    className="bg-ocean-500 hover:bg-ocean-600 text-white transition-colors duration-300"
                  >
                    <Type className="mr-2 h-4 w-4" />
                    Toggle Text Color
                  </Button>
                  <Button
                    onClick={matchColor}
                    className="bg-ocean-500 hover:bg-ocean-600 text-white transition-colors duration-300"
                  >
                    Toggle Border
                  </Button>
                  <Button
                    onClick={handlePreview}
                    className="bg-ocean-500 hover:bg-ocean-600 text-white transition-colors duration-300"
                  >
                    <Waves className="mr-2 h-4 w-4" />
                    Show Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Alerts and API Logs */}
          <div className="space-y-6">
                <NotificationPage></NotificationPage>
                 <ApiRequestManager></ApiRequestManager>
          </div>
        </div>
      </div>
    </div>
  )
}


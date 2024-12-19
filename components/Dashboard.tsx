"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Moon, Sun, Lock, MessageSquare, AlertCircle, Anchor, Waves, User } from 'lucide-react'

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
  const [isDark, setIsDark] = useState(true)
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
    <div className={`min-h-screen bg-white dark:bg-[#0e0e0f]  text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-[#0e0e0f] shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Anchor className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Droplert</h1>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-gray-600 dark:text-gray-300">
              <span className="text-md">Hello,</span>
              <span className="font-semibold text-lg ml-1">John Doe</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Switch
              checked={isDark}
              onCheckedChange={setIsDark}
              id="dark-mode"
              className="data-[state=checked]:bg-teal-600"
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
                <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
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
            <Card className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-xl transition-all duration-300">
  <CardHeader className="border-b border-gray-200 dark:border-zinc-700 bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 p-6 rounded-t-xl">
    <CardTitle className="text-3xl font-bold text-gray-800 dark:text-zinc-200">
      Notification Configuration
    </CardTitle>
  </CardHeader>
  <CardContent className="p-8 space-y-8">
    {/* Notification Types */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">
        Notification Types
      </h3>
      <div className="grid grid-cols-3 gap-6">
        {[
          { type: 'alert', icon: AlertCircle, label: 'Alert' },
          { type: 'alert-dialog', icon: MessageSquare, label: 'Alert Dialog' },
          { type: 'toast', icon: Bell, label: 'Toast' },
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type as NotificationType)}
            className={cn(
              "p-6 rounded-lg transition-all duration-300 flex flex-col items-center justify-center",
              selectedType === type
                ? "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 shadow-md"
                : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:scale-105 hover:border-teal-300 dark:hover:border-teal-700"
            )}
          >
            <Icon className="h-10 w-10 mb-3" />
            <span className="text-base font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Style Options */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">
        Style Options
      </h3>
<div className="grid grid-cols-3 gap-6">
  {[
    { type: 'native', label: 'Native', description: 'Solid background color' },
    { type: 'gradient', label: 'Gradients', description: 'Great gradient background color with multiple variants', premium: true },
    { type: 'logo', label: 'Personalised Logo', description: 'Brand-focused Logo as the background to personalise the notification', premium: true },
  ].map(({ type, label, description, premium }) => (
    <button
      key={type}
      onClick={() => (isPremium || !premium ? setSelectedStyle(type as StyleType) : null)}
      disabled={premium && !isPremium}
      className={`p-6 rounded-lg transition-all duration-300 flex flex-col items-center justify-center text-center ${
        selectedStyle === type
          ? 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 shadow-md'
          : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:scale-105 hover:border-teal-300 dark:hover:border-teal-700'
      } ${premium && !isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="text-base font-medium mb-2">{label}</span>
      <span className="text-sm dark:text-gray-100">{description}</span>
      {premium && !isPremium && <Lock className="h-5 w-5 mt-2" />}
    </button>
  ))}
</div>

    </div>

    {/* Message Customization and Color Configuration */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Customize Your Message */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">
          Customize Your Message
        </h3>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-800 dark:text-zinc-200">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="mt-2 w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-800 dark:text-zinc-200">
              Content
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter notification message"
              className="mt-2 w-full bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 h-28"
            />
          </div>
        </div>
      </div>

      {/* Color Configuration */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">
          Color Configuration
        </h3>
        {selectedStyle === 'native' ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <ColorPicker onColorChange={setBackgroundColor} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between">
            <button
  className={cn(
    "py-2 px-4 rounded-lg transition-colors duration-300",
    activeTab === 'start'
      ? "bg-dark-gray-800 text-white shadow-lg"
      : "bg-white dark:bg-zinc-800 text-dark-gray-500 dark:text-dark-gray-400 border border-gray-200 dark:border-zinc-700"
  )}
  onClick={() => setActiveTab('start')}
>
  Start Color
</button>
<button
  className={cn(
    "py-2 px-4 rounded-lg transition-colors duration-300",
    activeTab === 'end'
      ? "bg-dark-gray-800 text-white shadow-md"
      : "bg-white dark:bg-zinc-800 text-dark-gray-500 dark:text-dark-gray-400 border border-gray-200 dark:border-zinc-700"
  )}
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
              <SelectTrigger className="mt-4 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200">
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
    </div>

    {/* Preview */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">
        Preview
      </h3>
      <div className="bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
        {renderPreview()}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-between items-center p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
      <div className="space-x-4">
        <Button
          variant="outline"
          onClick={toggleTextColor}
          className="relative bg-slate-400 dark:bg-slate-800 text-white dark:text-white border border-slate-200 dark:border-slate-700
            hover:bg-slate-100 dark:hover:bg-slate-700
            focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500
            active:bg-slate-200 dark:active:bg-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          <span className="relative z-10">Text Color: {textColor}</span>
        </Button>

        <Button
          onClick={matchColor}
          className="relative bg-indigo-500 dark:bg-indigo-600 text-white
            hover:bg-indigo-600 dark:hover:bg-indigo-700
            focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:ring-offset-2
            active:bg-indigo-700 dark:active:bg-indigo-800
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          Toggle Border
        </Button>
      </div>

      <div className="space-x-4">
        <Button
          onClick={() => {}}
          className="relative inline-flex items-center bg-teal-500 dark:bg-teal-600 text-white
            hover:bg-teal-600 dark:hover:bg-teal-700
            focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:ring-offset-2
            active:bg-teal-700 dark:active:bg-teal-800
            disabled:opacity-50 disabled:cursor-not-allowed
            group transition-all duration-200"
        >
          <Waves className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="relative z-10">Send Alert</span>
        </Button>

        <Button
          onClick={handlePreview}
          className="relative inline-flex items-center bg-teal-500 dark:bg-teal-600 text-white
            hover:bg-teal-600 dark:hover:bg-teal-700
            focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:ring-offset-2
            active:bg-teal-700 dark:active:bg-teal-800
            disabled:opacity-50 disabled:cursor-not-allowed
            group transition-all duration-200"
        >
          <Waves className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="relative z-10">Show Preview</span>
        </Button>
      </div>
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


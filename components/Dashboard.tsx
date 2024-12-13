"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Moon, Sun, Globe, AlertTriangle, Info, CheckCircle, XCircle, Lock, Droplet, Shell, MessageSquare, AlertCircle, Anchor, Type, Waves } from 'lucide-react'
import { ApiLogs } from "./ApiLogs"
import { ColorPicker } from "./ui/color-picker"
import { WebsiteList } from "./WebsiteList"
import { RecentAlerts } from "./RecentAlerts"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Play } from "lucide-react"
import { Toast } from "./presets/toasts/FirstToast"
import { AlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import { Alert } from "./presets/alerts/FirstAlert"
type NotificationType = 'alert' | 'alert-dialog' | 'toast'
type StyleType = 'native' | 'gradient' | 'logo'
const isPremium = true
export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false)
  const [showBorders, setShowBorders] = useState(false)
  const [alertType, setAlertType] = useState("info")
  const [alertStyle, setAlertStyle] = useState("default")
    const [selectedType, setSelectedType] = useState<NotificationType>('alert')
    const [selectedStyle, setSelectedStyle] = useState<StyleType>('native')
    const [title, setTitle] = useState('Oceanic Notification')
    const [startColor, setStartColor] = useState('#3B82F6');
    const [endColor, setEndColor] = useState('#2563EB');
    const [gradientDirection, setGradientDirection] = useState('to right');
    const [description, setDescription] = useState('Dive into the depths of our new features!')
    const [backgroundColor, setBackgroundColor] = useState('#E0F2FE')
    const [showPreview, setShowPreview] = useState(false)
    const [textColor, setTextColor] = useState('black')
    const [matchBorderColor, setMatchBorderColor] = useState(false)
    const [activeTab,setActiveTab]= useState('start')

    const toggleTextColor = () => {
      setTextColor(prevColor => prevColor === 'black' ? 'white' : 'black')
    }
  
    const matchColor = ()=>{
      setMatchBorderColor((prevState)=>!prevState)
    }
    const gradientBackground = `linear-gradient(${gradientDirection}, ${startColor}, ${endColor})`;
    const handlePreview = () => {
      setShowPreview(true);
    }
    const renderPreview = () => {
      switch (selectedType) {
        case 'alert':
          return (
            <Alert
              title={title}
              description={description}
              backgroundColor={selectedStyle==='native'? backgroundColor : gradientBackground}
              borderColor={matchBorderColor ? backgroundColor : 'black'}
              textColor={textColor}
              onClose={() => {}}
              className="pointer-events-none border"
            />
          )
        case 'alert-dialog':
          return (
              <div className='ml-56'>
               <AlertDialog
              isOpen={false}
              onClose={() => {}}
              title={title}
              description={description}
              backgroundColor={selectedStyle==='native'? backgroundColor : gradientBackground}
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
                backgroundColor={selectedStyle==='native'? backgroundColor : gradientBackground}
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
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-950' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Monitor</h1>
          <div className="flex items-center gap-4">
            <Switch
              checked={isDark}
              onCheckedChange={setIsDark}
              id="dark-mode"
            />
            <Label htmlFor="dark-mode">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Label>
          </div>
        </nav>


                {showPreview && selectedType === 'alert' && (
                  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
                    <Alert
                      title={title}
                      description={description}
                      backgroundColor={selectedStyle==='native'? backgroundColor : gradientBackground}
                      borderColor={matchBorderColor ? backgroundColor : 'black'}
                      textColor={textColor}
                      onClose={() => setShowPreview(false)}
                      className="border-amber-900 border shadow-lg"
                    />
                  </div>
                )}
          
                {/* Preview Alert Dialog */}
                {showPreview && selectedType === 'alert-dialog' && (
                  <AlertDialog
                    isOpen={true}
                    onClose={() => setShowPreview(false)}
                    title={title}
                    description={description}
                    backgroundColor={selectedStyle==='native'? backgroundColor : gradientBackground}
                    textColor={textColor}
                    borderColor={matchBorderColor ? backgroundColor : 'black'}
                    preview={false}
                  />
              
                )}
          
                {showPreview && selectedType==='toast' && (
                  <Toast
                  isOpen={true}
                  title={title}
                  description={description}
                  backgroundColor={selectedStyle==='native'? backgroundColor : gradientBackground}
                  textColor={textColor}
                  borderColor={matchBorderColor ? backgroundColor : "black"}
                  onClose={() => setShowPreview(false)}
                  preview={false}
                            />
                )}
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Websites List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={showBorders ? 'border-2' : ''}>
              <CardHeader>
                <CardTitle>List of Websites</CardTitle>
              </CardHeader>
              <CardContent>
                <WebsiteList />
              </CardContent>
            </Card>

            {/* Alert Configuration */}
            <div className="grid grid-cols-2 gap-6">
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
                    { type: 'logo', label: 'Coral Theme(Coming Soon)', description: 'Brand-focused style', premium: true },
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

            {/* Color Picker */}
            <div className="col-span-12 lg:col-span-8">
            <Card className="bg-white/5 backdrop-blur-lg border-cyan-500/20">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
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
                    {selectedStyle==='gradient' &&(
                            <div className="mt-6 space-y-3">
                            <Label className='text-lg text-cyan-100 '>Gradient Direction</Label>
                            <Select
                              value={gradientDirection}
                              onValueChange={setGradientDirection}
                            >
                              <SelectTrigger className='text-lg text-cyan-100'>
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
                    {/* Style Selector */}
                    {selectedStyle === 'native' && (
                      <>
                        <div className="space-y-8">
                          {/* Background Color Controls */}
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
                                className="flex items-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                              >
                                <Type className="mr-2" />
                                Toggle Text Color
                              </Button>
                              <Button
                                onClick={matchColor}
                                className="flex items-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-md shadow-md"
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
              <h3 className="text-lg font-medium text-cyan-100">Gradient Theme</h3>
              <div className="flex border-b border-gray-700 mb-4">
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
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                >
                  <Type className="mr-2" />
                  Toggle Text Color
                </Button>
                <Button
                  onClick={matchColor}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-md shadow-md"
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
                      className="bg-cyan-600 hover:bg-cyan-700 text-white border-none"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Show Preview
                    </Button>
                  </div>
                  {renderPreview()}
                </div>

                {/* Action Button */}
                <Button
                  onClick={handlePreview}
                  className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <Waves className="mr-2 h-5 w-5" />
                  Select the websites
                </Button>
              </div>
            </Card>
          </div>
          </div>

          {/* Right Column - Recent Alerts */}
          <div className="space-y-6">
            <Card className={`h-[400px] ${showBorders ? 'border-2' : ''}`}>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentAlerts />
              </CardContent>
            </Card>

            {/* API Logs */}
            <Card className={showBorders ? 'border-2' : ''}>
              <CardHeader>
                <CardTitle>API Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiLogs />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


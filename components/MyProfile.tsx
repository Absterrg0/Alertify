"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Moon, Sun, Bell, MessageSquare, AlertCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import { MyAlert } from "./presets/alerts/FirstAlert"
import { MyAlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import { Toast } from "./presets/toasts/FirstToast"
import { motion, AnimatePresence } from "framer-motion"

const alertData = [
  {
    id: "1",
    title: "Info Alert",
    description: "This is an informational alert.",
    website: "example.com",
    backgroundColor: "#1e2a3a",
    type: "ALERT",
    textColor: "#a0b4c8",
    borderColor: "#364759",
  },
  {
    id: "2",
    title: "Warning Dialog",
    description: "This is a warning dialog notification.",
    website: "mywebsite.com",
    backgroundColor: "#2a2620",
    type: "ALERT_DIALOG",
    textColor: "#d0b88f",
    borderColor: "#4d4639",
  },
  {
    id: "3",
    title: "Success Toast",
    description: "Operation completed successfully!",
    website: "services.com",
    backgroundColor: "#1e2e2a",
    type: "TOAST",
    textColor: "#a0c8b4",
    borderColor: "#365947",
  },
  // Add more dummy data for each type to demonstrate scrolling
  {
    id: "4",
    title: "Error Alert",
    description: "An error occurred during the operation.",
    website: "errorsite.com",
    backgroundColor: "#2a1e1e",
    type: "ALERT",
    textColor: "#c8a0a0",
    borderColor: "#593636",
  },
  {
    id: "5",
    title: "Confirmation Dialog",
    description: "Are you sure you want to proceed?",
    website: "confirmsite.com",
    backgroundColor: "#1e2a2a",
    type: "ALERT_DIALOG",
    textColor: "#a0c8c8",
    borderColor: "#365959",
  },
  {
    id: "6",
    title: "Update Toast",
    description: "Your application has been updated.",
    website: "updatesite.com",
    backgroundColor: "#2a2a1e",
    type: "TOAST",
    textColor: "#c8c8a0",
    borderColor: "#595936",
  },
]

export default function ProfilePage() {
  const [name, setName] = useState("John Doe")
  const [apiKey, setApiKey] = useState(`dl_${uuidv4()}`)
  const [isDark, setIsDark] = useState(false)
  const [alerts, setAlerts] = useState(alertData)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', isDark)
  }, [isDark])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const refreshApiKey = () => {
    const newApiKey = `dl_${uuidv4()}`
    setApiKey(newApiKey)
  }

  const handleNotificationClose = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
  }

  const renderNotification = (alert: any) => {
    switch (alert.type) {
      case "ALERT":
        return (
          <MyAlert
            key={alert.id}
            title={alert.title}
            description={alert.description}
            backgroundColor={alert.backgroundColor}
            textColor={alert.textColor}
            borderColor={alert.borderColor}
            onClose={() => handleNotificationClose(alert.id)}
          />
        )
      case "ALERT_DIALOG":
        return (
          <MyAlertDialog
            preview={true}
            isOpen={true}
            key={alert.id}
            title={alert.title}
            description={alert.description}
            backgroundColor={alert.backgroundColor}
            textColor={alert.textColor}
            borderColor={alert.borderColor}
            onClose={() => handleNotificationClose(alert.id)}
          />
        )
      case "TOAST":
        return (
          <Toast
            isOpen={true}
            preview={true}
            key={alert.id}
            title={alert.title}
            description={alert.description}
            backgroundColor={alert.backgroundColor}
            textColor={alert.textColor}
            borderColor={alert.borderColor}
            onClose={() => handleNotificationClose(alert.id)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-[#0e0e0f]  text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isDark}
              onCheckedChange={setIsDark}
              id="dark-mode"
              className="data-[state=checked]:bg-teal-600"
            />
            <Label htmlFor="dark-mode" className="cursor-pointer">
              {isDark ? 
                <Moon className="h-5 w-5 text-teal-400" /> : 
                <Sun className="h-5 w-5 text-teal-500" />
              }
            </Label>
          </div>
        </div>
        
        <Card className="w-full bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700/50  shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">User Details</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</Label>
              <Input id="name" value={name} onChange={handleNameChange} className="max-w-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700 dark:text-gray-300">API Key</Label>
              <div className="flex items-center space-x-2 max-w-md">
                <Input id="apiKey" value={apiKey} readOnly className="flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                <Button onClick={refreshApiKey} size="icon" className="bg-teal-500 dark:bg-teal-600 text-white hover:bg-teal-600 dark:hover:bg-teal-700">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700/50  shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">All Notifications</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">View all your alerts, dialogs, and toasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Alerts Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <h2>Alerts</h2>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {alerts.filter(alert => alert.type === "ALERT").map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {renderNotification(alert)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Alert Dialogs Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <h2>Alert Dialogs</h2>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {alerts.filter(alert => alert.type === "ALERT_DIALOG").map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {renderNotification(alert)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Toasts Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  <h2>Toasts</h2>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {alerts.filter(alert => alert.type === "TOAST").map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {renderNotification(alert)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


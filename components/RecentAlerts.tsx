"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { MyAlert } from "./presets/alerts/FirstAlert"
import { MyAlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import { Toast } from "./presets/toasts/FirstToast"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Bell, ChevronRight } from 'lucide-react'
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
]

export default function NotificationPage() {
  const [alerts, setAlerts] = useState(alertData)
  const router = useRouter()

  const handleNotificationClose = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
  }

  const handleShowAll = () => {
    router.push("/all-notifications")
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
    <Card className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700 max-w-3xl mx-auto rounded-xl overflow-hidden transition-all duration-300 relative">
      {/* Header */}
      <CardHeader className="p-6 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-200/50 dark:bg-zinc-700/30 rounded-lg backdrop-blur-sm">
            <Bell className="h-6 w-6 text-gray-600 dark:text-zinc-300" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-zinc-200">
              Recent Alerts
            </CardTitle>
          </div>
        </div>
        <Button
          onClick={handleShowAll}
          variant="outline"
          size="sm"
          className="text-xs bg-transparent border border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md dark:shadow-zinc-900/50"
        >
          See All
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>

      {/* Notifications */}
      <CardContent className="p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <AnimatePresence>
          {alerts.slice(0, 2).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-100/20 dark:from-zinc-700/20 dark:to-zinc-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-4 bg-white dark:bg-zinc-800 shadow-md dark:shadow-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-zinc-900/70 transition-all duration-300 ease-out">
                {renderNotification(alert)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}


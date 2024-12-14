"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { MyAlert } from "./presets/alerts/FirstAlert"
import { MyAlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import { Toast } from "./presets/toasts/FirstToast"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Bell, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const alertData = [
  {
    id: "1",
    title: "Info Alert",
    description: "This is an informational alert.",
    website: "example.com",
    backgroundColor: "#e0e0e0",
    type: "ALERT",
    textColor: "#2c2c2c",
    borderColor: "#b0b0b0",
  },
  {
    id: "2",
    title: "Warning Dialog",
    description: "This is a warning dialog notification.",
    website: "mywebsite.com",
    backgroundColor: "#f0e6d2",
    type: "ALERT_DIALOG",
    textColor: "#7a6f55",
    borderColor: "#d0c4a0",
  },
  {
    id: "3",
    title: "Success Toast",
    description: "Operation completed successfully!",
    website: "services.com",
    backgroundColor: "#dadada",
    type: "TOAST",
    textColor: "#2e2e2e",
    borderColor: "#b4b4b4",
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
    <Card className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow-2xl border border-gray-300 dark:border-gray-700 max-w-3xl mx-auto rounded-xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <CardHeader className="p-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-500/20 rounded-lg backdrop-blur-sm">
              <Bell className="h-6 w-6 text-gray-100" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-100">
                Recent Alerts
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Notifications */}
      <CardContent className="p-6 space-y-4">
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
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700/20 dark:to-gray-800/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-300 ease-out">
                {renderNotification(alert)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* "See More" Button */}
        <Button
          onClick={handleShowAll}
          className="w-full py-4 mt-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
        >
          See All Notifications
          <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  )
}
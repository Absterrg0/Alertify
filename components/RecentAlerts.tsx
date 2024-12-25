"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { MyAlert } from "./presets/alerts/FirstAlert"
import { MyAlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import { Toast } from "./presets/toasts/FirstToast"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Bell, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Alert } from "./Dashboard"


interface InputProps{
  alerts:Alert[]
}




export default function NotificationPage({alerts}:InputProps) {

  const router = useRouter();

  const handleShowAll = () => {
    router.push("/all-notifications")
  }

  const renderNotification = (alert: Alert) => {
    switch (alert.type) {
      case "ALERT":
        return (
          <MyAlert
          preview={true}
            key={alert.id}
            title={alert.title}
            description={alert.description}
            backgroundColor={alert.backgroundColor}
            textColor={alert.textColor}
            borderColor={alert.borderColor}
            onClose={() =>{}}
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
            onClose={() =>{}}
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
            onClose={() => {}}
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
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
        <Bell className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">No Alerts Yet</h3>
      <p className="mb-6 max-w-sm text-gray-600 dark:text-gray-400">
        Your alert feed is currently empty. New alerts will appear here as they come in.
      </p>
    </div>            
    </motion.div>
          ) : (
            alerts.slice(0, 2).map((alert, index) => (
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
              >
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-100/20 dark:from-zinc-700/20 dark:to-zinc-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-4 bg-white dark:bg-zinc-800 shadow-md dark:shadow-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-700 group-hover:border-gray-300 dark:group-hover:border-zinc-600 group-hover:shadow-lg dark:group-hover:shadow-zinc-900/70 transition-all duration-300 ease-out">
                    {renderNotification(alert)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}


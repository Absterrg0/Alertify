"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Moon, Sun, MessageSquare, AlertCircle, User, LogOut, Palette, Image } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ApiRequestManager from "./api-request-component"
import VerifiedWebsiteManager from "./WebsiteList"
import NotificationPage from "./RecentAlerts"
import { cn } from "@/lib/utils"
import OnboardingModal from "./OnboardingModal"
import { signOut, useSession } from "next-auth/react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { AlertsSkeleton } from "./AlertSkeleton"
import { ConfigurationSkeleton } from "./ConfigurationSkeleton"
import { WebsitesSkeleton } from "./WebsiteSkeleton"
import { useRouter } from "next/navigation"
import { ApiRequestGraph } from "./api-request-graph"

type NotificationType = "ALERT" | "ALERT_DIALOG" | "TOAST"
type StyleType = "NATIVE" | "GRADIENT"

export type Website = {
  id: string
  name: string
  url: string
  isVerified: boolean
  status: "PENDING" | "ACTIVE" | "DEACTIVATED"
}

export type Alert = {
  id: string
  title: string
  description: string
  backgroundColor: string
  type: "ALERT" | "ALERT_DIALOG" | "TOAST"
  textColor: string
  borderColor: string
  imageUrl?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isDark, setIsDark] = useState(true)
  const [selectedType, setSelectedType] = useState<NotificationType>("ALERT")
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("NATIVE")
  const [alerts, setAlerts] = useState<Alert[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [isWebsitesLoading, setIsWebsitesLoading] = useState(true)
  const [isAlertsLoading, setIsAlertsLoading] = useState(true)
  const [useLogo, setUseLogo] = useState(false)

  const [websites, setWebsites] = useState<Website[]>([])
  const [selectedWebsites, setSelectedWebsites] = useState<Website[]>([])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([fetchWebsites(), fetchAlerts()])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const sortWebsites = (websites: Website[]) => {
    return websites.sort((a, b) => {
      const order = { ACTIVE: 0, PENDING: 1, DEACTIVATED: 2 }
      return (order[a.status] || 3) - (order[b.status] || 3)
    })
  }

  const fetchWebsites = async () => {
    setIsWebsitesLoading(true)
    try {
      const response = await axios.get<{ websites: Website[] }>("/api/user/websites/list")
      if (response.status === 201) {
        setWebsites(sortWebsites(response.data.websites || []))
        toast({
          title: "Websites successfully fetched",
        })
      }
    } catch (err) {
      toast({
        title: "Error fetching websites",
      })
      console.error("Error fetching websites:", err)
    } finally {
      setIsWebsitesLoading(false)
    }
  }

  const fetchAlerts = async () => {
    setIsAlertsLoading(true)
    try {
      const response = await axios.get("/api/user/alerts/list")
      setAlerts(response?.data?.response)
    } catch (error) {
      console.error("Error fetching alerts:", error)
      toast({
        title: "Error fetching alerts",
        variant: "destructive",
      })
    } finally {
      setIsAlertsLoading(false)
    }
  }

  const handleWebsitesChange = async () => {
    await fetchWebsites()
  }

  const handleSelectedWebsitesChange = (updatedSelectedWebsites: Website[]) => {
    setSelectedWebsites(updatedSelectedWebsites)
  }

  const handleCustomize = () => {
         // Check if at least one website is selected
         if (selectedWebsites.length === 0) {
          toast({
            title: "Select at minimum 1 website",
            variant: "destructive",
          })
          return
        }
    
        // Check if all selected websites are active
        for (const website of selectedWebsites) {
          if (website.status !== "ACTIVE") {
            toast({
              title: "Please verify the websites first",
              variant: "destructive",
            })
            return // Stop further execution if any website is not active
          }
        }
        router.push(`/${selectedType.toLowerCase()}?style=${selectedStyle}&useLogo=${useLogo}&websites=${encodeURIComponent(JSON.stringify(selectedWebsites.map(w => ({ name: w.name, url: w.url }))))}`);

  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-[#0e0e0f] text-gray-900 dark:text-gray-100 transition-colors duration-300`}
    >
      <div className="container mx-auto p-6 space-y-6">
        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-white dark:bg-[#0e0e0f] shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
      DropLert
    </h1>
    <span className="px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-medium">
      Builder
    </span>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-gray-600 dark:text-gray-300">
              <span className="text-md">Hello,</span>
              <span className="font-semibold text-lg ml-1">{session?.user?.name}</span>
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
              {isDark ? <Moon className="h-5 w-5 text-ocean-400" /> : <Sun className="h-5 w-5 text-ocean-500" />}
            </Label>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-ocean-50 dark:hover:bg-gray-700 p-2 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-ocean-100 dark:bg-ocean-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    signOut({ redirectTo: "/getstarted" })
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Websites List and Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {isWebsitesLoading ? (
              <WebsitesSkeleton />
            ) : (
              <VerifiedWebsiteManager
                websites={websites}
                selectedWebsites={selectedWebsites}
                onWebsitesChange={handleWebsitesChange}
                onSelectedWebsitesChange={handleSelectedWebsitesChange}
              />
            )}

            {/* Alert Configuration */}
            {isLoading ? (
              <ConfigurationSkeleton />
            ) : (
              <Card className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 rounded-xl transition-all duration-300 max-w-5xl mx-auto">
                <CardHeader className="border-b border-gray-200 dark:border-zinc-700 bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 p-8 rounded-t-xl">
                  <CardTitle className="text-4xl font-bold text-gray-800 dark:text-zinc-200 text-center">
                    Notification Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                  {/* Notification Types */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">
                      Choose Notification Type
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { type: "ALERT", icon: AlertCircle, label: "Alert" },
                        { type: "ALERT_DIALOG", icon: MessageSquare, label: "Alert Dialog" },
                        { type: "TOAST", icon: Bell, label: "Toast" },
                      ].map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type as NotificationType)}
                          className={cn(
                            "p-6 rounded-xl transition-all duration-300 flex flex-col items-center justify-center",
                            selectedType === type
                              ? "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 shadow-md ring-2 ring-teal-500"
                              : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:scale-105 hover:border-teal-300 dark:hover:border-teal-700",
                          )}
                        >
                          <Icon className="h-12 w-12 mb-4" />
                          <span className="text-lg font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Options */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-200 mb-6">Select Style</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { type: "NATIVE", label: "Native", description: "Solid background color", icon: Palette },
                        {
                          type: "GRADIENT",
                          label: "Gradients",
                          description: "Great gradient background color with multiple variants",
                          icon: Palette,
                        },
                      ].map(({ type, label, description, icon: Icon }) => (
                        <button
                          key={type}
                          onClick={() => setSelectedStyle(type as StyleType)}
                          className={cn(
                            "p-6 rounded-xl transition-all duration-300 flex flex-col items-center justify-center text-center",
                            selectedStyle === type
                              ? "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 shadow-md ring-2 ring-teal-500"
                              : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:scale-105 hover:border-teal-300 dark:hover:border-teal-700",
                          )}
                        >
                          <Icon className="h-12 w-12 mb-4" />
                          <span className="text-lg font-medium mb-2">{label}</span>
                          <span className="text-sm dark:text-gray-400">{description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Option */}
                  <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center space-x-4">
                      <Image className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-zinc-200">Use Custom Logo</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Include your brand logo in notifications
                        </p>
                      </div>
                    </div>
                    <Switch id="use-logo" checked={useLogo} onCheckedChange={setUseLogo}
                    className="data-[state=unchecked]:bg-white data-[state=checked]:bg-teal-500"
                     />
                  </div>
                </CardContent>
                <CardFooter className="p-8 flex justify-center">
                  <Button onClick={handleCustomize} className="w-full max-w-md text-lg py-6" size="lg">
                    Customize Notification
                  </Button>
                </CardFooter>
              </Card>
            )}
                    <ApiRequestManager />

          </div>

          {/* Right Column - Recent Alerts and API Logs */}
          <div className="space-y-6">
            <OnboardingModal />
            <ApiRequestGraph/>
            {isAlertsLoading ? <AlertsSkeleton /> : <NotificationPage alerts={alerts ?? []} />}
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import type { AlertState } from "@/types/alert"
import type { Website } from "./Dashboard"
// Import our new components
import { LogoSection } from "./cutomise/logo-section"
import { GradientSection } from "./cutomise/gradient-section"

import { ContentSection } from "./cutomise/content-section"
import { ColorSection } from "./cutomise/color-section"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import RouteManager from "./specific-route-component"
import SpecificUserSection from "./specific-user-component"
import { MyAlert } from "./presets/alerts/FirstAlert"
import EmptyState from "./empty-route-state"

const logoPresets = [
  { name: "Abstract1", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVTZ1VMZnCYVDtCnH8Q0hBa4xPKcdlTb3qiX2Ap" },
  { name: "GoalMet", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT59RuXSzUbHhcr09eY2WSxJ6NTDQlutmECi4P" },
  { name: "Caution", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT2JZEzPgKNydbqVWD94IMFUCcrBSsTkA7ZxuX" },
  { name: "Abstract2", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVTn85x8EWqmi4vLjs7JGZFeXCpDSryg0hwuAnd" },
]
const gradientPresets = [
  { name: "Cosmic Fusion", start: "#ff00cc", end: "#333399" },
  { name: "Sunset Blaze", start: "#ff512f", end: "#f09819" },
  { name: "Ocean Breeze", start: "#2193b0", end: "#6dd5ed" },
  { name: "Forest Mist", start: "#000428", end: "#004e92" },
  { name: "Cherry Blossom", start: "#ffc3a0", end: "#ffafbd" },
  { name: "Northern Lights", start: "#43cea2", end: "#185a9d" },
  { name: "Amethyst Dream", start: "#9d50bb", end: "#6e48aa" },
  { name: "Citrus Splash", start: "#fdc830", end: "#f37335" },
]

export default function AlertPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDark, setIsDark] = useState(true)
  const [websites, setWebsites] = useState<Website[]>([])
  const [showLogoDialog, setShowLogoDialog] = useState(false)
  const [showGradientDialog, setShowGradientDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [routes,setRoutes]=useState<string[]>([])
  const [alertState, setAlertState] = useState<AlertState>({
    title: "Alert Title",
    description: "This is an alert message.",
    backgroundColor: "#E0F2FE",
    startColor: "#3B82F6",
    endColor: "#2563EB",
    gradientDirection: "to right",
    textColor: "#000000",
    borderColor: "#000000",
    isGradient: false,
    useLogo: false,
    uploadedFileUrl: "",
    fileName: "",
    borderRadius: 0,
  })

  useEffect(() => {
    if (searchParams) {
      const style = searchParams.get("style")
      const logoParam = searchParams.get("useLogo")
      const websitesParam = searchParams.get("websites")

      const websites = websitesParam ? JSON.parse(decodeURIComponent(websitesParam)) : []

      setAlertState((prev) => ({
        ...prev,
        isGradient: style === "GRADIENT",
        useLogo: logoParam === "true",
      }))
      setWebsites(websites)
    }
  }, [searchParams])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", isDark)
  }, [isDark])

  const updateAlertState = (updates: Partial<AlertState>) => {
    setAlertState((prev) => ({ ...prev, ...updates }))
  }

  const handleSendAlert = async () => {
    try {
      const payload = {
        title: alertState.title,
        description: alertState.description,
        selectedType: "ALERT",
        style: alertState.isGradient ? "GRADIENT" : "NATIVE",
        backgroundColor: alertState.isGradient
          ? `linear-gradient(${alertState.gradientDirection}, ${alertState.startColor}, ${alertState.endColor})`
          : alertState.backgroundColor,
        textColor: alertState.textColor,
        borderColor: alertState.borderColor,
        fileName: alertState.fileName,
        uploadedFileUrl: alertState.uploadedFileUrl,
        routes:routes,
        borderRadius:alertState.borderRadius,
      }

      console.log(routes)

      const response = await axios.post("/api/notify", {
        payload,
        websites: websites,
      })

      if (response.status === 200) {
        console.log("Alert sent successfully")
        toast({
          title: "Notification has been sent successfully",
        })
      } else {
        toast({
          title: "Failed to send notification, please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending alert:", error)
      toast({
        title: "Failed to send the notification",
        variant: "destructive",
      })
    }
    
  }

  const getBackgroundStyle = () => {
    if (alertState.isGradient) {
      return `linear-gradient(${alertState.gradientDirection}, ${alertState.startColor}, ${alertState.endColor})`
    }
    return alertState.backgroundColor
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {showPreview && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <MyAlert
              preview={true}
              title={alertState.title}
              description={alertState.description}
              backgroundColor={getBackgroundStyle()}
              borderColor={alertState.borderColor}
              textColor={alertState.textColor}
              onClose={() => setShowPreview(false)}
              className="border-ocean-500 border shadow-lg animate-float"
              uploadedFileUrl={alertState.uploadedFileUrl}
              borderRadius={alertState.borderRadius}
            />
          </div>
        )}
      <div className="container mx-auto p-6 space-y-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg shadow-lg border border-gray-200 dark:border-zinc-800 transition-all duration-300">
  <div className="flex items-center gap-4">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
      DropLert
    </h1>
    <span className="px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-medium">
      Builder
    </span>
    
    {/* Minimal Back to Dashboard CTA */}
    <button
      onClick={() => router.replace("/dashboard")}
      className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400 transition"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Dashboard
    </button>
  </div>

  <div className="flex items-center gap-6">
    <Switch
      checked={isDark}
      onCheckedChange={setIsDark}
      id="dark-mode"
      className="data-[state=checked]:bg-teal-600"
    />
    <Label htmlFor="dark-mode" className="cursor-pointer">
      {isDark ? <Moon className="h-5 w-5 text-teal-400" /> : <Sun className="h-5 w-5 text-teal-600" />}
    </Label>
  </div>
</nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6 ">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6">Content</h3>
              <div className="mb-6">
              <MyAlert
      preview={true}
      title={alertState.title}
      description={alertState.description}
      backgroundColor={getBackgroundStyle()}
      borderColor={alertState.borderColor}
      textColor={alertState.textColor}
      onClose={() => {}}
      uploadedFileUrl={alertState.useLogo ? alertState.uploadedFileUrl : undefined}
      borderRadius={alertState.borderRadius}
      className="pointer-events-none"
    />
              </div>
              {!alertState.isGradient && !alertState.useLogo ?(
                <div className="mt-48">
                                                <ContentSection alertState={alertState} updateAlertState={updateAlertState} />

                </div>


              ): (                              <ContentSection alertState={alertState} updateAlertState={updateAlertState} />)}

            </div>

            {/* Gradient and Logo Section */}
            {(alertState.isGradient || alertState.useLogo) && (
              <div
                className={`grid ${alertState.isGradient && alertState.useLogo ? "grid-cols-2" : "grid-cols-1"} gap-6`}
              >
                {alertState.isGradient && (
                  <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6">
                      Gradient Configuration
                    </h3>
                    <GradientSection alertState={alertState} updateAlertState={updateAlertState} />
                  </div>
                )}
                {alertState.useLogo && (
                  <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between space-x-4 mb-6">
    <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 text-center">Configuration</h3>
    
    <div className="flex items-center bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg px-4 py-2 shadow-md">
    <span className="text-center">⚠️ The same file should be present in <span className="font-bold">/public</span></span>

    </div>
  </div>
                    <LogoSection
                      alertState={alertState}
                      isDark={isDark}
                      showLogoDialog={showLogoDialog}
                      setShowLogoDialog={setShowLogoDialog}
                      updateAlertState={updateAlertState}
                      logoPresets={logoPresets}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Style Configuration */}
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6">Style Configuration</h3>
              <ColorSection
                alertState={alertState}
                updateAlertState={updateAlertState}
                showGradientDialog={showGradientDialog}
                setShowGradientDialog={setShowGradientDialog}
                gradientPresets={gradientPresets}
              />

              {/* Border Style */}
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100">Border Style</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="borderColor" className="text-sm font-medium">
                    Border Color
                  </Label>
                  <Input
                    id="borderColor"
                    type="color"
                    value={alertState.borderColor}
                    onChange={(e) => updateAlertState({ borderColor: e.target.value })}
                    className="w-32 h-12 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="borderRadius" className="text-sm font-medium">
                    Border Radius
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="borderRadius"
                      min={0}
                      max={20}
                      step={1}
                      value={[alertState.borderRadius]}
                      onValueChange={(value) => updateAlertState({ borderRadius: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3ch]">
                      {alertState.borderRadius}px
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-4">
        <div className="w-1/2">
  {websites.length > 1 ? (
    <EmptyState></EmptyState>
  ) : (
    <RouteManager routes={routes} setRoutes={setRoutes} />
  )}
</div>

          <div className="w-1/2">
            <SpecificUserSection></SpecificUserSection>
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="p-6 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Sending to <span className="font-semibold">{websites?.length || 0}</span>{" "}
            {websites?.length === 1 ? "website" : "websites"}
          </div>
          <div className="space-x-4">
            <Button
              onClick={handleSendAlert}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Send Alert
            </Button>
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Preview
            </Button>
          </div>
        </CardFooter>


        
      </div>
    </div>
  )
}


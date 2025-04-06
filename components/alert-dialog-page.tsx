"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, Moon, Sun } from "lucide-react"
import { CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import type { AlertState } from "@/types/alert"
import type { Website } from "./Dashboard"
import { LogoSection } from "./cutomise/logo-section"
import { GradientSection } from "./cutomise/gradient-section"
import { ContentSection } from "./cutomise/content-section"
import { ColorSection } from "./cutomise/color-section"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import RouteManager from "./specific-route-component"
import SpecificUserSection from "./specific-user-component"
import { MyAlertDialog } from "./presets/alert-dialog/FirstAlertDialog"
import EmptyState from "./empty-route-state"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Preset definitions
const presets = [
  {
    id: "success",
    name: "Success",
    title: "Operation Successful",
    description: "Your action has been completed successfully.",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    borderColor: "#059669",
    borderRadius: 8,
    isGradient: false,
    useLogo: true,
    logoUrl: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVTZ1VMZnCYVDtCnH8Q0hBa4xPKcdlTb3qiX2Ap",
  },
  {
    id: "error",
    name: "Error",
    title: "Error Occurred",
    description: "There was a problem processing your request.",
    backgroundColor: "#ef4444",
    textColor: "#ffffff",
    borderColor: "#dc2626",
    borderRadius: 8,
    isGradient: false,
    useLogo: true,
    logoUrl: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT2JZEzPgKNydbqVWD94IMFUCcrBSsTkA7ZxuX",
  },
  {
    id: "info",
    name: "Information",
    title: "Important Information",
    description: "Here's something you should know.",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    borderColor: "#2563eb",
    borderRadius: 8,
    isGradient: false,
    useLogo: true,
    logoUrl: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT59RuXSzUbHhcr09eY2WSxJ6NTDQlutmECi4P",
  },
  {
    id: "warning",
    name: "Warning",
    title: "Warning",
    description: "Please proceed with caution.",
    backgroundColor: "#f59e0b",
    textColor: "#ffffff",
    borderColor: "#d97706",
    borderRadius: 8,
    isGradient: false,
    useLogo: true,
    logoUrl: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT2JZEzPgKNydbqVWD94IMFUCcrBSsTkA7ZxuX",
  },
]

// Gradient presets
const gradientPresets = [
  {
    id: "cosmic",
    name: "Cosmic Fusion",
    startColor: "#ff00cc",
    endColor: "#333399",
    direction: "to right",
    title: "Cosmic Experience",
    description: "Discover the universe of possibilities.",
    textColor: "#ffffff",
    borderColor: "#9333ea",
    borderRadius: 10,
  },
  {
    id: "sunset",
    name: "Sunset Blaze",
    startColor: "#ff512f",
    endColor: "#f09819",
    direction: "to right",
    title: "Limited Time Offer",
    description: "Don't miss out on this special deal!",
    textColor: "#ffffff",
    borderColor: "#ea580c",
    borderRadius: 10,
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    startColor: "#2193b0",
    endColor: "#6dd5ed",
    direction: "to right",
    title: "Stay Updated",
    description: "New features have been added to your account.",
    textColor: "#ffffff",
    borderColor: "#0891b2",
    borderRadius: 10,
  },
  {
    id: "forest",
    name: "Forest Mist",
    startColor: "#000428",
    endColor: "#004e92",
    direction: "to right",
    title: "Premium Access",
    description: "You've been granted premium access.",
    textColor: "#ffffff",
    borderColor: "#1e40af",
    borderRadius: 10,
  },
]

// Logo presets
const logoPresets = [
  { name: "Abstract1", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVTZ1VMZnCYVDtCnH8Q0hBa4xPKcdlTb3qiX2Ap" },
  { name: "GoalMet", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT59RuXSzUbHhcr09eY2WSxJ6NTDQlutmECi4P" },
  { name: "Caution", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVT2JZEzPgKNydbqVWD94IMFUCcrBSsTkA7ZxuX" },
  { name: "Abstract2", url: "https://075uvr3bfp.ufs.sh/f/SWDTAKMjNXVTn85x8EWqmi4vLjs7JGZFeXCpDSryg0hwuAnd" },
]

export default function AlertDialogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDark, setIsDark] = useState(true)
  const [websites, setWebsites] = useState<Website[]>([])
  const [showLogoDialog, setShowLogoDialog] = useState(false)
  const [showGradientDialog, setShowGradientDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [routes, setRoutes] = useState<string[]>([])
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [selectedGradientId, setSelectedGradientId] = useState<string | null>(null)

  const [alertState, setAlertState] = useState<AlertState>({
    title: "Alert Dialog Title",
    description: "This is an alert dialog message.",
    backgroundColor: "#2bc7e6",
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
    // Reset selected presets when manually changing settings
    if (
      Object.keys(updates).some((key) =>
        ["backgroundColor", "textColor", "borderColor", "borderRadius", "title", "description"].includes(key),
      )
    ) {
      setSelectedPresetId(null)
    }
    if (Object.keys(updates).some((key) => ["startColor", "endColor", "gradientDirection"].includes(key))) {
      setSelectedGradientId(null)
    }
  }

  const handleSendAlertDialog = async () => {
    try {
      const payload = {
        title: alertState.title,
        description: alertState.description,
        selectedType: "ALERT_DIALOG",
        style: alertState.isGradient ? "GRADIENT" : "NATIVE",
        backgroundColor: alertState.isGradient
          ? `linear-gradient(${alertState.gradientDirection}, ${alertState.startColor}, ${alertState.endColor})`
          : alertState.backgroundColor,
        textColor: alertState.textColor,
        borderColor: alertState.borderColor,
        fileName: alertState.fileName,
        uploadedFileUrl: alertState.uploadedFileUrl,
        routes: routes,
        borderRadius: alertState.borderRadius,
      }

      const response = await axios.post("/api/notify", {
        payload,
        websites: websites,
      })

      if (response.status === 200) {
        console.log("Alert Dialog sent successfully")
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
      console.error("Error sending alert dialog:", error)
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

  const applyPreset = (preset: (typeof presets)[0]) => {
    setSelectedPresetId(preset.id)
    setSelectedGradientId(null)
    setAlertState({
      ...alertState,
      title: preset.title,
      description: preset.description,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      borderColor: preset.borderColor,
      borderRadius: preset.borderRadius,
      isGradient: false,
      useLogo: preset.useLogo,
      uploadedFileUrl: preset.logoUrl,
    })
  }

  const applyGradientPreset = (preset: (typeof gradientPresets)[0]) => {
    setSelectedGradientId(preset.id)
    setSelectedPresetId(null)
    setAlertState({
      ...alertState,
      title: preset.title,
      description: preset.description,
      startColor: preset.startColor,
      endColor: preset.endColor,
      gradientDirection: preset.direction,
      textColor: preset.textColor,
      borderColor: preset.borderColor,
      borderRadius: preset.borderRadius,
      isGradient: true,
      useLogo: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <Button
              onClick={() => setShowPreview(false)}
              variant="ghost"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
            >
              Close Preview
            </Button>
            <MyAlertDialog
              preview={false}
              title={alertState.title}
              description={alertState.description}
              backgroundColor={getBackgroundStyle()}
              borderColor={alertState.borderColor}
              textColor={alertState.textColor}
              onClose={() => setShowPreview(false)}
              isOpen={true}
              className="border shadow-lg"
              uploadedFileUrl={alertState.useLogo ? alertState.uploadedFileUrl : undefined}
              borderRadius={alertState.borderRadius}
            />
          </div>
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
          {/* Left Column - Preview and Content */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6">Alert Content</h3>

              <ContentSection alertState={alertState} updateAlertState={updateAlertState} />
            </div>
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
            <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Choose a Gradient Preset
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gradientPresets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => applyGradientPreset(preset)}
            className={`
              relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out
              hover:scale-[1.025] hover:shadow-xl
              ${
                selectedGradientId === preset.id
                  ? "ring-4 ring-teal-500 dark:ring-teal-400 scale-[1.03]"
                  : "ring-1 ring-gray-200 dark:ring-zinc-700"
              }
            `}
            style={{
              background: `linear-gradient(${preset.direction}, ${preset.startColor}, ${preset.endColor})`,
            }}
          >
            <div className="flex items-center justify-center h-32 px-4 backdrop-blur-sm bg-black/10">
              <h4
                className="text-lg font-medium drop-shadow"
                style={{ color: preset.textColor }}
              >
                {preset.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
            </div>
            <GradientSection alertState={alertState} updateAlertState={updateAlertState} />
            
          </div>

          {/* Right Column - Presets and Advanced Configuration */}
          <div className="space-y-6">
            {/* Preset Selection */}


            {/* Advanced Configuration */}
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 mb-6">Advanced Configuration</h3>

              <Accordion type="multiple" defaultValue={["border","logo"]} className="w-full">
                {/* Style Configuration */}
                <AccordionItem value="style">
                  <AccordionTrigger className="text-lg font-medium">Style Configuration</AccordionTrigger>
                  <AccordionContent>
                    <ColorSection
                      alertState={alertState}
                      updateAlertState={updateAlertState}
                      showGradientDialog={showGradientDialog}
                      setShowGradientDialog={setShowGradientDialog}
                      gradientPresets={gradientPresets}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Border Configuration */}
                <AccordionItem  value="border">
                  <AccordionTrigger className="text-lg font-medium">Border Configuration</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
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
                  </AccordionContent>
                </AccordionItem>

                {/* Logo Configuration */}
                <AccordionItem  value="logo">
                  <AccordionTrigger className="text-lg font-medium">Logo Configuration</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">

                      {(
                        <LogoSection
                          alertState={alertState}
                          isDark={isDark}
                          showLogoDialog={showLogoDialog}
                          setShowLogoDialog={setShowLogoDialog}
                          updateAlertState={updateAlertState}
                          logoPresets={logoPresets}
                        />
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div>
            <div className="rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-50/90 to-white/80 dark:from-zinc-900/90 dark:to-zinc-800/80 backdrop-blur-md border border-white/50 dark:border-zinc-800/50">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800/50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-indigo-500" />
                    Preview
                  </h2>
                  <Button
                    onClick={() => setShowPreview(true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  >
                    Full Screen
                  </Button>
                </div>
                <div className="flex items-center justify-center p-8 min-h-[320px]">
                  <MyAlertDialog
                    preview={true}
                    title={alertState.title}
                    description={alertState.description}
                    backgroundColor={getBackgroundStyle()}
                    borderColor={alertState.borderColor}
                    textColor={alertState.textColor}
                    onClose={() => {}}
                    isOpen={true}
                    uploadedFileUrl={alertState.useLogo ? alertState.uploadedFileUrl : undefined}
                    borderRadius={alertState.borderRadius}
                    className="shadow-xl pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Targeting Section */}
        <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2 bg-white dark:bg-zinc-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-4">Route Targeting</h3>
            {websites.length > 1 ? <EmptyState /> : <RouteManager routes={routes} setRoutes={setRoutes} />}
          </div>
          <div className="w-full md:w-1/2 bg-white dark:bg-zinc-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-4">User Targeting</h3>
            <SpecificUserSection />
          </div>
        </div>

        {/* Footer */}
        <CardFooter className="p-6 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 rounded-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Sending to <span className="font-semibold">{websites?.length || 0}</span>{" "}
            {websites?.length === 1 ? "website" : "websites"}
          </div>
          <div className="space-x-4">
            <Button
              onClick={handleSendAlertDialog}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Send Alert Dialog
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


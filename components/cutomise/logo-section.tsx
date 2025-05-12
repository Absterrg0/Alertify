import type React from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Image } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileUpload } from "@/components/file-upload"

interface LogoSectionProps {
  alertState: {
    uploadedFileUrl?: string
    fileName?: string
  }
  isDark: boolean
  showLogoDialog: boolean
  setShowLogoDialog: (value: boolean) => void
  updateAlertState: (state: Partial<{ uploadedFileUrl: string; fileName: string }>) => void
  logoPresets: { name: string; url: string }[]
}

export function LogoSection({
  alertState,
  isDark,
  showLogoDialog,
  setShowLogoDialog,
  updateAlertState,
  logoPresets,
}: LogoSectionProps) {

  const applyLogoPreset = (preset: { name: string; url: string }) => {
    updateAlertState({
      uploadedFileUrl: preset.url,
      fileName: preset.name+'.png',
    })
    setShowLogoDialog(false)
  }

  return (
    <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100">Logo Presets:</h3>
        <AlertDialog open={showLogoDialog} onOpenChange={setShowLogoDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Wand2 className="h-4 w-4" />
              Choose Preset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Choose a Logo Preset</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid grid-cols-2 gap-2">
              {logoPresets.map((preset) => (
                <Button
                  key={preset.name}
                  onClick={() => applyLogoPreset(preset)}
                  variant="outline"
                  className="h-20 relative group hover:border-teal-500 transition-all duration-300"
                >
                  <Image className="h-8 w-8 mb-2" />
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2">
          <FileUpload
            isDark={isDark}
            onUploadComplete={(url, name) => {
              updateAlertState({
                uploadedFileUrl: url,
                fileName: name,
              })
            }}
            currentFile={alertState.uploadedFileUrl}
            uploadType="imageUploader"
          />
        </div>
      </div>
    </div>
  )
}


import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Button } from "@/components/ui/button"
import { Palette, ChevronRight, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { AlertState } from "@/types/alert"
import { Dispatch, SetStateAction, useState } from "react"

interface ColorSectionProps {
  alertState: AlertState;
  updateAlertState: (updates: Partial<AlertState>) => void;
  showGradientDialog: boolean;
  setShowGradientDialog: Dispatch<SetStateAction<boolean>>;
  gradientPresets: Array<{
    name: string;
    start: string;
    end: string;
  }>;
}

export const ColorSection = ({ 
  alertState, 
  updateAlertState, 
  showGradientDialog, 
  setShowGradientDialog, 
  gradientPresets 
}: ColorSectionProps) => {
  const [activeColor, setActiveColor] = useState<'start' | 'end'>('start')

  const applyGradientPreset = (preset: { start: string; end: string }) => {
    updateAlertState({ startColor: preset.start, endColor: preset.end })
    setShowGradientDialog(false)
  }

  const handleColorChange = (color: string) => {
    if (alertState.isGradient) {
      updateAlertState(
        activeColor === 'start' 
          ? { startColor: color }
          : { endColor: color }
      )
    } else {
      updateAlertState({ backgroundColor: color })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100">Color Selection</h3>

      {alertState.isGradient && (
        <>
          <div className="flex gap-2">
            <Button
              variant={activeColor === 'start' ? 'default' : 'outline'}
              onClick={() => setActiveColor('start')}
              className="flex-1"
            >
              Start Color
            </Button>
            <Button
              variant={activeColor === 'end' ? 'default' : 'outline'}
              onClick={() => setActiveColor('end')}
              className="flex-1"
            >
              End Color
            </Button>
          </div>

          <AlertDialog open={showGradientDialog} onOpenChange={setShowGradientDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                  <span className="font-medium">Gradient Presets</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[550px] p-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl shadow-2xl">
              <AlertDialogHeader className="p-4 border-b border-gray-200 dark:border-zinc-700">
                <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
                  Choose a Gradient Preset
                </AlertDialogTitle>
              </AlertDialogHeader>
              <ScrollArea className="h-[400px] p-4">
                <div className="grid grid-cols-2 gap-3">
                  {gradientPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => applyGradientPreset(preset)}
                      className="h-32 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg relative group"
                      style={{
                        background: `linear-gradient(to right, ${preset.start}, ${preset.end})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white">
                        <span className="font-medium text-sm">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-gray-200 dark:border-zinc-700 flex justify-end">
                <Button
                  onClick={() => setShowGradientDialog(false)}
                  size="sm"
                  variant="secondary"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      <div>
        <Label className="text-sm font-medium mb-2 block">
          {alertState.isGradient 
            ? `Select ${activeColor === 'start' ? 'Start' : 'End'} Color`
            : 'Background Color'
          }
        </Label>
        <ColorPicker
          width="100%"
          height="300px"
          onColorChange={handleColorChange}
        />
      </div>

    </div>
  )
}
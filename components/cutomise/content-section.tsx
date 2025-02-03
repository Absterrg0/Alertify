import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AlertState } from "@/types/alert"

interface ContentSectionProps {
  alertState: AlertState;
  updateAlertState: (updates: Partial<AlertState>) => void;
}

export const ContentSection = ({ alertState, updateAlertState }: ContentSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="title" className="text-sm font-medium">
          Title
        </Label>
        <div className="relative">
          <Input
            id="title"
            value={alertState.title}
            onChange={(e) => updateAlertState({ title: e.target.value })}
            className="w-full pr-12 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <input
              type="color"
              value={alertState.textColor}
              onChange={(e) => updateAlertState({ textColor: e.target.value })}
              className="w-8 h-8 rounded-md cursor-pointer bg-transparent hover:scale-105 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="description" className="text-sm font-medium">
          Content
        </Label>
        <Textarea
          id="description"
          value={alertState.description}
          onChange={(e) => updateAlertState({ description: e.target.value })}
          className="w-full min-h-[120px] bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg"
        />
      </div>
    </div>
  )
}

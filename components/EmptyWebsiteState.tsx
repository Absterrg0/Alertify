import { Globe, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface EmptyWebsiteStateProps {
  onAddWebsite: () => void;
}

export function EmptyWebsiteState({ onAddWebsite }: EmptyWebsiteStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
        <Globe className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">No Websites Added Yet</h3>
      <p className="mb-6 max-w-sm text-zinc-600 dark:text-zinc-400">
        Start by adding your first website to manage and monitor its status.
      </p>
      <Button
        onClick={onAddWebsite}
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Website
      </Button>
    </div>
  )
}


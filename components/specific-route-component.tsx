import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Eye, Trash2, Info, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DialogClose } from "@radix-ui/react-dialog"

interface Preset {
  id: string
  name: string
  routes: string[]
}

interface InputProps {
  routes: string[]
  setRoutes: (routes: string[]) => void
}

const RouteManager = ({ routes, setRoutes }: InputProps) => {
  const [presets, setPresets] = useState<Preset[]>([])
  const [presetName, setPresetName] = useState("")
  const [showPresets, setShowPresets] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newRoute, setNewRoute] = useState("")
  const { toast } = useToast()

  // Fetch existing presets
  const fetchPresets = async () => {
    try {
      const { data } = await axios.get("/api/route-presets")
      setPresets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load presets",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchPresets()
  }, [])

  const handleAddRoute = () => {
    if (newRoute.trim() !== "" && routes.length < 8) {
      setRoutes([...routes, newRoute.trim()])
      setNewRoute("")
    } else if (routes.length >= 8) {
      toast({
        title: "Maximum routes reached",
        description: "You can only add up to 8 routes. Remove existing routes to add new ones.",
      })
    }
  }

  const handleRemoveRoute = (index: number) => {
    const updatedRoutes = routes.filter((_, i) => i !== index)
    setRoutes(updatedRoutes)
  }

  const handlePresetClick = (preset: Preset) => {
    setRoutes(preset.routes)
    setShowPresets(false)
    toast({
      title: "Routes Loaded",
      description: `Successfully loaded routes from preset "${preset.name}"`,
    })
  }

  const savePreset = async () => {
    if (!presetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the preset before saving.",
        variant: "destructive",
      })
      return
    }

    if (routes.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one route",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await axios.post("/api/route-presets", {
        name: presetName,
        routes: routes,
      })

      await fetchPresets()
      setPresetName("")

      toast({
        title: "Success",
        description: "Preset saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preset",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deletePreset = async (presetId: string) => {
    try {
      await axios.delete(`/api/route-presets/${presetId}`)
      await fetchPresets()

      toast({
        title: "Success",
        description: "Preset deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete preset",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800/50 dark:to-zinc-900/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100">Route Configuration</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-zinc-100">
                  Route Configuration Help
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </DialogHeader>
              <ScrollArea className="mt-4 max-h-[60vh] pr-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4">
                  <p>Configure routes for your application. Here's how to use the route configuration:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Exact match:</strong> Use /path (e.g., /blogs) to match only that specific route.
                    </li>
                    <li>
                      <strong>Wildcard match:</strong> Use /path/* (e.g., /blogs/*) to match the specified route and all
                      its subroutes.
                    </li>
                    <li>
                      <strong>Adding routes:</strong> Enter a route in the input field and click "Add Route" to add it
                      to the list.
                    </li>
                  </ul>
                  <p>Examples:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>/blogs - Will only match the exact /blogs route</li>
                    <li>
                      /blogs/* - Will match /blogs and all its subroutes like /blogs/post-1, /blogs/category/tech, etc.
                    </li>
                  </ul>
                  <p>You can save commonly used configurations as presets for quick access in future sessions.</p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <Dialog open={showPresets} onOpenChange={setShowPresets}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Presets
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6">
            <DialogHeader className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-700 pb-4 mb-4">
              <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-zinc-100 flex justify-between w-full">
                <div>Saved Presets</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPresets(false)}
                  className="h-8 w-8 p-0 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-100"
                >
                  <span className="text-xl">×</span>
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 border-b border-gray-200 dark:border-zinc-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 dark:text-zinc-100">{preset.name}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePreset(preset.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePresetClick(preset)}
                        className="h-8 w-8 p-0 text-green-500 hover:text-green-400"
                      >
                        <span className="text-xl">✔</span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {preset.routes.map((route, idx) => (
                      <div key={idx}>{route}</div>
                    ))}
                  </div>
                </div>
              ))}
              {presets.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-zinc-400">No presets saved yet</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter a route (e.g., /blogs/*)"
          value={newRoute}
          onChange={(e) => setNewRoute(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddRoute()
            }
          }}
          className="flex-grow"
        />
        <Button onClick={handleAddRoute}>Add Route</Button>
      </div>

      <ScrollArea className="h-[200px] w-full rounded-md border">
        <div className="grid grid-cols-2 gap-2 p-4">
          {routes.slice(0, 8).map((route, index) => (
            <div key={index} className="flex items-center justify-between bg-white dark:bg-zinc-800 p-2 rounded-md">
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate mr-2">{route}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveRoute(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      {routes.length >= 8 && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          Maximum number of routes (8) reached. Remove existing routes to add new ones.
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="presetName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preset Name
          </Label>
          <Input
            id="presetName"
            placeholder="Enter preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={savePreset} className="mt-1 md:mt-7" disabled={isLoading}>
          {isLoading ? <span className="animate-spin">↻</span> : <Plus className="h-4 w-4 mr-2" />}
          Add to Preset
        </Button>
      </div>
    </div>
  )
}

export default RouteManager


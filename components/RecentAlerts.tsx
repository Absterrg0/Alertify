import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

const alerts = [
  {
    id: 1,
    type: "error",
    title: "Website Offline",
    description: "Blog is currently unreachable",
    timestamp: "2 minutes ago"
  },
  {
    id: 2,
    type: "success",
    title: "Website Restored",
    description: "Main Website is back online",
    timestamp: "1 hour ago"
  },
  {
    id: 3,
    type: "warning",
    title: "High Latency",
    description: "Store is experiencing delays",
    timestamp: "3 hours ago"
  }
]

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle
}

export function RecentAlerts() {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = iconMap[alert.type as keyof typeof iconMap]
          return (
            <Alert key={alert.id} variant={alert.type as "default" | "destructive"}>
              <Icon className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                {alert.description}
                <span className="text-xs text-gray-500">{alert.timestamp}</span>
              </AlertDescription>
            </Alert>
          )
        })}
      </div>
    </ScrollArea>
  )
}


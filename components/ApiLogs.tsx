import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const logs = [
  {
    id: 1,
    endpoint: "/api/websites/status",
    method: "GET",
    status: 200,
    timestamp: "12:00:00"
  },
  {
    id: 2,
    endpoint: "/api/alerts/create",
    method: "POST",
    status: 201,
    timestamp: "11:59:00"
  },
  {
    id: 3,
    endpoint: "/api/websites/verify",
    method: "POST",
    status: 400,
    timestamp: "11:58:00"
  }
]

export function ApiLogs() {
  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between p-2 text-sm bg-gray-50 dark:bg-gray-900 rounded"
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-16 justify-center">
                {log.method}
              </Badge>
              <span className="font-mono">{log.endpoint}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={log.status < 400 ? "default" : "destructive"}
                className="w-16 justify-center"
              >
                {log.status}
              </Badge>
              <span className="text-gray-500">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Zap, CheckCircle } from 'lucide-react'

export function RecentNotifications() {
  const recentNotifications = [
    { id: 1, title: "New Website Added", description: "Your portfolio site is now live!", icon: Zap, time: "2 minutes ago" },
    { id: 2, title: "Verification Complete", description: "Your blog has been verified", icon: CheckCircle, time: "1 hour ago" },
    { id: 3, title: "Traffic Spike", description: "Unusual traffic detected on your store", icon: Bell, time: "3 hours ago" },
  ]

  return (
    <Card className="bg-white bg-opacity-10 backdrop-blur-lg border-0 shadow-xl h-full">
      <CardHeader className="border-b border-white border-opacity-10">
        <CardTitle className="text-2xl font-bold text-white">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 overflow-auto max-h-[calc(100vh-12rem)]">
        {recentNotifications.map((notification) => (
          <Alert key={notification.id} className="mb-4 bg-white bg-opacity-5 border-0 transition-all hover:bg-opacity-10">
            <div className="flex items-start">
              <notification.icon className="h-5 w-5 text-pink-300 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-grow">
                <AlertTitle className="text-white font-semibold mb-1">{notification.title}</AlertTitle>
                <AlertDescription className="text-gray-200">{notification.description}</AlertDescription>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}


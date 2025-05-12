import { Card,CardContent,CardHeader,CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"



export const ConfigurationSkeleton = () => (
    <Card className="bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-xl transition-all duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-zinc-700">
        <CardTitle><Skeleton className="h-8 w-3/4" /></CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-36 w-full" />
      </CardContent>
    </Card>
  )
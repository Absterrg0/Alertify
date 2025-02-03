"use client"

import { useEffect, useState } from "react"
import { TrendingUp, BarChart3, AlertTriangle } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

// Define the type for an API request log
type ApiRequest = {
  id: string
  name: string // Website name
  userId: string
  timestamp: string
  endpoint: string
  success: boolean
}

type ChartData = {
  name: string
  count: number
  fill: string
}

const websiteColors: Record<string, string> = {
  "example.com": "hsl(var(--chart-1))",
  "mywebsite.com": "hsl(var(--chart-2))",
  "testapp.io": "hsl(var(--chart-3))",
  "project.dev": "hsl(var(--chart-4))",
  default: "hsl(var(--chart-5))",
}

export function ApiRequestGraph() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchApiLogs()
  }, [])

  const fetchApiLogs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<{ logs: ApiRequest[] }>("/api/user/getApiLogs")
      const logs = response.data.logs

      const websiteCountMap = logs.reduce<Record<string, number>>((acc, log) => {
        acc[log.name] = (acc[log.name] || 0) + 1
        return acc
      }, {})

      const formattedData: ChartData[] = Object.entries(websiteCountMap).map(([name, count]) => ({
        name,
        count,
        fill: websiteColors[name] || websiteColors.default,
      }))

      setChartData(formattedData)
    } catch (error) {
      console.error("Error fetching API logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartConfig: ChartConfig = {
    count: { label: "Requests" },
    ...Object.fromEntries(
      chartData.map((data) => [
        data.name,
        { label: data.name, color: data.fill },
      ])
    ),
  }

  // Truncate long website names
  const truncateName = (name: string, maxLength: number = 15) => 
    name.length > maxLength ? `${name.slice(0, maxLength)}...` : name

  return (
    <Card className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700 w-full max-w-3xl mx-auto rounded-xl overflow-hidden transition-all duration-300 relative">
      <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 bg-gray-200/50 dark:bg-zinc-700/30 rounded-lg backdrop-blur-sm">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-zinc-300" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-zinc-200">
              Website API Requests
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <AnimatePresence>
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.4 }}
              className="flex justify-center items-center h-64"
            >
              <p className="text-center text-gray-600 dark:text-gray-400">Loading data...</p>
            </motion.div>
          ) : chartData.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.4 }}
              className="flex flex-col justify-center items-center h-64 text-center space-y-4"
            >
              <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-zinc-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-zinc-300">No API Requests Yet</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2">
                  Start sending requests to see your API activity graph
                </p>
              </div>
            </motion.div>
          ) : (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false} 
                    width={100} 
                    tickFormatter={(value) => truncateName(value)}
                    tick={{ fill: "white", fontSize: 12 }} 
                  />
                  <XAxis dataKey="count" type="number" hide />
                  <Tooltip 
                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} 
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-zinc-900 p-2 rounded-md shadow-lg">
                            <p className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                              {data.name}: {data.count} Requests
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                  <Bar dataKey="count" radius={6} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
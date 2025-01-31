"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {ApiRequestGraph} from "./api-request-graph"
import ApiRequestTable from "./api-request-table"
type ApiRequest = {
  id: string
  userId: string
  timestamp: Date
  endpoint: string
  success: boolean
}

interface ApiRequestManagerProps {
  onRequestsChange?: (requests: ApiRequest[]) => void
  initialData?: ApiRequest[]
}

export default function ApiRequestManager({ onRequestsChange, initialData = [] }: ApiRequestManagerProps) {
  const [mounted, setMounted] = useState(false)
  const [requests, setRequests] = useState<ApiRequest[]>(initialData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchApiLogs()
  }, [])

  useEffect(() => {
    if (mounted && onRequestsChange) {
      onRequestsChange(requests)
    }
  }, [requests, mounted, onRequestsChange])

  const fetchApiLogs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/user/getApiLogs")
      setRequests(response.data.logs)
    } catch (error) {
      console.error("Error fetching API logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ApiRequestTable requests={requests} isLoading={isLoading} />
    </div>
  )
}


export interface Activity {
  id: string
  name: string
  time: string
  type: 'website' | 'api' | 'analytics'
  status: 'active' | 'pending' | 'completed'
}

export interface MetricData {
  value: number
  goal: number
  average: number
}

export interface DayActivity {
  day: number
  isActive: boolean
  current?: boolean
}


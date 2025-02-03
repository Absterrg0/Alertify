export type GradientDirection = "to right" | "to bottom" | "45deg" | "-45deg"

export interface AlertState {
  title: string
  description: string
  backgroundColor: string
  startColor: string
  endColor: string
  gradientDirection: string
  textColor: string
  borderColor: string
  isGradient: boolean
  useLogo: boolean
  uploadedFileUrl: string
  fileName: string
  borderRadius: number
}

export type GradientPreset = {
  name: string
  start: string
  end: string
}

export type LogoPreset = {
  name: string
  url: string
}


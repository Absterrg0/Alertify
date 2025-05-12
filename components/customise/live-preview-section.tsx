import { MyAlert } from "@/components/presets/alerts/FirstAlert"
import type { AlertState } from "@/types/alert"

interface LivePreviewSectionProps {
  alertState: AlertState
}

export const LivePreviewSection = ({ alertState }: LivePreviewSectionProps) => {
  const getBackgroundStyle = () => {
    if (alertState.isGradient) {
      return `linear-gradient(${alertState.gradientDirection}, ${alertState.startColor}, ${alertState.endColor})`
    }
    return alertState.backgroundColor
  }

  return (
    <MyAlert
      preview={false}
      title={alertState.title}
      description={alertState.description}
      backgroundColor={getBackgroundStyle()}
      borderColor={alertState.borderColor}
      textColor={alertState.textColor}
      onClose={() => {}}
      uploadedFileUrl={alertState.useLogo ? alertState.uploadedFileUrl : undefined}
      borderRadius={alertState.borderRadius}
    />
  )
}


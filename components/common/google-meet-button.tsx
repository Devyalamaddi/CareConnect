"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Video } from "lucide-react"
import { useLanguage } from "@/components/language/language-provider"

interface GoogleMeetButtonProps {
  patientName?: string
  onStartCall?: () => void
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
}

export function GoogleMeetButton({
  patientName,
  onStartCall,
  size = "sm",
  variant = "default",
}: GoogleMeetButtonProps) {
  const { t } = useLanguage()

  const handleStartCall = () => {
    // TODO: Integrate with Google Meet API
    // TODO: Create meeting room with proper permissions
    // TODO: Send meeting invitation to patient
    // TODO: Log meeting in patient records

    // Mock Google Meet integration
    const meetingId = `healthcare-${Date.now()}`
    const meetingUrl = `https://meet.google.com/${meetingId}`

    // Open Google Meet in new tab
    window.open(meetingUrl, "_blank")

    // Call parent handler if provided
    onStartCall?.()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleStartCall}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Video className="h-4 w-4 mr-2" />
            {t("startVideoCall")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{patientName ? `${t("startCallWith")} ${patientName}` : t("opensGoogleMeet")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

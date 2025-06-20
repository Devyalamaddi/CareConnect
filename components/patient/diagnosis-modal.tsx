"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Calendar, FileText, Phone, Download } from "lucide-react"
import { useLanguage } from "@/components/language/language-provider"

interface DiagnosisModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DiagnosisModal({ isOpen, onClose }: DiagnosisModalProps) {
  const { t } = useLanguage()

  // TODO: Replace with actual AI diagnosis data from backend
  const mockDiagnosis = {
    condition: "Upper Respiratory Infection",
    confidence: 87,
    severity: "mild",
    description:
      "Based on your symptoms, you likely have a common cold or upper respiratory infection. This is typically caused by viral infections and should resolve within 7-10 days.",
    recommendations: [
      "Get plenty of rest",
      "Stay hydrated by drinking fluids",
      "Use a humidifier or breathe steam",
      "Consider over-the-counter pain relievers",
      "Gargle with warm salt water",
    ],
    whenToSeekCare: [
      "Fever above 101.3°F (38.5°C)",
      "Difficulty breathing or shortness of breath",
      "Severe headache or sinus pain",
      "Symptoms worsen after 10 days",
    ],
    followUp: {
      recommended: true,
      timeframe: "3-5 days",
      reason: "Monitor symptom progression",
    },
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "severe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>{t("aiDiagnosisResult")}</span>
          </DialogTitle>
          <DialogDescription>{t("aiDiagnosisDesc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Diagnosis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("primaryDiagnosis")}</span>
                <Badge className={getSeverityColor(mockDiagnosis.severity)}>
                  {t(mockDiagnosis.severity)} {t("severity")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{mockDiagnosis.condition}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{mockDiagnosis.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t("confidenceLevel")}</span>
                    <span className={`text-sm font-bold ${getConfidenceColor(mockDiagnosis.confidence)}`}>
                      {mockDiagnosis.confidence}%
                    </span>
                  </div>
                  <Progress value={mockDiagnosis.confidence} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recommendations")}</CardTitle>
              <CardDescription>{t("followRecommendations")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockDiagnosis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* When to Seek Care */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>{t("whenToSeekCare")}</span>
              </CardTitle>
              <CardDescription>{t("seekCareDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockDiagnosis.whenToSeekCare.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{warning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Follow-up */}
          {mockDiagnosis.followUp.recommended && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>{t("followUp")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  {t("followUpRecommended")} {mockDiagnosis.followUp.timeframe} {t("to")}{" "}
                  {mockDiagnosis.followUp.reason.toLowerCase()}.
                </p>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("scheduleFollowUp")}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              {t("consultDoctor")}
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              {t("saveToRecords")}
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              {t("downloadReport")}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">{t("importantDisclaimer")}</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{t("aiDisclaimerText")}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

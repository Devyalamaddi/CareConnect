"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, User, UserCheck, Shield, Zap, Tablet, TabletsIcon, AlarmCheck, PhoneCall } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language/language-provider"
import { LanguageToggle } from "@/components/language/language-toggle"
import { Logo } from "@/components/common/logo"
import CTAButton from "@/components/CTAButton"

export default function HomePage() {
  const [userType, setUserType] = useState<"patient" | "doctor" | "police">("patient")
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const router = useRouter()
  const { t } = useLanguage()

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual authentication with backend API
    // TODO: Validate credentials and handle errors
    // TODO: Store JWT token and user session

    // Mock authentication - redirect based on user type
    if (userType === "patient") {
      router.push("/patient/dashboard")
    } else if (userType === "doctor") {
      router.push("/doctor/dashboard")
    } else if (userType === "police") {
      router.push("/police/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Logo size="lg" className="text-gray-900 dark:text-white" />
          <LanguageToggle />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("heroTitle")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t("heroSubtitle")}</p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>{t("symptomScreener")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{t("symptomScreenerDesc")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <AlarmCheck className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>{t("medReminderCompanion")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{t("medReminderCompanionDesc")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <PhoneCall className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>{t("postOpFollowup")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{t("postOpFollowupDesc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Auth Section */}
          <CTAButton />
        </div>
      </div>
    </div>
  )
}

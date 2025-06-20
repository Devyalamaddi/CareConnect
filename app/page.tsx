"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, User, UserCheck, Shield, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language/language-provider"
import { LanguageToggle } from "@/components/language/language-toggle"
import { Logo } from "@/components/common/logo"

export default function HomePage() {
  const [userType, setUserType] = useState<"patient" | "doctor">("patient")
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
    } else {
      router.push("/doctor/dashboard")
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
                  <CardTitle>{t("aiDiagnosis")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{t("aiDiagnosisDesc")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>{t("secureRecords")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{t("secureRecordsDesc")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>{t("instantConnect")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{t("instantConnectDesc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Auth Section */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">{t("getStarted")}</CardTitle>
              <CardDescription className="text-center">{t("chooseUserType")}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* User Type Toggle */}
              <div className="flex space-x-2 mb-6">
                <Button
                  variant={userType === "patient" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUserType("patient")}
                >
                  <User className="h-4 w-4 mr-2" />
                  {t("patient")}
                </Button>
                <Button
                  variant={userType === "doctor" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUserType("doctor")}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  {t("doctor")}
                </Button>
              </div>

              {/* Auth Tabs */}
              <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t("login")}</TabsTrigger>
                  <TabsTrigger value="signup">{t("signup")}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input id="email" type="email" placeholder={t("emailPlaceholder")} required />
                    </div>
                    <div>
                      <Label htmlFor="password">{t("password")}</Label>
                      <Input id="password" type="password" placeholder={t("passwordPlaceholder")} required />
                    </div>
                    <Button type="submit" className="w-full">
                      {t("loginAs")} {userType === "patient" ? t("patient") : t("doctor")}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t("fullName")}</Label>
                      <Input id="name" type="text" placeholder={t("fullNamePlaceholder")} required />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">{t("email")}</Label>
                      <Input id="signup-email" type="email" placeholder={t("emailPlaceholder")} required />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">{t("password")}</Label>
                      <Input id="signup-password" type="password" placeholder={t("passwordPlaceholder")} required />
                    </div>
                    {userType === "doctor" && (
                      <div>
                        <Label htmlFor="license">{t("medicalLicense")}</Label>
                        <Input id="license" type="text" placeholder={t("medicalLicensePlaceholder")} required />
                      </div>
                    )}
                    <Button type="submit" className="w-full">
                      {t("signupAs")} {userType === "patient" ? t("patient") : t("doctor")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

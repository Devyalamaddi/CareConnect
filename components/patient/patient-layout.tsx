"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Home, FileText, MessageSquare, Calendar, LogOut, Plus, Bot, MapPin, Pill, Activity, AlarmClock, SoupIcon, Menu, X, Target, Scan, BicepsFlexed, Dumbbell } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/components/language/language-provider"
import { LanguageToggle } from "@/components/language/language-toggle"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PWAInstallBanner } from "@/components/pwa/pwa-install-banner"
import { OfflineIndicator } from "@/components/pwa/offline-indicator"
import { useEffect, useState } from "react"
import { Logo } from "@/components/common/logo"

interface PatientLayoutProps {
  children: ReactNode
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Ensure we're in patient context
  useEffect(() => {
    if (!pathname.startsWith("/patient")) {
      // If not in patient routes, redirect to patient dashboard
      router.push("/patient/dashboard")
    }
  }, [pathname, router])

  // Inject OmniDimension web widget script
  useEffect(() => {
    if (!document.getElementById("omnidimension-web-widget")) {
      const script = document.createElement("script")
      script.id = "omnidimension-web-widget"
      script.async = true
      script.src = "https://backend.omnidim.io/web_widget.js?secret_key=65e1ca056af208664a78c4660fe44972"
      document.body.appendChild(script)
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script)
      }
    }
  }, [])

  const navigation = [
    { name: t("dashboard"), href: "/patient/dashboard", icon: Home },
    { name: t("symptomScreening"), href: "/patient/symptoms", icon: Plus },
    { name: t("medReminder"), href: "/patient/med-reminder", icon: AlarmClock },
    { name: t("postOpFollowup"), href: "/patient/postop-followup", icon: Activity },
    { name: t("recipes"), href: "/patient/recipes", icon: SoupIcon },
    { name: t("scanAnalysis"), href: "/patient/diagnosys", icon: Scan },
    { name: t("appointments"), href: "/patient/appointments", icon: Calendar },
    { name: t("nearbyHospitals"), href: "/patient/hospitals", icon: MapPin },
    { name: t("medicalRecords"), href: "/patient/records", icon: FileText },
    { name: t("prescriptions"), href: "/patient/prescriptions", icon: Pill },
    { name: t("aiPrescriptions"), href: "/patient/ai-prescriptions", icon: Bot },
    { name: t("goals"), href: "/patient/goals", icon: Target },
    { name: t("healthFitnessPlan"), href: "/patient/health-plan", icon: Dumbbell },
    { name: t("workout"), href: "/patient/workout", icon: BicepsFlexed },
    // { name: t("chat"), href: "/patient/chat", icon: MessageSquare },
  ]

  const handleLogout = () => {
    // TODO: Clear user session and tokens
    // TODO: Call logout API endpoint
    // TODO: Clear local storage/cookies
    router.push("/auth")
  }

  const handleNavigationClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PWAInstallBanner />
      <OfflineIndicator />

      {/* Sticky Header with Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="md:hidden"
              >
                {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <Logo size="md" variant="default" className="text-blue-900 dark:text-blue-100" />
            
          </div>
          <div className="flex items-center space-x-4">
            
            <LanguageToggle />
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isMobile 
            ? (isMobileSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64')
            : 'w-64'
        }`}
        style={{ top: '64px' }} // Account for sticky header height
      >
        <div
          className="flex flex-col h-full overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 64px)' }}
        >
          {/* User Info */}
          <div className={`py-4 bg-blue-25 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 px-6`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">D</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Devendra</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{t("patient")}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-2 transition-all duration-300 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={handleNavigationClick}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full transition-all duration-300 ${
                      isActive ? "bg-blue-600 text-white" : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    } justify-start`}
                    title={undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="ml-3">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Actions (Sticky Logout) */}
          <div className="border-t border-gray-200 dark:border-gray-700 transition-all duration-300 p-4 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isMobile ? 'ml-0' : 'ml-64'
      }`} style={{ marginTop: '64px' }}>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
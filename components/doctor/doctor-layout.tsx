"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Home, Users, Calendar, MessageSquare, FileText, LogOut, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/components/language/language-provider"
import { LanguageToggle } from "@/components/language/language-toggle"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { PWAInstallBanner } from "@/components/pwa/pwa-install-banner"
import { OfflineIndicator } from "@/components/pwa/offline-indicator"
import { useEffect } from "react"
import { Logo } from "@/components/common/logo"

interface DoctorLayoutProps {
  children: ReactNode
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  // Ensure we're in doctor context
  useEffect(() => {
    if (!pathname.startsWith("/doctor") && !pathname.startsWith("/chat")) {
      // If not in doctor routes, redirect to doctor dashboard
      router.push("/doctor/dashboard")
    }
  }, [pathname, router])

  const navigation = [
    { name: t("dashboard"), href: "/doctor/dashboard", icon: Home },
    { name: t("patients"), href: "/doctor/patients", icon: Users },
    { name: t("appointments"), href: "/doctor/appointments", icon: Calendar },
    { name: t("chat"), href: "/chat", icon: MessageSquare },
    { name: t("reports"), href: "/doctor/reports", icon: FileText },
    { name: t("analytics"), href: "/doctor/analytics", icon: Activity },
  ]

  const handleLogout = () => {
    // TODO: Clear doctor session and tokens
    // TODO: Call logout API endpoint
    // TODO: Clear local storage/cookies
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PWAInstallBanner />
      <OfflineIndicator />

      {/* Navigation Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
            <Logo size="md" variant="pro" className="text-green-900 dark:text-green-100" />
            <LanguageToggle />
          </div>

          {/* User Info */}
          <div className="px-6 py-4 bg-green-25 dark:bg-green-900/10 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">SS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Sarah Smith</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {t("doctor")} - {t("generalMedicine")}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? "bg-green-600 text-white" : "hover:bg-green-50 dark:hover:bg-green-900/20"}`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <NotificationBell />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

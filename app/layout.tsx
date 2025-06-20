import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PWAProvider } from "@/components/pwa/pwa-provider"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { LanguageProvider } from "@/components/language/language-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareConnect - Smart Medical Assistance",
  description: "AI-powered healthcare platform connecting patients and doctors seamlessly",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/images/careconnect-logo.png",
    apple: "/images/careconnect-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <PWAProvider>
              <NotificationProvider>
                {children}
                <Toaster />
              </NotificationProvider>
            </PWAProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useLanguage } from "./language-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const storeLang = (value: "en" | "hi") => {
    setLanguage(value)
    localStorage.setItem("language", value)
  }

  return (
    <Select value={language} onValueChange={(value: "en" | "hi") => storeLang(value)} >
      <SelectTrigger className="w-24 ml-32">
        {/* <Globe className="h-3 w-3 mr-1" /> */}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिंदी</SelectItem>
      </SelectContent>
    </Select>
  )
}

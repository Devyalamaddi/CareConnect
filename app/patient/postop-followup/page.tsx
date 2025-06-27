"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PatientLayout } from "@/components/patient/patient-layout"
import { Label } from "@/components/ui/label"
import { Activity } from "lucide-react"

const metrics = [
  { key: "pain", label: "Pain Level", emojis: ["😀", "🙂", "😐", "😣", "😭"] },
  { key: "nausea", label: "Nausea", emojis: ["😀", "🙂", "😐", "🤢", "🤮"] },
  { key: "sleep", label: "Sleep Quality", emojis: ["😴", "🙂", "😐", "😫", "😵"] },
]

export default function PostOpFollowupPage() {
  const [form, setForm] = useState({ pain: "", nausea: "", sleep: "" })
  const [history, setHistory] = useState<any[]>([])
  const [escalate, setEscalate] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entry = { ...form, date: new Date().toLocaleString() }
    setHistory([entry, ...history])
    // Escalate if pain or nausea is high, or sleep is very poor
    if (form.pain === "😭" || form.nausea === "🤮" || form.sleep === "😵") {
      setEscalate(true)
      // TODO: Trigger escalation alert to care team
    } else {
      setEscalate(false)
    }
    setForm({ pain: "", nausea: "", sleep: "" })
    // TODO: Save check-in to backend
  }

  return (
    <PatientLayout>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Activity className="h-7 w-7 text-pink-500" /> Post-Op Daily Check-In
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-base">
            Please complete your daily recovery check-in. If your symptoms worsen, your care team will be alerted.
          </p>
        </div>
        <Card className="shadow-md border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Today's Check-In</CardTitle>
            <CardDescription>Tap the emoji that best matches how you feel for each metric.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-8" onSubmit={handleSubmit}>
              {metrics.map((metric) => (
                <div key={metric.key} className="mb-4">
                  <Label className="block mb-3 font-medium text-gray-800 text-base">
                    {metric.label}
                  </Label>
                  <div className="flex gap-4 justify-center">
                    {metric.emojis.map((emoji) => (
                      <label key={emoji} htmlFor={`${metric.key}-${emoji}`} className="flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          id={`${metric.key}-${emoji}`}
                          name={metric.key}
                          value={emoji}
                          checked={form[metric.key as keyof typeof form] === emoji}
                          onChange={() => setForm((f) => ({ ...f, [metric.key]: emoji }))}
                          className="peer sr-only"
                        />
                        <span
                          className={
                            `text-3xl transition-transform duration-150 ` +
                            (form[metric.key as keyof typeof form] === emoji
                              ? "scale-125 drop-shadow-lg"
                              : "opacity-60 group-hover:opacity-90")
                          }
                          aria-label={emoji}
                        >
                          {emoji}
                        </span>
                        <span className={
                          form[metric.key as keyof typeof form] === emoji
                            ? "block mt-1 w-2 h-2 rounded-full bg-blue-500"
                            : "block mt-1 w-2 h-2 rounded-full bg-gray-200"
                        }></span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-8 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                  Submit
                </Button>
              </div>
            </form>
            {escalate && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded text-red-700 text-center">
                <strong>Warning:</strong> Your responses indicate a possible complication. <br />
                {/* <span>// TODO: Escalation alert to care team</span> */}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Check-In History</CardTitle>
            <CardDescription>Your recent responses</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center">No check-ins yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((entry, idx) => (
                  <div key={idx} className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
                    <div className="flex gap-6 text-2xl justify-center md:justify-start">
                      <span title="Pain" aria-label="Pain">{entry.pain}</span>
                      <span title="Nausea" aria-label="Nausea">{entry.nausea}</span>
                      <span title="Sleep" aria-label="Sleep">{entry.sleep}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 md:mt-0 text-center md:text-right">{entry.date}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  )
} 
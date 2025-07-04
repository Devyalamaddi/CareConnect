"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, Calendar, FileText, Activity, Pill, TestTube, Upload, X } from "lucide-react"
import { PatientLayout } from "@/components/patient/patient-layout"
import { mockPatientData } from "@/lib/mock-data"
import { useLanguage } from "@/components/language/language-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import jsPDF from "jspdf"
import ReactMarkdown from 'react-markdown'
import { AlertTriangle, CheckCircle, Phone } from "lucide-react"

function getLocalRecords() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem("careconnect_patient_records") || "[]");
  } catch {
    return [];
  }
}

export default function PatientRecords() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedEHRFiles, setUploadedEHRFiles] = useState<File[]>([])
  const [ehrMetadata, setEhrMetadata] = useState({
    recordType: "",
    recordDate: "",
    provider: "",
    department: "",
    description: "",
  })
  const [fhirPreview, setFhirPreview] = useState<any>(null)

  const [diagnosisRecords, setDiagnosisRecords] = useState<any[]>([])
  const [loadingDiagnosisRecords, setLoadingDiagnosisRecords] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalRecord, setModalRecord] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchDiagnosisRecords() {
      setLoadingDiagnosisRecords(true)
      try {
        const res = await fetch("/api/patient/records")
        const data = await res.json()
        const localRecords = getLocalRecords()
        setDiagnosisRecords([...(localRecords || []), ...(data.records || [])])
      } finally {
        setLoadingDiagnosisRecords(false)
      }
    }
    fetchDiagnosisRecords()
    // Listen for localStorage changes (e.g., from other tabs)
    const onStorage = () => {
      setDiagnosisRecords((prev) => {
        const localRecords = getLocalRecords()
        // Merge with already fetched API records (assume API records are after local)
        const apiRecords = prev.filter(r => !localRecords.find((lr: any) => lr.id === r.id))
        return [...localRecords, ...apiRecords]
      })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedEHRFiles((prev) => [...prev, ...files])

    // TODO: Parse FHIR files and generate preview
    // TODO: Validate file formats and structure
    if (files.length > 0) {
      // Mock FHIR preview
      setFhirPreview({
        resourceType: "Bundle",
        id: "example-ehr-bundle",
        type: "document",
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: {
              resourceType: "Patient",
              id: "patient-1",
              name: [{ family: "Doe", given: ["John"] }],
            },
          },
        ],
      })
    }
  }

  const removeEHRFile = (index: number) => {
    setUploadedEHRFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEHRUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Upload files to secure cloud storage
    // TODO: Convert to FHIR format if needed
    // TODO: Store metadata in database
    // TODO: Encrypt sensitive data
    // TODO: Generate audit trail

    console.log("Uploading EHR files:", uploadedEHRFiles, ehrMetadata)

    // Reset form
    setUploadedEHRFiles([])
    setEhrMetadata({
      recordType: "",
      recordDate: "",
      provider: "",
      department: "",
      description: "",
    })
    setFhirPreview(null)
    setShowUploadModal(false)
  }

  // Read localStorage records (exact API responses)
  const localRecords = getLocalRecords()

  // Merge and flatten records for display
  const records = [
    ...localRecords.map((rec: any) => {
      if (rec.source === 'symptoms' && rec.response?.diagnosis) {
        return {
          ...rec,
          id: rec.id,
          type: "diagnosis",
          title: rec.response.diagnosis.condition,
          description: rec.response.diagnosis.description,
          date: rec.date?.split("T")[0] || rec.date,
          doctor: "AI Assistant",
          confidence: rec.response.diagnosis.confidence,
          severity: rec.response.diagnosis.severity,
          recommendations: rec.response.diagnosis.recommendations,
          whenToSeekCare: rec.response.diagnosis.whenToSeekCare,
          followUp: rec.response.diagnosis.followUp,
          isAIDiagnosis: true,
          _raw: rec,
        }
      } else if (rec.source === 'scan' && rec.response?.diagnosis) {
        return {
          ...rec,
          id: rec.id,
          type: "diagnosis",
          title: rec.response.diagnosis.condition,
          description: rec.response.diagnosis.description,
          date: rec.date?.split("T")[0] || rec.date,
          doctor: "AI Assistant",
          confidence: rec.response.diagnosis.confidence,
          severity: rec.response.diagnosis.severity,
          recommendations: rec.response.diagnosis.recommendations,
          whenToSeekCare: rec.response.diagnosis.whenToSeekCare,
          followUp: rec.response.diagnosis.followUp,
          isAIDiagnosis: true,
          _raw: rec,
        }
      } else {
        // fallback for any other structure
        return rec
      }
    }),
    ...diagnosisRecords.map((rec) => {
      if (rec.diagnosis) {
        // API record
        return {
          id: rec.id,
          type: "diagnosis",
          title: rec.diagnosis.condition,
          description: rec.diagnosis.description,
          date: rec.timestamp?.split("T")[0] || rec.date,
          doctor: "AI Assistant",
          confidence: rec.diagnosis.confidence,
          severity: rec.diagnosis.severity,
          recommendations: rec.diagnosis.recommendations,
          whenToSeekCare: rec.diagnosis.whenToSeekCare,
          followUp: rec.diagnosis.followUp,
          isAIDiagnosis: true,
          _raw: rec,
        }
      } else {
        // LocalStorage record (already flat)
        return rec
      }
    }),
    ...mockPatientData.medicalRecords,
  ]

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || record.type === filterType
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage)

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "diagnosis":
        return <Activity className="h-5 w-5" />
      case "prescription":
        return <Pill className="h-5 w-5" />
      case "lab":
        return <TestTube className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case "diagnosis":
        return "bg-blue-100 text-blue-800"
      case "prescription":
        return "bg-green-100 text-green-800"
      case "lab":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // PDF download logic (from symptoms page)
  function downloadDiagnosisPDF(record: any) {
    const diagnosis = record.response?.diagnosis || record.response?.diagnosis || record.diagnosis || record
    const doc = new jsPDF({ unit: "mm", format: "a4" })
    const pageWidth = 210
    const pageHeight = 297
    const margin = 18
    const contentWidth = pageWidth - margin * 2 - 4
    let y = margin
    doc.setFillColor(33, 150, 243)
    doc.rect(0, 0, pageWidth, 22, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("CareConnect Health", pageWidth / 2, y, { align: "center" })
    y += 10
    doc.setFontSize(10)
    doc.text("AI-Powered Diagnosis Report", pageWidth / 2, y, { align: "center" })
    y += 10
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setDrawColor(33, 150, 243)
    doc.setLineWidth(0.7)
    doc.rect(margin / 2, margin / 2 + 10, pageWidth - margin, pageHeight - margin - 10, "S")
    y = margin + 12
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Diagnosis Summary", margin + 4, y)
    y += 8
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Condition: `, margin + 4, y)
    doc.setFont("helvetica", "bold")
    doc.text(diagnosis.condition || "", margin + 38, y)
    doc.setFont("helvetica", "normal")
    y += 7
    doc.text(`Confidence: `, margin + 4, y)
    doc.text(`${diagnosis.confidence || ""}%`, margin + 38, y)
    y += 7
    doc.text(`Severity: `, margin + 4, y)
    doc.text(`${diagnosis.severity || ""}`, margin + 38, y)
    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Description:", margin + 4, y)
    doc.setFont("helvetica", "normal")
    y += 6
    const descLines = doc.splitTextToSize(diagnosis.description || "", contentWidth)
    descLines.forEach((line: string) => {
      doc.text(line, margin + 8, y)
      y += 6
    })
    y += 2
    doc.setFont("helvetica", "bold")
    doc.text("Recommendations:", margin + 4, y)
    doc.setFont("helvetica", "normal")
    y += 6
    ;(diagnosis.recommendations || []).forEach((rec: string) => {
      const recLines = doc.splitTextToSize(`• ${rec}`, contentWidth)
      recLines.forEach((line: string) => {
        doc.text(line, margin + 8, y)
        y += 6
      })
    })
    y += 2
    doc.setFont("helvetica", "bold")
    doc.text("When to Seek Care:", margin + 4, y)
    doc.setFont("helvetica", "normal")
    y += 6
    ;(diagnosis.whenToSeekCare || []).forEach((w: string) => {
      const wLines = doc.splitTextToSize(`• ${w}`, contentWidth)
      wLines.forEach((line: string) => {
        doc.text(line, margin + 8, y)
        y += 6
      })
    })
    y += 2
    if (diagnosis.followUp?.recommended) {
      doc.setFont("helvetica", "bold")
      doc.text("Follow-up:", margin + 4, y)
      doc.setFont("helvetica", "normal")
      y += 6
      const followUpText = `Recommended in ${diagnosis.followUp.timeframe} to ${diagnosis.followUp.reason}`
      const followUpLines = doc.splitTextToSize(followUpText, contentWidth)
      followUpLines.forEach((line: string) => {
        doc.text(line, margin + 8, y)
        y += 6
      })
      y += 2
    }
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(margin / 2, pageHeight - margin + 4, pageWidth - margin / 2, pageHeight - margin + 4)
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text("This report is generated by CareConnect AI. For informational purposes only.", pageWidth / 2, pageHeight - margin + 10, { align: "center" })
    doc.setTextColor(0, 0, 0)
    doc.save("CareConnect_Diagnosis_Report.pdf")
  }

  // Modal content for viewing a record
  function renderModalContent(record: any) {
    if (!record) return null
    if (record.source === 'symptoms' && record.response?.diagnosis) {
      const diagnosis = record.response.diagnosis
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" /> AI Diagnosis
          </h2>
          <div className="prose max-w-none">
            <strong>Condition:</strong> {diagnosis.condition}<br />
            <strong>Confidence:</strong> {diagnosis.confidence}%<br />
            <strong>Severity:</strong> {diagnosis.severity}<br />
            <strong>Description:</strong> {diagnosis.description}<br />
            <strong>Recommendations:</strong>
            <ul>{diagnosis.recommendations?.map((rec: string, i: number) => <li key={i}>{rec}</li>)}</ul>
            <strong>When to Seek Care:</strong>
            <ul>{diagnosis.whenToSeekCare?.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
            {diagnosis.followUp?.recommended && (
              <div><strong>Follow-up:</strong> {diagnosis.followUp.timeframe} - {diagnosis.followUp.reason}</div>
            )}
          </div>
          <Button onClick={() => downloadDiagnosisPDF(record)}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>
      )
    } else if (record.source === 'scan' && record.response?.gemini) {
      // Render markdown sections from gemini
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" /> Scan Analysis
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{record.response.gemini}</ReactMarkdown>
          </div>
          <Button onClick={() => downloadDiagnosisPDF(record)}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>
      )
    } else {
      // fallback for other records
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-gray-500" /> Medical Record
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">{JSON.stringify(record, null, 2)}</pre>
        </div>
      )
    }
  }

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("medicalRecords")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t("medicalRecordsDesc")}</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("searchRecords")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("filterByType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allRecords")}</SelectItem>
                  <SelectItem value="diagnosis">{t("diagnosis")}</SelectItem>
                  <SelectItem value="prescription">{t("prescriptions")}</SelectItem>
                  <SelectItem value="lab">{t("labResults")}</SelectItem>
                  <SelectItem value="visit">{t("visits")}</SelectItem>
                </SelectContent>
              </Select>
              {/* EHR Upload Modal */}
              <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogTrigger asChild>
                  <Button className="ml-4">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("uploadEHR")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("uploadEHRTitle")}</DialogTitle>
                    <DialogDescription>{t("uploadEHRDesc")}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEHRUpload} className="space-y-6">
                    {/* File Upload Section */}
                    <div className="space-y-4">
                      <Label>{t("selectEHRFiles")}</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">{t("dragDropEHR")}</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {t("supportedFormats")}: PDF, XML, JSON, HL7 FHIR
                          </p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.xml,.json,.hl7"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="ehr-upload"
                          />
                          <Label htmlFor="ehr-upload">
                            <Button type="button" variant="outline" className="cursor-pointer">
                              {t("selectFiles")}
                            </Button>
                          </Label>
                        </div>
                      </div>

                      {/* Uploaded Files Preview */}
                      {uploadedEHRFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>{t("uploadedFiles")}:</Label>
                          {uploadedEHRFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeEHRFile(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Metadata Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="recordType">{t("recordType")}</Label>
                        <Select
                          value={ehrMetadata.recordType}
                          onValueChange={(value) => setEhrMetadata((prev) => ({ ...prev, recordType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectRecordType")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lab-results">{t("labResults")}</SelectItem>
                            <SelectItem value="imaging">{t("imaging")}</SelectItem>
                            <SelectItem value="prescription">{t("prescription")}</SelectItem>
                            <SelectItem value="discharge-summary">{t("dischargeSummary")}</SelectItem>
                            <SelectItem value="consultation">{t("consultation")}</SelectItem>
                            <SelectItem value="other">{t("other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="recordDate">{t("recordDate")}</Label>
                        <Input
                          id="recordDate"
                          type="date"
                          value={ehrMetadata.recordDate}
                          onChange={(e) => setEhrMetadata((prev) => ({ ...prev, recordDate: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="provider">{t("healthcareProvider")}</Label>
                        <Input
                          id="provider"
                          placeholder={t("providerName")}
                          value={ehrMetadata.provider}
                          onChange={(e) => setEhrMetadata((prev) => ({ ...prev, provider: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="department">{t("department")}</Label>
                        <Input
                          id="department"
                          placeholder={t("departmentName")}
                          value={ehrMetadata.department}
                          onChange={(e) => setEhrMetadata((prev) => ({ ...prev, department: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">{t("description")}</Label>
                      <Textarea
                        id="description"
                        placeholder={t("recordDescription")}
                        value={ehrMetadata.description}
                        onChange={(e) => setEhrMetadata((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    {/* FHIR Preview */}
                    {fhirPreview && (
                      <div className="space-y-2">
                        <Label>{t("fhirPreview")}:</Label>
                        <div className="bg-gray-100 p-4 rounded-lg max-h-40 overflow-y-auto">
                          <pre className="text-sm">{JSON.stringify(fhirPreview, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                        {t("cancel")}
                      </Button>
                      <Button type="submit" disabled={uploadedEHRFiles.length === 0}>
                        {t("uploadEHR")}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {loadingDiagnosisRecords ? (
            <div className="text-center py-8 text-gray-500">{t("loading")}</div>
          ) : (
            paginatedRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${getRecordColor(record.type)}`}>{getRecordIcon(record.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{record.title}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {record.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{record.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{record.date}</span>
                          </div>
                          <span>•</span>
                          <span>
                            {t("doctor")}: {record.doctor}
                          </span>
                        </div>
                        {('isAIDiagnosis' in record) && record.isAIDiagnosis && (
                          <div className="mt-2 text-xs text-blue-600 font-semibold">AI Diagnosis</div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setModalRecord(record); setModalOpen(true); }}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t("view")}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadDiagnosisPDF(record)}>
                        <Download className="h-4 w-4 mr-2" />
                        {t("download")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t("showing")} {startIndex + 1} {t("to")}{" "}
                  {Math.min(startIndex + recordsPerPage, filteredRecords.length)} {t("of")} {filteredRecords.length}{" "}
                  {t("records")}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {t("previous")}
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {t("next")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("noRecordsFound")}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t("noRecordsFoundDesc")}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal for viewing record */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setModalOpen(false)}>✕</Button>
              {renderModalContent(modalRecord)}
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    async function fetchDiagnosisRecords() {
      setLoadingDiagnosisRecords(true)
      try {
        const res = await fetch("/api/patient/records")
        const data = await res.json()
        setDiagnosisRecords(data.records || [])
      } finally {
        setLoadingDiagnosisRecords(false)
      }
    }
    fetchDiagnosisRecords()
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

  // TODO: Fetch records from backend API
  // TODO: Implement real-time search with debouncing
  // TODO: Add advanced filtering options
  const records = [
    ...diagnosisRecords.map((rec) => ({
      id: rec.id,
      type: "diagnosis",
      title: rec.diagnosis.condition,
      description: rec.diagnosis.description,
      date: rec.timestamp.split("T")[0],
      doctor: "AI Assistant",
      confidence: rec.diagnosis.confidence,
      severity: rec.diagnosis.severity,
      recommendations: rec.diagnosis.recommendations,
      whenToSeekCare: rec.diagnosis.whenToSeekCare,
      followUp: rec.diagnosis.followUp,
      isAIDiagnosis: true,
    })),
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
                        {record.isAIDiagnosis && (
                          <div className="mt-2 text-xs text-blue-600 font-semibold">AI Diagnosis</div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {t("view")}
                      </Button>
                      <Button variant="outline" size="sm">
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
      </div>
    </PatientLayout>
  )
}

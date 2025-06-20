"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, Calendar, FileText, Activity, Pill, TestTube } from "lucide-react"
import { PatientLayout } from "@/components/patient/patient-layout"
import { mockPatientData } from "@/lib/mock-data"
import { useLanguage } from "@/components/language/language-provider"

export default function PatientRecords() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5

  // TODO: Fetch records from backend API
  // TODO: Implement real-time search with debouncing
  // TODO: Add advanced filtering options
  const records = mockPatientData.medicalRecords

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
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
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {paginatedRecords.map((record) => (
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
          ))}
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

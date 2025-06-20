"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Activity,
  Heart,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react"
import { DoctorLayout } from "@/components/doctor/doctor-layout"
import { useLanguage } from "@/components/language/language-provider"

export default function DoctorAnalytics() {
  const { t } = useLanguage()
  const [timeRange, setTimeRange] = useState("thisMonth")
  const [metricType, setMetricType] = useState("all")

  // TODO: Fetch analytics data from backend API
  // TODO: Implement real-time analytics updates
  // TODO: Add data visualization charts
  const mockAnalytics = {
    overview: {
      totalPatients: 156,
      totalConsultations: 342,
      avgConsultationTime: 24,
      patientSatisfaction: 4.8,
      revenue: 45600,
      growthRate: 12.5,
    },
    trends: {
      consultationsThisMonth: [
        { date: "Week 1", count: 85 },
        { date: "Week 2", count: 92 },
        { date: "Week 3", count: 78 },
        { date: "Week 4", count: 87 },
      ],
      patientsByCondition: [
        { condition: "Respiratory", count: 45, percentage: 28.8 },
        { condition: "Cardiovascular", count: 38, percentage: 24.4 },
        { condition: "Diabetes", count: 32, percentage: 20.5 },
        { condition: "Hypertension", count: 25, percentage: 16.0 },
        { condition: "Other", count: 16, percentage: 10.3 },
      ],
    },
    performance: {
      appointmentCompletionRate: 94.2,
      averageWaitTime: 8.5,
      patientRetentionRate: 87.3,
      treatmentSuccessRate: 91.7,
    },
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  const getPerformanceColor = (value: number, threshold = 80) => {
    if (value >= threshold) return "text-green-600"
    if (value >= threshold * 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("analytics")}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track your practice performance and patient outcomes
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.totalPatients}</div>
              <p className={`text-xs ${getGrowthColor(mockAnalytics.overview.growthRate)}`}>
                +{mockAnalytics.overview.growthRate}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.totalConsultations}</div>
              <p className="text-xs text-green-600">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.avgConsultationTime}m</div>
              <p className="text-xs text-red-600">+2m from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.patientSatisfaction}/5</div>
              <p className="text-xs text-green-600">+0.2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockAnalytics.overview.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600">+15.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.performance.treatmentSuccessRate}%</div>
              <p className="text-xs text-green-600">+3.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Consultation Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Consultation Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.trends.consultationsThisMonth.map((week, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{week.date}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(week.count / 100) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{week.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Patients by Condition</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.trends.patientsByCondition.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index],
                            }}
                          ></div>
                          <span className="text-sm font-medium">{condition.condition}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{condition.count}</div>
                          <div className="text-xs text-gray-500">{condition.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-green-600">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Returning Patients</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">133</div>
                  <p className="text-xs text-green-600">+5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                  <Target className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.performance.patientRetentionRate}%</div>
                  <p className="text-xs text-green-600">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                  <Activity className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-green-600">+33% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Patient Demographics Chart
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed patient demographics and age distribution analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.performance.appointmentCompletionRate}%</div>
                  <p className={`text-xs ${getPerformanceColor(mockAnalytics.performance.appointmentCompletionRate)}`}>
                    Excellent performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.performance.averageWaitTime}m</div>
                  <p className="text-xs text-green-600">Below target (10m)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Heart className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.performance.treatmentSuccessRate}%</div>
                  <p className={`text-xs ${getPerformanceColor(mockAnalytics.performance.treatmentSuccessRate, 90)}`}>
                    Above average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.8%</div>
                  <p className="text-xs text-green-600">Below industry average</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track your performance metrics and improvement trends over time
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockAnalytics.overview.revenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+15.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. per Patient</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Math.round(mockAnalytics.overview.revenue / mockAnalytics.overview.totalPatients)}
                  </div>
                  <p className="text-xs text-green-600">+8.7% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                  <Target className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">96.2%</div>
                  <p className="text-xs text-green-600">Excellent collection</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Financial Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed revenue analysis and financial performance metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  )
}

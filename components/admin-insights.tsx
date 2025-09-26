"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Brain, TrendingUp, User, Search, Filter } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Student {
  id: string
  name: string
  email: string
  college_name: string
  course: string
  year_of_study: number
  current_cgpa: number
  attendance_percentage: number
  ai_predictions?: {
    dropout_risk_score: number
    risk_level: string
    contributing_factors: string[]
    recommendations: string[]
    confidence_score: number
  }[]
}

export function AdminInsights() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [collegeFilter, setCollegeFilter] = useState("all")

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, riskFilter, collegeFilter])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students?limit=100")
      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.college_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Risk level filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((student) => student.ai_predictions?.[0]?.risk_level === riskFilter)
    }

    // College filter
    if (collegeFilter !== "all") {
      filtered = filtered.filter((student) => student.college_name === collegeFilter)
    }

    setFilteredStudents(filtered)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const uniqueColleges = [...new Set(students.map((s) => s.college_name))]

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Level</label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">College</label>
              <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {uniqueColleges.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredStudents.length} of {students.length} students
        </p>
        <Button onClick={fetchStudents} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      {/* Student Insights */}
      <div className="space-y-4">
        {filteredStudents.map((student) => {
          const prediction = student.ai_predictions?.[0]

          return (
            <Card key={student.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {student.name}
                    </CardTitle>
                    <CardDescription>
                      {student.course} • {student.college_name} • Year {student.year_of_study}
                    </CardDescription>
                  </div>
                  {prediction && (
                    <Badge variant={getRiskColor(prediction.risk_level)} className="flex items-center gap-1">
                      {getRiskIcon(prediction.risk_level)}
                      {prediction.risk_level.toUpperCase()} RISK
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Academic Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">CGPA</p>
                    <p className="text-2xl font-bold">{student.current_cgpa}/10</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Attendance</p>
                    <p className="text-2xl font-bold">{student.attendance_percentage}%</p>
                  </div>
                  {prediction && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Risk Score</p>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{prediction.dropout_risk_score}/100</p>
                        <Progress value={prediction.dropout_risk_score} className="h-2" />
                      </div>
                    </div>
                  )}
                </div>

                {prediction && (
                  <>
                    {/* Contributing Factors */}
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Contributing Factors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {prediction.contributing_factors.map((factor, index) => (
                          <Badge key={index} variant="outline">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <h4 className="font-medium">AI Recommendations</h4>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>AI Confidence: {prediction.confidence_score}%</span>
                      <span>Generated recently</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredStudents.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

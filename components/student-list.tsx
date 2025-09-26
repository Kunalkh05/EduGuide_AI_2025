"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
  }[]
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [collegeFilter, setCollegeFilter] = useState("all")

  useEffect(() => {
    async function fetchStudents() {
      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from("students")
          .select(`
            *,
            ai_predictions (
              dropout_risk_score,
              risk_level,
              contributing_factors
            )
          `)
          .order("name")

        if (error) throw error
        setStudents(data || [])
        setFilteredStudents(data || [])
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.course.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((student) => student.ai_predictions?.[0]?.risk_level === riskFilter)
    }

    // College filter
    if (collegeFilter !== "all") {
      filtered = filtered.filter((student) => student.college_name === collegeFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, riskFilter, collegeFilter])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPerformanceIcon = (cgpa: number) => {
    if (cgpa >= 8) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (cgpa >= 6) return <TrendingUp className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const uniqueColleges = [...new Set(students.map((s) => s.college_name))]

  if (isLoading) {
    return <div>Loading students...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by college" />
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

      {/* Student Cards */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => {
          const prediction = student.ai_predictions?.[0]
          return (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>
                      {student.email} • Year {student.year_of_study} • {student.course}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">{student.college_name}</p>
                  </div>
                  <div className="flex gap-2">
                    {prediction && (
                      <Badge className={getRiskColor(prediction.risk_level)}>{prediction.risk_level} risk</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(student.current_cgpa)}
                    <div>
                      <p className="text-sm font-medium">CGPA</p>
                      <p className="text-sm text-muted-foreground">{student.current_cgpa}/10</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attendance</p>
                    <p className="text-sm text-muted-foreground">{student.attendance_percentage}%</p>
                  </div>
                  {prediction && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Risk Score</p>
                        <p className="text-sm text-muted-foreground">{prediction.dropout_risk_score}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Key Factors</p>
                        <p className="text-sm text-muted-foreground">
                          {prediction.contributing_factors?.slice(0, 2).join(", ")}
                          {prediction.contributing_factors?.length > 2 && "..."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

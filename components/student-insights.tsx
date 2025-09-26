"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { StudentProfile } from "@/components/student-profile"
import { StudentProgress } from "@/components/student-progress"
import { StudentRecommendations } from "@/components/student-recommendations"

interface Student {
  id: string
  name: string
  email: string
  college_name: string
  course: string
  year_of_study: number
  current_cgpa: number
  attendance_percentage: number
  family_income: number
  extracurricular_activities: string[]
  previous_backlogs: number
  mental_health_score: number
  study_hours_per_day: number
  ai_predictions?: {
    dropout_risk_score: number
    risk_level: string
    contributing_factors: string[]
    recommendations: string[]
    confidence_score: number
  }[]
  counselor_insights?: {
    id: string
    counselor_name: string
    insight_type: string
    observation: string
    recommendation: string
    priority_level: string
    created_at: string
  }[]
}

export function StudentInsights() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

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
              contributing_factors,
              recommendations,
              confidence_score
            ),
            counselor_insights (
              id,
              counselor_name,
              insight_type,
              observation,
              recommendation,
              priority_level,
              created_at
            )
          `)
          .order("name")

        if (error) throw error
        setStudents(data || [])
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.college_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div>Loading student data...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Insights</h1>
        <p className="text-muted-foreground mt-2">
          View academic progress, risk assessments, and personalized recommendations
        </p>
      </div>

      {!selectedStudent ? (
        <StudentSelector
          students={filteredStudents}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onStudentSelect={setSelectedStudent}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                <p className="text-muted-foreground">{selectedStudent.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Back to Student List
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile & Overview</TabsTrigger>
              <TabsTrigger value="progress">Academic Progress</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="counselor">Counselor Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <StudentProfile student={selectedStudent} />
            </TabsContent>

            <TabsContent value="progress">
              <StudentProgress student={selectedStudent} />
            </TabsContent>

            <TabsContent value="recommendations">
              <StudentRecommendations student={selectedStudent} />
            </TabsContent>

            <TabsContent value="counselor">
              <CounselorInsightsView insights={selectedStudent.counselor_insights || []} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function StudentSelector({
  students,
  searchTerm,
  onSearchChange,
  onStudentSelect,
}: {
  students: Student[]
  searchTerm: string
  onSearchChange: (term: string) => void
  onStudentSelect: (student: Student) => void
}) {
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

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name, email, or college..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => {
          const prediction = student.ai_predictions?.[0]
          return (
            <Card
              key={student.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onStudentSelect(student)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.college_name}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      {student.course} • Year {student.year_of_study}
                    </p>
                  </div>
                  {prediction && <Badge className={getRiskColor(prediction.risk_level)}>{prediction.risk_level}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">CGPA</p>
                    <p className="text-muted-foreground">{student.current_cgpa}/10</p>
                  </div>
                  <div>
                    <p className="font-medium">Attendance</p>
                    <p className="text-muted-foreground">{student.attendance_percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {students.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No students found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CounselorInsightsView({ insights }: { insights: any[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-blue-100 text-blue-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "career":
        return "bg-green-100 text-green-800"
      case "mental_health":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No counselor insights available yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">Counselor Insight</CardTitle>
                <CardDescription>By {insight.counselor_name}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(insight.priority_level)}>{insight.priority_level}</Badge>
                <Badge variant="outline" className={getInsightTypeColor(insight.insight_type)}>
                  {insight.insight_type.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">Observation</h4>
              <p className="text-sm text-muted-foreground">{insight.observation}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Recommendation</h4>
              <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(insight.created_at).toLocaleDateString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

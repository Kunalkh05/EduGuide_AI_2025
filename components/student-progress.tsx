"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react"

interface StudentProgressProps {
  student: {
    current_cgpa: number
    attendance_percentage: number
    previous_backlogs: number
    study_hours_per_day: number
    mental_health_score: number
    year_of_study: number
  }
}

export function StudentProgress({ student }: StudentProgressProps) {
  // Mock historical data - in a real app, this would come from the database
  const academicProgress = [
    { semester: "Sem 1", cgpa: 6.5, attendance: 75 },
    { semester: "Sem 2", cgpa: 7.2, attendance: 80 },
    { semester: "Sem 3", cgpa: 7.8, attendance: 85 },
    { semester: "Sem 4", cgpa: student.current_cgpa, attendance: student.attendance_percentage },
  ].slice(0, student.year_of_study * 2)

  const performanceMetrics = [
    { metric: "CGPA", current: student.current_cgpa, target: 8.0, max: 10 },
    { metric: "Attendance", current: student.attendance_percentage, target: 85, max: 100 },
    { metric: "Study Hours", current: student.study_hours_per_day, target: 6, max: 12 },
    { metric: "Mental Health", current: student.mental_health_score, target: 7, max: 10 },
  ]

  const getProgressColor = (current: number, target: number) => {
    if (current >= target) return "text-green-500"
    if (current >= target * 0.8) return "text-yellow-500"
    return "text-red-500"
  }

  const getProgressIcon = (current: number, target: number) => {
    if (current >= target) return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              {getProgressIcon(metric.current, metric.target)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.current}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                <p className={`text-xs ${getProgressColor(metric.current, metric.target)}`}>
                  {metric.current >= metric.target ? "On Track" : "Needs Improvement"}
                </p>
              </div>
              <Progress value={(metric.current / metric.max) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Academic Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Progress Trend</CardTitle>
          <CardDescription>CGPA and attendance progression over semesters</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={academicProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cgpa" stroke="#3b82f6" strokeWidth={2} name="CGPA" />
              <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Goals and Achievements */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Academic Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Maintain CGPA above 8.0</span>
                <span className={`text-sm ${student.current_cgpa >= 8.0 ? "text-green-500" : "text-red-500"}`}>
                  {student.current_cgpa >= 8.0 ? "✓" : "✗"}
                </span>
              </div>
              <Progress value={Math.min((student.current_cgpa / 8.0) * 100, 100)} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Attendance above 85%</span>
                <span className={`text-sm ${student.attendance_percentage >= 85 ? "text-green-500" : "text-red-500"}`}>
                  {student.attendance_percentage >= 85 ? "✓" : "✗"}
                </span>
              </div>
              <Progress value={Math.min((student.attendance_percentage / 85) * 100, 100)} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Zero backlogs</span>
                <span className={`text-sm ${student.previous_backlogs === 0 ? "text-green-500" : "text-red-500"}`}>
                  {student.previous_backlogs === 0 ? "✓" : "✗"}
                </span>
              </div>
              <Progress value={student.previous_backlogs === 0 ? 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Achievements & Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.current_cgpa >= 8.0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">High Academic Performance</p>
                  <p className="text-xs text-muted-foreground">CGPA above 8.0</p>
                </div>
              </div>
            )}

            {student.attendance_percentage >= 90 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Award className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Excellent Attendance</p>
                  <p className="text-xs text-muted-foreground">Above 90% attendance</p>
                </div>
              </div>
            )}

            {student.previous_backlogs === 0 && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Clear Academic Record</p>
                  <p className="text-xs text-muted-foreground">No pending backlogs</p>
                </div>
              </div>
            )}

            {student.study_hours_per_day >= 6 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Award className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Dedicated Learner</p>
                  <p className="text-xs text-muted-foreground">6+ hours daily study</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

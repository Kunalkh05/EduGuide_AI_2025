"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, TrendingDown, Heart, Clock, DollarSign } from "lucide-react"

interface StudentProfileProps {
  student: {
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
      confidence_score: number
    }[]
  }
}

export function StudentProfile({ student }: StudentProfileProps) {
  const prediction = student.ai_predictions?.[0]

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "text-destructive"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5" />
      case "medium":
        return <TrendingDown className="h-5 w-5" />
      case "low":
        return <TrendingUp className="h-5 w-5" />
      default:
        return null
    }
  }

  const getPerformanceColor = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">College</p>
              <p className="text-sm text-muted-foreground">{student.college_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Course</p>
              <p className="text-sm text-muted-foreground">{student.course}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Year of Study</p>
              <p className="text-sm text-muted-foreground">Year {student.year_of_study}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          </div>

          {student.extracurricular_activities.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Extracurricular Activities</p>
              <div className="flex flex-wrap gap-2">
                {student.extracurricular_activities.map((activity, index) => (
                  <Badge key={index} variant="secondary">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={getRiskColor(prediction.risk_level)}>{getRiskIcon(prediction.risk_level)}</span>
              Risk Assessment
            </CardTitle>
            <CardDescription>AI-powered dropout risk analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge className={`${getRiskColor(prediction.risk_level)} border-current`} variant="outline">
                {prediction.risk_level.toUpperCase()}
              </Badge>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-sm text-muted-foreground">{prediction.dropout_risk_score}%</span>
              </div>
              <Progress value={prediction.dropout_risk_score} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm text-muted-foreground">{prediction.confidence_score}%</span>
              </div>
              <Progress value={prediction.confidence_score} className="h-2" />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Contributing Factors</p>
              <div className="space-y-1">
                {prediction.contributing_factors.map((factor, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-5 w-5 ${getPerformanceColor(student.current_cgpa, 10)}`} />
              <div>
                <p className="text-sm font-medium">CGPA</p>
                <p className={`text-lg font-bold ${getPerformanceColor(student.current_cgpa, 10)}`}>
                  {student.current_cgpa}/10
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className={`h-5 w-5 ${getPerformanceColor(student.attendance_percentage, 100)}`} />
              <div>
                <p className="text-sm font-medium">Attendance</p>
                <p className={`text-lg font-bold ${getPerformanceColor(student.attendance_percentage, 100)}`}>
                  {student.attendance_percentage}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AlertTriangle
                className={`h-5 w-5 ${student.previous_backlogs > 0 ? "text-red-500" : "text-green-500"}`}
              />
              <div>
                <p className="text-sm font-medium">Backlogs</p>
                <p className={`text-lg font-bold ${student.previous_backlogs > 0 ? "text-red-500" : "text-green-500"}`}>
                  {student.previous_backlogs}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Study Hours/Day</p>
                <p className="text-lg font-bold text-blue-500">{student.study_hours_per_day}h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Wellbeing */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Wellbeing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className={`h-5 w-5 ${getPerformanceColor(student.mental_health_score, 10)}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Mental Health Score</p>
                <span className="text-sm text-muted-foreground">{student.mental_health_score}/10</span>
              </div>
              <Progress value={student.mental_health_score * 10} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Family Income</p>
              <p className="text-sm text-muted-foreground">
                ₹{student.family_income?.toLocaleString() || "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

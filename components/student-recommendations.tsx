"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, BookOpen, Users, Heart, Target, CheckCircle } from "lucide-react"

interface StudentRecommendationsProps {
  student: {
    current_cgpa: number
    attendance_percentage: number
    previous_backlogs: number
    mental_health_score: number
    study_hours_per_day: number
    ai_predictions?: {
      recommendations: string[]
      contributing_factors: string[]
      risk_level: string
    }[]
  }
}

export function StudentRecommendations({ student }: StudentRecommendationsProps) {
  const prediction = student.ai_predictions?.[0]

  // Generate personalized recommendations based on student data
  const generateRecommendations = () => {
    const recommendations = []

    // Academic recommendations
    if (student.current_cgpa < 7.0) {
      recommendations.push({
        category: "Academic",
        icon: BookOpen,
        title: "Improve Academic Performance",
        description: "Focus on strengthening your understanding of core subjects",
        actions: [
          "Attend all lectures and take detailed notes",
          "Form study groups with high-performing classmates",
          "Seek help from professors during office hours",
          "Use online resources and tutorials for difficult topics",
        ],
        priority: "high",
      })
    }

    if (student.attendance_percentage < 80) {
      recommendations.push({
        category: "Academic",
        icon: Target,
        title: "Improve Attendance",
        description: "Regular attendance is crucial for academic success",
        actions: [
          "Set daily alarms and reminders for classes",
          "Plan your schedule to avoid conflicts",
          "Communicate with professors about any unavoidable absences",
          "Track your attendance weekly",
        ],
        priority: "high",
      })
    }

    if (student.previous_backlogs > 0) {
      recommendations.push({
        category: "Academic",
        icon: Target,
        title: "Clear Pending Backlogs",
        description: "Focus on clearing your pending subjects",
        actions: [
          "Create a study plan for backlog subjects",
          "Allocate extra time for difficult subjects",
          "Take practice tests and mock exams",
          "Consider additional tutoring if needed",
        ],
        priority: "critical",
      })
    }

    // Study habits
    if (student.study_hours_per_day < 4) {
      recommendations.push({
        category: "Study Habits",
        icon: BookOpen,
        title: "Increase Study Time",
        description: "Dedicate more time to focused studying",
        actions: [
          "Create a daily study schedule",
          "Use time-blocking techniques",
          "Eliminate distractions during study time",
          "Take regular breaks using the Pomodoro technique",
        ],
        priority: "medium",
      })
    }

    // Mental health
    if (student.mental_health_score < 6) {
      recommendations.push({
        category: "Wellbeing",
        icon: Heart,
        title: "Focus on Mental Health",
        description: "Your mental wellbeing is crucial for academic success",
        actions: [
          "Practice stress management techniques",
          "Maintain a regular sleep schedule",
          "Exercise regularly and eat healthy",
          "Consider counseling services if needed",
        ],
        priority: "high",
      })
    }

    // General recommendations
    recommendations.push({
      category: "Career",
      icon: Users,
      title: "Build Professional Network",
      description: "Start building connections in your field",
      actions: [
        "Join professional associations and student clubs",
        "Attend industry events and workshops",
        "Connect with alumni in your field",
        "Seek internship opportunities",
      ],
      priority: "medium",
    })

    return recommendations
  }

  const recommendations = generateRecommendations()
  const aiRecommendations = prediction?.recommendations || []

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-blue-100 text-blue-800"
      case "Study Habits":
        return "bg-purple-100 text-purple-800"
      case "Wellbeing":
        return "bg-red-100 text-red-800"
      case "Career":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI-Generated Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions based on your risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personalized Action Plan</h3>
        {recommendations.map((rec, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <rec.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <CardDescription>{rec.description}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                  <Badge variant="outline" className={getCategoryColor(rec.category)}>
                    {rec.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Action Items:</h4>
                <ul className="space-y-1">
                  {rec.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline">
                  Mark as Started
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

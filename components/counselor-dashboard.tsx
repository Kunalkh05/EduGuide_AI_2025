"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, Calendar, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { StudentList } from "@/components/student-list"
import { RiskAnalytics } from "@/components/risk-analytics"
import { AddInsightDialog } from "@/components/add-insight-dialog"

interface DashboardStats {
  totalStudents: number
  highRiskStudents: number
  criticalRiskStudents: number
  pendingFollowUps: number
}

export function CounselorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    highRiskStudents: 0,
    criticalRiskStudents: 0,
    pendingFollowUps: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      try {
        // Get total students
        const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

        // Get high risk students
        const { count: highRiskStudents } = await supabase
          .from("ai_predictions")
          .select("*", { count: "exact", head: true })
          .eq("risk_level", "high")

        // Get critical risk students
        const { count: criticalRiskStudents } = await supabase
          .from("ai_predictions")
          .select("*", { count: "exact", head: true })
          .eq("risk_level", "critical")

        // Get pending follow-ups
        const { count: pendingFollowUps } = await supabase
          .from("counselor_insights")
          .select("*", { count: "exact", head: true })
          .eq("follow_up_required", true)
          .gte("follow_up_date", new Date().toISOString().split("T")[0])

        setStats({
          totalStudents: totalStudents || 0,
          highRiskStudents: highRiskStudents || 0,
          criticalRiskStudents: criticalRiskStudents || 0,
          pendingFollowUps: pendingFollowUps || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Counselor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor student progress, manage interventions, and track outcomes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.highRiskStudents}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalRiskStudents}</div>
            <p className="text-xs text-muted-foreground">Immediate intervention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingFollowUps}</div>
            <p className="text-xs text-muted-foreground">Pending this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Student Management</TabsTrigger>
          <TabsTrigger value="analytics">Risk Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights & Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <StudentList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <RiskAnalytics />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <InsightsManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InsightsManagement() {
  const [insights, setInsights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    async function fetchInsights() {
      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from("counselor_insights")
          .select(`
            *,
            students (name, email, college_name, course)
          `)
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) throw error
        setInsights(data || [])
      } catch (error) {
        console.error("Error fetching insights:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

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

  if (isLoading) {
    return <div>Loading insights...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Insights & Follow-ups</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Insight
        </Button>
      </div>

      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{insight.students?.name || "Unknown Student"}</CardTitle>
                  <CardDescription>
                    {insight.students?.email} • {insight.students?.college_name}
                  </CardDescription>
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
              {insight.follow_up_required && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Follow-up scheduled: {new Date(insight.follow_up_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                By {insight.counselor_name} • {new Date(insight.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddInsightDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onInsightAdded={() => {
          // Refresh insights
          setIsLoading(true)
          // Re-fetch insights here
        }}
      />
    </div>
  )
}

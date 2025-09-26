"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentDataForm } from "@/components/student-data-form"
import { AdminInsights } from "@/components/admin-insights"
import { AdminChatbot } from "@/components/admin-chatbot"
import { Users, Brain, MessageSquare, TrendingUp } from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add-student")
  const [refreshInsights, setRefreshInsights] = useState(0)

  const handleStudentAdded = () => {
    // Trigger refresh of insights when new student is added
    setRefreshInsights((prev) => prev + 1)
    setActiveTab("insights") // Switch to insights tab to show results
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">89</div>
            <p className="text-xs text-muted-foreground">7.2% of total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">956</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Active conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-student">Add Student</TabsTrigger>
          <TabsTrigger value="insights">View Insights</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="add-student" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>
                Enter student information to generate AI-powered dropout risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentDataForm onStudentAdded={handleStudentAdded} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AdminInsights key={refreshInsights} />
        </TabsContent>

        <TabsContent value="ai-chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant for Counselors</CardTitle>
              <CardDescription>Get personalized recommendations and guidance for student interventions</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminChatbot />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudentDataFormProps {
  onStudentAdded: () => void
}

export function StudentDataForm({ onStudentAdded }: StudentDataFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [extracurriculars, setExtracurriculars] = useState<string[]>([])
  const [newActivity, setNewActivity] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college_name: "",
    course: "",
    year_of_study: "",
    current_cgpa: "",
    attendance_percentage: "",
    previous_backlogs: "",
    mental_health_score: "",
    study_hours_per_day: "",
    family_income: "",
    parent_education_level: "",
    distance_from_home: "",
    part_time_job: false,
    financial_aid: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addExtracurricular = () => {
    if (newActivity.trim() && !extracurriculars.includes(newActivity.trim())) {
      setExtracurriculars((prev) => [...prev, newActivity.trim()])
      setNewActivity("")
    }
  }

  const removeExtracurricular = (activity: string) => {
    setExtracurriculars((prev) => prev.filter((a) => a !== activity))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create student record
      const studentResponse = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          current_cgpa: Number.parseFloat(formData.current_cgpa),
          attendance_percentage: Number.parseFloat(formData.attendance_percentage),
          previous_backlogs: Number.parseInt(formData.previous_backlogs),
          mental_health_score: Number.parseFloat(formData.mental_health_score),
          study_hours_per_day: Number.parseFloat(formData.study_hours_per_day),
          family_income: Number.parseFloat(formData.family_income),
          distance_from_home: Number.parseFloat(formData.distance_from_home),
          extracurricular_activities: extracurriculars,
        }),
      })

      if (!studentResponse.ok) {
        throw new Error("Failed to create student record")
      }

      const { student } = await studentResponse.json()

      // Generate AI prediction
      const predictionResponse = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id }),
      })

      if (!predictionResponse.ok) {
        console.warn("Failed to generate AI prediction, but student was created")
      }

      toast({
        title: "Student Added Successfully",
        description: "AI analysis has been generated and insights are ready to view.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        college_name: "",
        course: "",
        year_of_study: "",
        current_cgpa: "",
        attendance_percentage: "",
        previous_backlogs: "",
        mental_health_score: "",
        study_hours_per_day: "",
        family_income: "",
        parent_education_level: "",
        distance_from_home: "",
        part_time_job: false,
        financial_aid: false,
      })
      setExtracurriculars([])

      onStudentAdded()
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College Name *</Label>
              <Input
                id="college"
                value={formData.college_name}
                onChange={(e) => handleInputChange("college_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder="e.g., B.Tech Computer Science"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year of Study *</Label>
              <Select
                value={formData.year_of_study}
                onValueChange={(value) => handleInputChange("year_of_study", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                  <SelectItem value="5">5th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cgpa">Current CGPA (0-10) *</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.current_cgpa}
                onChange={(e) => handleInputChange("current_cgpa", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance Percentage *</Label>
              <Input
                id="attendance"
                type="number"
                min="0"
                max="100"
                value={formData.attendance_percentage}
                onChange={(e) => handleInputChange("attendance_percentage", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backlogs">Previous Backlogs *</Label>
              <Input
                id="backlogs"
                type="number"
                min="0"
                value={formData.previous_backlogs}
                onChange={(e) => handleInputChange("previous_backlogs", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="study-hours">Study Hours per Day *</Label>
              <Input
                id="study-hours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.study_hours_per_day}
                onChange={(e) => handleInputChange("study_hours_per_day", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mental-health">Mental Health Score (1-10) *</Label>
              <Input
                id="mental-health"
                type="number"
                min="1"
                max="10"
                value={formData.mental_health_score}
                onChange={(e) => handleInputChange("mental_health_score", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Background Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Background Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="family-income">Family Income (₹/year) *</Label>
              <Input
                id="family-income"
                type="number"
                value={formData.family_income}
                onChange={(e) => handleInputChange("family_income", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-education">Parent Education Level</Label>
              <Select
                value={formData.parent_education_level}
                onValueChange={(value) => handleInputChange("parent_education_level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_formal_education">No Formal Education</SelectItem>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="higher_secondary">Higher Secondary</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance from Home (km)</Label>
              <Input
                id="distance"
                type="number"
                value={formData.distance_from_home}
                onChange={(e) => handleInputChange("distance_from_home", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Extracurricular Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extracurricular Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Add activity"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExtracurricular())}
              />
              <Button type="button" onClick={addExtracurricular} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {extracurriculars.map((activity) => (
                <Badge key={activity} variant="secondary" className="flex items-center gap-1">
                  {activity}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeExtracurricular(activity)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[200px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Student & Generating AI Analysis...
            </>
          ) : (
            "Add Student & Generate Insights"
          )}
        </Button>
      </div>
    </form>
  )
}

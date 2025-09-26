"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

interface Student {
  id: string
  name: string
  email: string
  college_name: string
}

interface AddInsightDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsightAdded: () => void
}

export function AddInsightDialog({ open, onOpenChange, onInsightAdded }: AddInsightDialogProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    studentId: "",
    counselorName: "",
    insightType: "",
    observation: "",
    recommendation: "",
    priorityLevel: "",
    followUpRequired: false,
    followUpDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchStudents()
    }
  }, [open])

  async function fetchStudents() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("students").select("id, name, email, college_name").order("name")

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("counselor_insights").insert({
        student_id: formData.studentId,
        counselor_name: formData.counselorName,
        insight_type: formData.insightType,
        observation: formData.observation,
        recommendation: formData.recommendation,
        priority_level: formData.priorityLevel,
        follow_up_required: formData.followUpRequired,
        follow_up_date: formData.followUpRequired ? formData.followUpDate : null,
      })

      if (error) throw error

      // Reset form
      setFormData({
        studentId: "",
        counselorName: "",
        insightType: "",
        observation: "",
        recommendation: "",
        priorityLevel: "",
        followUpRequired: false,
        followUpDate: "",
      })

      onInsightAdded()
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding insight:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Counselor Insight</DialogTitle>
          <DialogDescription>Record observations and recommendations for a student</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, studentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.college_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counselor">Counselor Name</Label>
              <Input
                id="counselor"
                value={formData.counselorName}
                onChange={(e) => setFormData((prev) => ({ ...prev, counselorName: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Insight Type</Label>
              <Select
                value={formData.insightType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, insightType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="mental_health">Mental Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={formData.priorityLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priorityLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">Observation</Label>
            <Textarea
              id="observation"
              value={formData.observation}
              onChange={(e) => setFormData((prev) => ({ ...prev, observation: e.target.value }))}
              placeholder="Describe your observations about the student..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation">Recommendation</Label>
            <Textarea
              id="recommendation"
              value={formData.recommendation}
              onChange={(e) => setFormData((prev) => ({ ...prev, recommendation: e.target.value }))}
              placeholder="Provide your recommendations and action items..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="followUp"
              checked={formData.followUpRequired}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, followUpRequired: checked as boolean }))}
            />
            <Label htmlFor="followUp">Follow-up required</Label>
          </div>

          {formData.followUpRequired && (
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, followUpDate: e.target.value }))}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Insight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

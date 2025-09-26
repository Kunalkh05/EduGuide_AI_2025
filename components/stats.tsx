"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Stats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    highRiskStudents: 0,
    counselorInsights: 0,
    successRate: 0,
  })

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
          .in("risk_level", ["high", "critical"])

        // Get counselor insights
        const { count: counselorInsights } = await supabase
          .from("counselor_insights")
          .select("*", { count: "exact", head: true })

        // Calculate success rate (students with low risk)
        const { count: lowRiskStudents } = await supabase
          .from("ai_predictions")
          .select("*", { count: "exact", head: true })
          .eq("risk_level", "low")

        const successRate = totalStudents ? Math.round(((lowRiskStudents || 0) / totalStudents) * 100) : 0

        setStats({
          totalStudents: totalStudents || 0,
          highRiskStudents: highRiskStudents || 0,
          counselorInsights: counselorInsights || 0,
          successRate,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Platform Impact</h2>
          <p className="mt-4 text-muted-foreground">Real-time statistics from our educational platform</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground mt-1">Students Monitored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive">{stats.highRiskStudents}</div>
            <div className="text-sm text-muted-foreground mt-1">High Risk Cases</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.counselorInsights}</div>
            <div className="text-sm text-muted-foreground mt-1">Counselor Insights</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.successRate}%</div>
            <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}

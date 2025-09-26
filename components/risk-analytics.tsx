"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { createClient } from "@/lib/supabase/client"

interface RiskData {
  riskLevel: string
  count: number
  percentage: number
}

interface CollegeRiskData {
  college: string
  critical: number
  high: number
  medium: number
  low: number
}

export function RiskAnalytics() {
  const [riskDistribution, setRiskDistribution] = useState<RiskData[]>([])
  const [collegeRiskData, setCollegeRiskData] = useState<CollegeRiskData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      const supabase = createClient()

      try {
        // Get risk distribution
        const { data: predictions, error: predictionsError } = await supabase
          .from("ai_predictions")
          .select("risk_level")

        if (predictionsError) throw predictionsError

        const riskCounts = predictions.reduce((acc: any, pred) => {
          acc[pred.risk_level] = (acc[pred.risk_level] || 0) + 1
          return acc
        }, {})

        const total = predictions.length
        const riskDistData = Object.entries(riskCounts).map(([level, count]) => ({
          riskLevel: level,
          count: count as number,
          percentage: Math.round(((count as number) / total) * 100),
        }))

        setRiskDistribution(riskDistData)

        // Get college-wise risk data
        const { data: collegeData, error: collegeError } = await supabase.from("students").select(`
            college_name,
            ai_predictions (risk_level)
          `)

        if (collegeError) throw collegeError

        const collegeRiskMap = collegeData.reduce((acc: any, student) => {
          const college = student.college_name
          const riskLevel = student.ai_predictions?.[0]?.risk_level || "unknown"

          if (!acc[college]) {
            acc[college] = { college, critical: 0, high: 0, medium: 0, low: 0 }
          }

          if (riskLevel !== "unknown") {
            acc[college][riskLevel]++
          }

          return acc
        }, {})

        setCollegeRiskData(Object.values(collegeRiskMap))
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const COLORS = {
    critical: "#ef4444",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
  }

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Overall student risk assessment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ riskLevel, percentage }) => `${riskLevel}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.riskLevel as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Summary Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Summary</h3>
          {riskDistribution.map((risk) => (
            <Card key={risk.riskLevel}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[risk.riskLevel as keyof typeof COLORS] }}
                  />
                  <div>
                    <p className="font-medium capitalize">{risk.riskLevel} Risk</p>
                    <p className="text-sm text-muted-foreground">{risk.count} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{risk.percentage}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* College-wise Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>College-wise Risk Analysis</CardTitle>
          <CardDescription>Risk distribution across different colleges</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={collegeRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="college" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="critical" stackId="a" fill={COLORS.critical} name="Critical" />
              <Bar dataKey="high" stackId="a" fill={COLORS.high} name="High" />
              <Bar dataKey="medium" stackId="a" fill={COLORS.medium} name="Medium" />
              <Bar dataKey="low" stackId="a" fill={COLORS.low} name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

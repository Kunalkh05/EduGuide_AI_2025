import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "overview"

    const supabase = await createClient()

    switch (type) {
      case "overview":
        return await getOverviewAnalytics(supabase)
      case "risk_distribution":
        return await getRiskDistribution(supabase)
      case "college_performance":
        return await getCollegePerformance(supabase)
      case "trends":
        return await getTrends(supabase)
      default:
        return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

async function getOverviewAnalytics(supabase: any) {
  const [
    { count: totalStudents },
    { count: highRiskStudents },
    { count: criticalRiskStudents },
    { count: totalInsights },
    { count: pendingFollowUps },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("ai_predictions").select("*", { count: "exact", head: true }).eq("risk_level", "high"),
    supabase.from("ai_predictions").select("*", { count: "exact", head: true }).eq("risk_level", "critical"),
    supabase.from("counselor_insights").select("*", { count: "exact", head: true }),
    supabase.from("counselor_insights").select("*", { count: "exact", head: true }).eq("follow_up_required", true),
  ])

  return NextResponse.json({
    overview: {
      totalStudents: totalStudents || 0,
      highRiskStudents: highRiskStudents || 0,
      criticalRiskStudents: criticalRiskStudents || 0,
      totalInsights: totalInsights || 0,
      pendingFollowUps: pendingFollowUps || 0,
      successRate: totalStudents
        ? Math.round(((totalStudents - (highRiskStudents || 0) - (criticalRiskStudents || 0)) / totalStudents) * 100)
        : 0,
    },
  })
}

async function getRiskDistribution(supabase: any) {
  const { data: predictions, error } = await supabase.from("ai_predictions").select("risk_level")

  if (error) throw error

  const distribution = predictions.reduce((acc: any, pred: any) => {
    acc[pred.risk_level] = (acc[pred.risk_level] || 0) + 1
    return acc
  }, {})

  const total = predictions.length
  const riskDistribution = Object.entries(distribution).map(([level, count]) => ({
    riskLevel: level,
    count: count as number,
    percentage: total ? Math.round(((count as number) / total) * 100) : 0,
  }))

  return NextResponse.json({ riskDistribution })
}

async function getCollegePerformance(supabase: any) {
  const { data: collegeData, error } = await supabase.from("students").select(`
      college_name,
      current_cgpa,
      attendance_percentage,
      ai_predictions (risk_level)
    `)

  if (error) throw error

  const collegeStats = collegeData.reduce((acc: any, student: any) => {
    const college = student.college_name
    if (!acc[college]) {
      acc[college] = {
        college: college,
        totalStudents: 0,
        avgCgpa: 0,
        avgAttendance: 0,
        riskLevels: { low: 0, medium: 0, high: 0, critical: 0 },
      }
    }

    acc[college].totalStudents++
    acc[college].avgCgpa += student.current_cgpa
    acc[college].avgAttendance += student.attendance_percentage

    const riskLevel = student.ai_predictions?.[0]?.risk_level || "unknown"
    if (acc[college].riskLevels[riskLevel] !== undefined) {
      acc[college].riskLevels[riskLevel]++
    }

    return acc
  }, {})

  // Calculate averages
  Object.values(collegeStats).forEach((stats: any) => {
    stats.avgCgpa = Math.round((stats.avgCgpa / stats.totalStudents) * 100) / 100
    stats.avgAttendance = Math.round((stats.avgAttendance / stats.totalStudents) * 100) / 100
  })

  return NextResponse.json({ collegePerformance: Object.values(collegeStats) })
}

async function getTrends(supabase: any) {
  // Get monthly trends for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: monthlyData, error } = await supabase
    .from("ai_predictions")
    .select("created_at, risk_level")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at")

  if (error) throw error

  const monthlyTrends = monthlyData.reduce((acc: any, prediction: any) => {
    const month = new Date(prediction.created_at).toISOString().slice(0, 7) // YYYY-MM format
    if (!acc[month]) {
      acc[month] = { month, low: 0, medium: 0, high: 0, critical: 0, total: 0 }
    }
    acc[month][prediction.risk_level]++
    acc[month].total++
    return acc
  }, {})

  return NextResponse.json({ trends: Object.values(monthlyTrends) })
}

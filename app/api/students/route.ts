import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const college = searchParams.get("college")
    const riskLevel = searchParams.get("risk_level")
    const limit = searchParams.get("limit") || "50"

    const supabase = await createClient()

    let query = supabase
      .from("students")
      .select(`
        *,
        ai_predictions (
          dropout_risk_score,
          risk_level,
          contributing_factors,
          recommendations,
          confidence_score
        ),
        counselor_insights (
          id,
          counselor_name,
          insight_type,
          observation,
          recommendation,
          priority_level,
          created_at
        )
      `)
      .order("name")
      .limit(Number.parseInt(limit))

    if (college) {
      query = query.eq("college_name", college)
    }

    if (riskLevel) {
      query = query.eq("ai_predictions.risk_level", riskLevel)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ students: data })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const studentData = await request.json()
    const supabase = await createClient()

    // Validate required fields
    const requiredFields = ["name", "email", "college_name", "course", "year_of_study"]
    for (const field of requiredFields) {
      if (!studentData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const { data, error } = await supabase.from("students").insert(studentData).select().single()

    if (error) throw error

    return NextResponse.json({ student: data }, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}

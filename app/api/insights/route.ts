import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("student_id")
    const priorityLevel = searchParams.get("priority_level")
    const insightType = searchParams.get("insight_type")
    const limit = searchParams.get("limit") || "20"

    const supabase = await createClient()

    let query = supabase
      .from("counselor_insights")
      .select(`
        *,
        students (name, email, college_name, course)
      `)
      .order("created_at", { ascending: false })
      .limit(Number.parseInt(limit))

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    if (priorityLevel) {
      query = query.eq("priority_level", priorityLevel)
    }

    if (insightType) {
      query = query.eq("insight_type", insightType)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ insights: data })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const insightData = await request.json()
    const supabase = await createClient()

    // Validate required fields
    const requiredFields = [
      "student_id",
      "counselor_name",
      "insight_type",
      "observation",
      "recommendation",
      "priority_level",
    ]
    for (const field of requiredFields) {
      if (!insightData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const { data, error } = await supabase
      .from("counselor_insights")
      .insert(insightData)
      .select(`
        *,
        students (name, email, college_name, course)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ insight: data }, { status: 201 })
  } catch (error) {
    console.error("Error creating insight:", error)
    return NextResponse.json({ error: "Failed to create insight" }, { status: 500 })
  }
}

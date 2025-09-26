import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        ai_predictions (
          dropout_risk_score,
          risk_level,
          contributing_factors,
          recommendations,
          confidence_score,
          created_at
        ),
        counselor_insights (
          id,
          counselor_name,
          insight_type,
          observation,
          recommendation,
          priority_level,
          follow_up_required,
          follow_up_date,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json({ student: data })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updateData = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase.from("students").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ student: data })
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

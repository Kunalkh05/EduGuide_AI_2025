import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const college = searchParams.get("college")
    const resourceType = searchParams.get("resource_type")
    const isActive = searchParams.get("is_active") !== "false" // Default to true

    const supabase = await createClient()

    let query = supabase.from("college_resources").select("*").eq("is_active", isActive).order("college_name")

    if (college) {
      query = query.eq("college_name", college)
    }

    if (resourceType) {
      query = query.eq("resource_type", resourceType)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ resources: data })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const resourceData = await request.json()
    const supabase = await createClient()

    // Validate required fields
    const requiredFields = ["college_name", "resource_type", "resource_name", "description"]
    for (const field of requiredFields) {
      if (!resourceData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const { data, error } = await supabase.from("college_resources").insert(resourceData).select().single()

    if (error) throw error

    return NextResponse.json({ resource: data }, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
  }
}

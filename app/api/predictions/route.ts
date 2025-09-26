import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const GEMINI_API_KEY = "AIzaSyAL23jYnEY80hNhSXmBFb6YGoc1ziYaIKI"

export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch student data
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single()

    if (studentError) throw studentError

    // Generate AI prediction using Gemini
    const predictionPrompt = `
    You are an AI system that predicts dropout risk for college students in India. 
    Analyze the following student data and provide a dropout risk assessment:

    Student Data:
    - CGPA: ${student.current_cgpa}/10
    - Attendance: ${student.attendance_percentage}%
    - Previous Backlogs: ${student.previous_backlogs}
    - Mental Health Score: ${student.mental_health_score}/10
    - Study Hours per Day: ${student.study_hours_per_day}
    - Year of Study: ${student.year_of_study}
    - Family Income: ₹${student.family_income}
    - Extracurricular Activities: ${student.extracurricular_activities?.join(", ") || "None"}

    Please provide:
    1. Dropout risk score (0-100)
    2. Risk level (low, medium, high, critical)
    3. Top 3-5 contributing factors
    4. 3-5 specific recommendations
    5. Confidence score (0-100)

    Format your response as JSON with these exact keys:
    {
      "dropout_risk_score": number,
      "risk_level": "low|medium|high|critical",
      "contributing_factors": ["factor1", "factor2", ...],
      "recommendations": ["rec1", "rec2", ...],
      "confidence_score": number
    }
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: predictionPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error("No response from AI model")
    }

    // Parse the JSON response
    let predictionData
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        predictionData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      // Fallback prediction based on simple rules
      predictionData = generateFallbackPrediction(student)
    }

    // Store prediction in database
    const { data: prediction, error: predictionError } = await supabase
      .from("ai_predictions")
      .insert({
        student_id: studentId,
        dropout_risk_score: predictionData.dropout_risk_score,
        risk_level: predictionData.risk_level,
        contributing_factors: predictionData.contributing_factors,
        recommendations: predictionData.recommendations,
        confidence_score: predictionData.confidence_score,
        model_version: "gemini-pro-v1.0",
      })
      .select()
      .single()

    if (predictionError) throw predictionError

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error("Error generating prediction:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}

function generateFallbackPrediction(student: any) {
  let riskScore = 0
  const factors = []
  const recommendations = []

  // CGPA factor (40% weight)
  if (student.current_cgpa < 5.0) {
    riskScore += 40
    factors.push("Very low CGPA")
    recommendations.push("Seek immediate academic support and tutoring")
  } else if (student.current_cgpa < 6.5) {
    riskScore += 25
    factors.push("Below average CGPA")
    recommendations.push("Focus on improving study habits and seek help in difficult subjects")
  } else if (student.current_cgpa < 8.0) {
    riskScore += 10
  }

  // Attendance factor (25% weight)
  if (student.attendance_percentage < 60) {
    riskScore += 25
    factors.push("Poor attendance")
    recommendations.push("Improve attendance and communicate with professors about absences")
  } else if (student.attendance_percentage < 80) {
    riskScore += 15
    factors.push("Below average attendance")
    recommendations.push("Work on maintaining consistent attendance")
  }

  // Backlogs factor (20% weight)
  if (student.previous_backlogs > 3) {
    riskScore += 20
    factors.push("Multiple backlogs")
    recommendations.push("Create a plan to clear pending backlogs")
  } else if (student.previous_backlogs > 0) {
    riskScore += 10
    factors.push("Pending backlogs")
    recommendations.push("Focus on clearing current backlogs")
  }

  // Mental health factor (15% weight)
  if (student.mental_health_score < 4) {
    riskScore += 15
    factors.push("Low mental health score")
    recommendations.push("Seek counseling and mental health support")
  } else if (student.mental_health_score < 6) {
    riskScore += 8
    factors.push("Mental health concerns")
    recommendations.push("Practice stress management and self-care")
  }

  // Determine risk level
  let riskLevel
  if (riskScore >= 70) riskLevel = "critical"
  else if (riskScore >= 50) riskLevel = "high"
  else if (riskScore >= 30) riskLevel = "medium"
  else riskLevel = "low"

  // Add general recommendations
  if (recommendations.length < 3) {
    recommendations.push("Maintain regular study schedule")
    recommendations.push("Participate in extracurricular activities")
    recommendations.push("Build relationships with professors and peers")
  }

  return {
    dropout_risk_score: Math.min(riskScore, 100),
    risk_level: riskLevel,
    contributing_factors: factors.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    confidence_score: 85,
  }
}

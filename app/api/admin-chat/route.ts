import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyAL23jYnEY80hNhSXmBFb6YGoc1ziYaIKI"

export async function POST(request: NextRequest) {
  try {
    const { message, context, previousMessages } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context for multi-turn chat
    let conversationHistory = ""
    if (previousMessages && previousMessages.length > 0) {
      conversationHistory = previousMessages
        .map((msg: any) => `${msg.role === "user" ? "Counselor" : "AI"}: ${msg.content}`)
        .join("\n")
    }

    const systemPrompt = `
    You are an AI assistant specialized in educational counseling and student support for Indian colleges. 
    You help counselors and administrators with:

    1. Student intervention strategies
    2. Risk assessment interpretation  
    3. Personalized recommendations for at-risk students
    4. Best practices for academic and mental health support
    5. Understanding dropout risk factors in Indian educational context

    Key guidelines:
    - Provide practical, actionable advice
    - Consider Indian cultural and educational context
    - Focus on evidence-based interventions
    - Be empathetic and supportive in tone
    - Suggest specific steps counselors can take
    - Reference common challenges in Indian higher education

    Previous conversation:
    ${conversationHistory}

    Current counselor question: ${message}

    Provide a helpful, detailed response with specific recommendations.
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
                  text: systemPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
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

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in admin chat:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

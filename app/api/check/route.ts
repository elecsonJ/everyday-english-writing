import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { korean, userInput } = await request.json()

    const prompt = `You are an English teacher helping a Korean student practice English writing.

Korean sentence: "${korean}"
Student's English translation: "${userInput}"

Please provide feedback in the following JSON format ONLY. Do not include any markdown formatting or code blocks:

{
  "grammarCheck": "Point out grammatical errors and explain briefly in Korean. If no errors, say '문법적으로 올바른 문장입니다.'",
  "improvedVersion": "Provide a minimally corrected English sentence that fixes errors while keeping the original structure. If no errors, return the original sentence.",
  "nativeVersion": "Provide a natural, native English sentence that conveys the same meaning, regardless of structure."
}

Important: Return ONLY the JSON object, no additional text, no markdown formatting.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      let responseText = content.text.trim()
      
      // Remove markdown code blocks if present
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*\n?/, '').replace(/\n?\s*```/, '')
      }
      if (responseText.includes('```')) {
        responseText = responseText.replace(/```\s*\n?/, '').replace(/\n?\s*```/, '')
      }
      
      // Extract JSON from response if it contains extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        responseText = jsonMatch[0]
      }
      
      console.log('Claude raw response:', content.text)
      console.log('Cleaned response:', responseText)
      
      try {
        const feedback = JSON.parse(responseText)
        
        // Validate required fields
        if (!feedback.grammarCheck || !feedback.improvedVersion || !feedback.nativeVersion) {
          throw new Error('Missing required fields in response')
        }
        
        return NextResponse.json(feedback)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Response text:', responseText)
        return NextResponse.json({ 
          error: 'Failed to parse Claude response',
          details: responseText,
          originalResponse: content.text
        }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
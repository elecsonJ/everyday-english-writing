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

Please provide feedback in the following format:
1. Grammar Check: Point out any grammatical errors and explain them briefly in Korean
2. Improved Version: Provide a minimally corrected version that fixes errors while keeping the student's sentence structure
3. Native Version: Provide a natural native speaker version, regardless of the student's sentence structure

Respond in JSON format:
{
  "grammarCheck": "문법 체크 내용 (한국어)",
  "improvedVersion": "Minimally corrected English sentence",
  "nativeVersion": "Natural native English sentence"
}`

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
      
      // Remove markdown code block if present
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json\n?/, '').replace(/\n?```$/, '')
      }
      
      console.log('Claude response:', responseText)
      
      try {
        const feedback = JSON.parse(responseText)
        return NextResponse.json(feedback)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Response text:', responseText)
        return NextResponse.json({ 
          error: 'Failed to parse response',
          details: responseText 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
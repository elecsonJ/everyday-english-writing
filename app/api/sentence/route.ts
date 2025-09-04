import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SENTENCE_TOPICS = [
  '일상 생활',
  '업무/비즈니스',
  '여행',
  '감정 표현',
  '의견 제시',
  '계획/미래',
  '과거 경험',
  '가족/친구',
  '취미',
  '음식/요리'
]

export async function GET() {
  try {
    const topic = SENTENCE_TOPICS[Math.floor(Math.random() * SENTENCE_TOPICS.length)]
    
    const prompt = `Generate 3 Korean sentences for English writing practice.
Topic: ${topic}
Level: Intermediate

Requirements:
- Sentences should be practical and commonly used in daily life
- Each sentence should be different in structure (statement, question, suggestion, etc.)
- Length: 10-20 Korean words per sentence
- Include various grammar patterns

Respond in JSON format:
{
  "sentences": [
    "Korean sentence 1",
    "Korean sentence 2", 
    "Korean sentence 3"
  ]
}`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      const data = JSON.parse(content.text)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate sentences' }, { status: 500 })
  }
}
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
  '음식/요리',
  '쇼핑/소비',
  '건강/의료',
  '날씨/계절',
  '약속/만남',
  '공부/학습',
  '스마트폰/기술',
  '영화/드라마',
  '운동/헬스',
  '갈등/문제해결',
  '습관/루틴'
]

export async function GET() {
  try {
    const topic = SENTENCE_TOPICS[Math.floor(Math.random() * SENTENCE_TOPICS.length)]
    
    const prompt = `Generate 5 Korean sentences for English writing practice.
Topic: ${topic}
Level: Intermediate

Requirements:
- Sentences should be practical and commonly used in daily life
- Each sentence should be different in structure (statement, question, suggestion, request, exclamation, etc.)
- Length: 10-20 Korean words per sentence
- Include various grammar patterns and tenses
- Cover different situations within the topic

Respond in JSON format:
{
  "sentences": [
    "Korean sentence 1",
    "Korean sentence 2", 
    "Korean sentence 3",
    "Korean sentence 4",
    "Korean sentence 5"
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
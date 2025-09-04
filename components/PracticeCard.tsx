'use client'

import { useState } from 'react'

interface Feedback {
  grammarCheck: string;
  improvedVersion: string;
  nativeVersion: string;
}

interface PracticeCardProps {
  korean: string
  sentenceNumber: number
  onComplete: (userInput: string, feedback: Feedback) => void
  isCompleted: boolean
}

export default function PracticeCard({ korean, sentenceNumber, onComplete, isCompleted }: PracticeCardProps) {
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [verifyInput, setVerifyInput] = useState('')
  const [verifyStep, setVerifyStep] = useState(0)

  const handleSubmit = async () => {
    if (!userInput.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ korean, userInput })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      console.log('API response:', data)
      
      // Check if response has error
      if (data.error) {
        console.error('API error:', data.error, data.details)
        alert(`피드백 생성 중 오류가 발생했습니다: ${data.error}`)
        return
      }

      // Validate response structure
      if (!data.grammarCheck || !data.improvedVersion || !data.nativeVersion) {
        console.error('Invalid response structure:', data)
        alert('피드백 형식이 올바르지 않습니다. 다시 시도해주세요.')
        return
      }

      setFeedback(data)
    } catch (error) {
      console.error('Network error:', error)
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = () => {
    if (!feedback) return
    
    if (verifyStep === 0 && verifyInput.trim() === feedback.improvedVersion.trim()) {
      setVerifyStep(1)
      setVerifyInput('')
    } else if (verifyStep === 1 && verifyInput.trim() === feedback.nativeVersion.trim()) {
      onComplete(userInput, feedback)
    }
  }

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-green-700">문장 {sentenceNumber} ✓</h3>
        </div>
        <p className="text-gray-600">{korean}</p>
        <p className="text-sm text-green-600 mt-2">완료됨</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">문장 {sentenceNumber}</h3>
        <p className="text-gray-700">{korean}</p>
      </div>

      {!feedback && (
        <div className="space-y-3">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="영어로 작문해주세요..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !userInput.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? '검사 중...' : '제출하기'}
          </button>
        </div>
      )}

      {feedback && (
        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-600 mb-2">1. 문법 체크</h4>
            <p className="text-sm">{feedback.grammarCheck}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-600 mb-2">2. 개선된 문장</h4>
            <p className="text-sm font-medium">{feedback.improvedVersion}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-purple-600 mb-2">3. 원어민 스타일</h4>
            <p className="text-sm font-medium">{feedback.nativeVersion}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">
              {verifyStep === 0 ? '개선된 문장을 입력해주세요:' : '원어민 스타일 문장을 입력해주세요:'}
            </h4>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              placeholder={verifyStep === 0 ? feedback.improvedVersion : feedback.nativeVersion}
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
            />
            <button
              onClick={handleVerify}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              확인하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
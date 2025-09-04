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
  const [improvedInput, setImprovedInput] = useState('')
  const [nativeInput, setNativeInput] = useState('')

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
    
    const improvedMatch = improvedInput.trim().toLowerCase() === feedback.improvedVersion.trim().toLowerCase()
    const nativeMatch = nativeInput.trim().toLowerCase() === feedback.nativeVersion.trim().toLowerCase()
    
    if (improvedMatch && nativeMatch) {
      onComplete(userInput, feedback)
    } else {
      let errorMessage = '입력이 정확하지 않습니다:\n'
      if (!improvedMatch) {
        errorMessage += `• 개선된 문장: "${feedback.improvedVersion}"\n`
      }
      if (!nativeMatch) {
        errorMessage += `• 원어민 스타일: "${feedback.nativeVersion}"\n`
      }
      alert(errorMessage)
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
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-orange-600 mb-2">내가 입력한 문장</h4>
            <p className="text-sm font-medium text-orange-800">{userInput}</p>
          </div>

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

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold text-lg text-center text-gray-700 mb-4">📝 학습 단계</h4>
            <p className="text-sm text-gray-600 text-center mb-4">위의 문장들을 참고하여 개선된 문장과 원어민 스타일을 입력해주세요</p>
            
            <div className="grid gap-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-blue-700 mb-2">📖 개선된 문장 입력:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={feedback.improvedVersion}
                  value={improvedInput}
                  onChange={(e) => setImprovedInput(e.target.value)}
                />
                <p className="text-xs text-blue-600 mt-1">위 &quot;2. 개선된 문장&quot;과 같게 입력하세요</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-purple-700 mb-2">🌟 원어민 스타일 입력:</label>
                <input
                  type="text"
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={feedback.nativeVersion}
                  value={nativeInput}
                  onChange={(e) => setNativeInput(e.target.value)}
                />
                <p className="text-xs text-purple-600 mt-1">위 &quot;3. 원어민 스타일&quot;과 같게 입력하세요</p>
              </div>
            </div>
            
            <button
              onClick={handleVerify}
              disabled={!improvedInput.trim() || !nativeInput.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all"
            >
              🎯 학습 완료하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
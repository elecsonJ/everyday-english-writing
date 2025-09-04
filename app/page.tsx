'use client'

import { useEffect, useState } from 'react'
import PracticeCard from '@/components/PracticeCard'
import { LocalStorage, PracticeSession } from '@/lib/storage'
import { NotificationManager } from '@/lib/notifications'

export default function Home() {
  const [sentences, setSentences] = useState<string[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<string>('default')

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    // Check and update streak
    LocalStorage.updateStreak()
    
    // Get user progress
    const progress = LocalStorage.getUserProgress()
    setStreak(progress.streak)

    // Get or create today's session
    let todaySession = LocalStorage.getTodaySession()
    
    if (!todaySession) {
      // Fetch new sentences for today
      try {
        const response = await fetch('/api/sentence')
        const data = await response.json()
        
        todaySession = {
          date: new Date().toISOString().split('T')[0],
          completed: false,
          sentences: data.sentences.map((korean: string) => ({
            korean,
            userInput: '',
            feedback: undefined
          }))
        }
        
        LocalStorage.saveTodaySession(todaySession)
      } catch (error) {
        console.error('Failed to fetch sentences:', error)
      }
    }

    if (todaySession) {
      setSession(todaySession)
      setSentences(todaySession.sentences.map(s => s.korean))
      setCompletedCount(todaySession.sentences.filter(s => s.feedback).length)
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        if (Notification.permission === 'granted') {
          registration.active?.postMessage({ type: 'SCHEDULE_NOTIFICATION' })
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }

    setIsLoading(false)
  }

  const handleSentenceComplete = (index: number, userInput: string, feedback: {
    grammarCheck: string;
    improvedVersion: string;
    nativeVersion: string;
  }) => {
    if (!session) return

    const newSession = { ...session }
    newSession.sentences[index] = {
      korean: sentences[index],
      userInput,
      feedback
    }

    const newCompletedCount = newSession.sentences.filter(s => s.feedback).length
    setCompletedCount(newCompletedCount)

    if (newCompletedCount === 3) {
      newSession.completed = true
      LocalStorage.saveTodaySession(newSession)
      const progress = LocalStorage.getUserProgress()
      setStreak(progress.streak)
      NotificationManager.showCompletionMessage(progress.streak)
    } else {
      LocalStorage.saveTodaySession(newSession)
    }

    setSession(newSession)
  }

  const resetToday = () => {
    const newSession: PracticeSession = {
      date: new Date().toISOString().split('T')[0],
      completed: false,
      sentences: sentences.map(korean => ({
        korean,
        userInput: '',
        feedback: undefined
      }))
    }
    
    LocalStorage.saveTodaySession(newSession)
    setSession(newSession)
    setCompletedCount(0)
  }

  const requestNotificationPermission = async () => {
    const granted = await NotificationManager.requestPermission()
    if (granted) {
      setNotificationPermission('granted')
      
      // Schedule notifications after permission is granted
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready
          registration.active?.postMessage({ type: 'SCHEDULE_NOTIFICATION' })
        } catch (error) {
          console.error('Service Worker scheduling failed:', error)
        }
      }
    } else {
      setNotificationPermission('denied')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">영어 작문 연습</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">매일 3문장 작문하기</p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{streak}</p>
                <p className="text-xs text-gray-500">연속일수</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{completedCount}/3</p>
                <p className="text-xs text-gray-500">오늘 완료</p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Cards */}
        <div className="space-y-4">
          {sentences.map((sentence, index) => (
            <PracticeCard
              key={index}
              korean={sentence}
              sentenceNumber={index + 1}
              onComplete={(userInput, feedback) => handleSentenceComplete(index, userInput, feedback)}
              isCompleted={!!session?.sentences[index]?.feedback}
              completedData={session?.sentences[index]?.feedback ? {
                userInput: session.sentences[index].userInput,
                feedback: session.sentences[index].feedback!
              } : undefined}
            />
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === 3 && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 축하합니다!</h2>
            <p>오늘의 작문을 모두 완료했습니다!</p>
            <p className="text-lg font-semibold mt-2">연속 {streak}일 달성!</p>
            <button
              onClick={resetToday}
              className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              다시 연습하기
            </button>
          </div>
        )}

        {/* Notification Permission */}
        {notificationPermission === 'default' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">🔔 매일 오전 7시 알림</h3>
                <p className="text-blue-600 text-sm mt-1">꾸준한 학습을 위해 알림을 허용해주세요</p>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
              >
                알림 허용
              </button>
            </div>
          </div>
        )}

        {notificationPermission === 'granted' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-green-700 font-semibold">알림이 설정되었습니다!</span>
              <span className="text-green-600 text-sm">매일 오전 7시에 알림을 받게됩니다.</span>
            </div>
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-amber-700">
              <span className="font-semibold">⚠️ 알림이 차단되었습니다</span>
              <p className="text-sm mt-1">브라우저 설정에서 알림을 허용해주세요</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">사용 방법</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>한국어 문장을 영어로 작문해주세요</li>
            <li>제출 후 피드백을 확인하세요</li>
            <li>개선된 문장과 원어민 스타일 문장을 입력해서 학습을 완료하세요</li>
            <li>매일 오전 7시에 알림을 받을 수 있습니다</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

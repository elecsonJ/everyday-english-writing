export interface PracticeSession {
  date: string
  completed: boolean
  sentences: {
    korean: string
    userInput: string
    feedback?: {
      grammarCheck: string
      improvedVersion: string
      nativeVersion: string
    }
  }[]
}

export interface UserProgress {
  streak: number
  lastCompletedDate: string | null
  totalSentences: number
  sessions: PracticeSession[]
}

export class LocalStorage {
  private static STORAGE_KEY = 'english-practice-data'

  static getUserProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return {
        streak: 0,
        lastCompletedDate: null,
        totalSentences: 0,
        sessions: []
      }
    }

    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) {
      return {
        streak: 0,
        lastCompletedDate: null,
        totalSentences: 0,
        sessions: []
      }
    }

    return JSON.parse(data)
  }

  static saveUserProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
  }

  static getTodaySession(): PracticeSession | null {
    const progress = this.getUserProgress()
    const today = new Date().toISOString().split('T')[0]
    return progress.sessions.find(s => s.date === today) || null
  }

  static saveTodaySession(session: PracticeSession): void {
    const progress = this.getUserProgress()
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = progress.sessions.findIndex(s => s.date === today)

    if (existingIndex >= 0) {
      progress.sessions[existingIndex] = session
    } else {
      progress.sessions.push(session)
    }

    if (session.completed) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (progress.lastCompletedDate === yesterdayStr) {
        progress.streak++
      } else if (progress.lastCompletedDate !== today) {
        progress.streak = 1
      }

      progress.lastCompletedDate = today
      progress.totalSentences += 3
    }

    this.saveUserProgress(progress)
  }

  static updateStreak(): void {
    const progress = this.getUserProgress()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (progress.lastCompletedDate !== today && progress.lastCompletedDate !== yesterdayStr) {
      progress.streak = 0
      this.saveUserProgress(progress)
    }
  }
}
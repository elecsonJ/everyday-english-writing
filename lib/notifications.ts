export class NotificationManager {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  static async scheduleDaily7AM(): Promise<void> {
    if (!('serviceWorker' in navigator)) return

    const registration = await navigator.serviceWorker.ready
    
    try {
      await registration.showNotification('작문에 도전하세요!', {
        body: '오늘의 영어 작문 3문장을 연습해보세요',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'daily-reminder',
        requireInteraction: true
      })
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  static showCompletionMessage(streak: number): void {
    const messages = [
      `훌륭해요! 오늘의 작문을 완료했습니다! 🎉 (연속 ${streak}일)`,
      `대단해요! ${streak}일 연속 달성! 💪`,
      `완벽합니다! 벌써 ${streak}일째 꾸준히 하고 계시네요! 🌟`,
      `최고예요! ${streak}일 연속 성공! 계속 이어가세요! 🚀`
    ]

    const message = messages[Math.floor(Math.random() * messages.length)]
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('축하합니다!', {
        body: message,
        icon: '/icon-192x192.png'
      })
    }
  }
}
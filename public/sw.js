self.addEventListener('install', (event) => {
  console.log('Service Worker installing.')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.')
  event.waitUntil(clients.claim())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})

// Schedule daily notification at 7 AM
function scheduleDailyNotification() {
  const now = new Date()
  const scheduled = new Date()
  scheduled.setHours(7, 0, 0, 0)
  
  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1)
  }
  
  const timeout = scheduled.getTime() - now.getTime()
  
  setTimeout(() => {
    self.registration.showNotification('작문에 도전하세요!', {
      body: '오늘의 영어 작문 3문장을 연습해보세요',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'daily-reminder',
      requireInteraction: true
    })
    
    // Schedule next day's notification
    scheduleDailyNotification()
  }, timeout)
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduleDailyNotification()
  }
})
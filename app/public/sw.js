
// Service Worker para notificaciones push y PWA
const CACHE_NAME = 'camino-guau-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/ranking',
  '/manifest.json',
  '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Push event - Handle incoming push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: 'Nueva notificación de Camino Guau',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver en App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/xmark.png'
      }
    ]
  };

  let title = 'Camino Guau';
  let body = 'Nueva notificación';

  if (event.data) {
    const notificationData = event.data.json();
    title = notificationData.title || title;
    body = notificationData.message || notificationData.body || body;
    
    if (notificationData.data) {
      options.data = { ...options.data, ...notificationData.data };
    }
  }

  options.body = body;

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync event (for when user comes back online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync data when back online
      syncData()
    );
  }
});

async function syncData() {
  // Implement background sync logic here
  // For example, sync user progress, stamps, etc.
  try {
    // Sync logic would go here
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

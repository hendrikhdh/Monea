// Monéa minimal service worker — App-Shell cache with branded offline page.
// CLAUDE.md: "offline functionality is NOT required" — this SW exists so iOS/Android
// treat the site as an installable PWA and so users see a branded screen instead
// of the browser's offline error.

const CACHE_NAME = 'monea-v1'
const APP_SHELL = [
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-180x180.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Bypass cross-origin (Supabase, fonts, analytics)
  if (url.origin !== self.location.origin) return

  // Bypass API + Next.js data routes — these need fresh data
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/data/') ||
    url.pathname.startsWith('/auth/')
  ) {
    return
  }

  // Navigation requests (HTML): network-first, fallback to /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/offline'))
      )
    )
    return
  }

  // Static assets (icons, _next/static): cache-first with background refresh
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(png|jpg|jpeg|svg|webp|woff2?|css|js)$/.test(url.pathname)

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return response
          })
          .catch(() => cached)
        return cached || fetchPromise
      })
    )
  }
})

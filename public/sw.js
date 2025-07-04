const CACHE_NAME = "healthcare-ai-v1"
const MAP_CACHE_NAME = "healthcare-maps-v1"
const HOSPITAL_CACHE_NAME = "healthcare-hospitals-v1"

const urlsToCache = [
  "/",
  "/patient/symptoms",
  "/patient/med-reminder",
  "/patient/postop-followup",
  "/patient/recipes",
  "/patient/diagnosys",
  "/patient/appointments",
  "/patient/hospitals",
  "/patient/records",
  "/patient/prescriptions",
  "/patient/ai-prescriptions",
  "/patient/goals",
  "/patient/chat",
  "/doctor/dashboard",
  "/doctor/chat",
  "/manifest.json",
]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event with enhanced offline support
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Handle map tile requests
  if (url.hostname === "tile.openstreetmap.org" || url.hostname.includes("tile.openstreetmap.org")) {
    event.respondWith(
      caches.open(MAP_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response
          }

          // If online, fetch and cache the tile
          return fetch(event.request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                cache.put(event.request, fetchResponse.clone())
              }
              return fetchResponse
            })
            .catch(() => {
              // Return a placeholder tile if offline and not cached
              return new Response(
                '<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#f3f4f6"/><text x="128" y="128" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="14">Offline</text></svg>',
                { headers: { "Content-Type": "image/svg+xml" } },
              )
            })
        })
      }),
    )
    return
  }

  // Handle API requests for hospital data
  if (url.pathname.includes("/api/hospitals")) {
    event.respondWith(
      caches.open(HOSPITAL_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response
          }

          return fetch(event.request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                cache.put(event.request, fetchResponse.clone())
              }
              return fetchResponse
            })
            .catch(() => {
              // Return cached hospital data if available
              return (
                cache.match("/api/hospitals/fallback") ||
                new Response(
                  JSON.stringify({
                    hospitals: [],
                    offline: true,
                    message: "Offline mode - limited data available",
                  }),
                  { headers: { "Content-Type": "application/json" } },
                )
              )
            })
        })
      }),
    )
    return
  }

  // Handle other requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response
      }

      return fetch(event.request)
        .then((fetchResponse) => {
          // Cache successful responses
          if (fetchResponse.ok && event.request.method === "GET") {
            const responseClone = fetchResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return fetchResponse
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html") || caches.match("/")
          }
          return new Response("Offline", { status: 503 })
        })
    }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== MAP_CACHE_NAME && cacheName !== HOSPITAL_CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_TILES") {
    const tiles = event.data.tiles

    caches.open(MAP_CACHE_NAME).then((cache) => {
      const cachePromises = tiles.map((tileUrl) => {
        return fetch(tileUrl)
          .then((response) => {
            if (response.ok) {
              return cache.put(tileUrl, response)
            }
          })
          .catch((error) => {
            console.log("Failed to cache tile:", tileUrl, error)
          })
      })

      Promise.all(cachePromises).then(() => {
        // Notify main thread that caching is complete
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "TILES_CACHED",
              count: tiles.length,
            })
          })
        })
      })
    })
  }

  if (event.data && event.data.type === "CACHE_HOSPITAL_DATA") {
    const hospitalData = event.data.data

    caches.open(HOSPITAL_CACHE_NAME).then((cache) => {
      cache.put(
        "/api/hospitals/fallback",
        new Response(JSON.stringify(hospitalData), { headers: { "Content-Type": "application/json" } }),
      )
    })
  }
})

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from CareConnect",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Details",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("CareConnect", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "hospital-data-sync") {
    event.waitUntil(syncHospitalData())
  }

  if (event.tag === "emergency-sync") {
    event.waitUntil(syncEmergencyData())
  }
})

async function syncHospitalData() {
  try {
    // Sync hospital data when back online
    const response = await fetch("/api/hospitals")
    if (response.ok) {
      const data = await response.json()
      const cache = await caches.open(HOSPITAL_CACHE_NAME)
      await cache.put(
        "/api/hospitals/fallback",
        new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } }),
      )
    }
  } catch (error) {
    console.log("Failed to sync hospital data:", error)
  }
}

async function syncEmergencyData() {
  try {
    // Sync any pending emergency requests
    const pendingEmergencies = await getStoredEmergencies()
    for (const emergency of pendingEmergencies) {
      await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emergency),
      })
    }
    await clearStoredEmergencies()
  } catch (error) {
    console.log("Failed to sync emergency data:", error)
  }
}

async function getStoredEmergencies() {
  // Implementation to get stored emergency requests
  return []
}

async function clearStoredEmergencies() {
  // Implementation to clear stored emergency requests
}

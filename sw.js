/**
 * Progressive Web App (PWA) Service Worker
 * Provides offline functionality and performance optimizations for the blog
 */

const CACHE_NAME = 'arris-blog-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/blog.html',
    '/assets/css/blog-components.css',
    '/assets/js/blog-shared.js',
    '/assets/js/performance-monitor.js',
    '/assets/icons/arrisahmad.jpg',
    'https://cdn.tailwindcss.com/3.4.0/tailwind.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css'
];

// Files to cache on first request
const DYNAMIC_CACHE_PATTERNS = [
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/cdnjs\.cloudflare\.com/,
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /blog\/.*\.html$/,
    /\/assets\//
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
    /\/api\//,
    /\.json$/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
            .catch(error => console.error('Service Worker: Cache installation failed:', error))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') return;
    
    // Skip Google Analytics
    if (url.hostname === 'www.google-analytics.com' || 
        url.hostname === 'www.googletagmanager.com') return;
    
    event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Network-first strategy for API calls and JSON
        if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
            return await networkFirst(request);
        }
        
        // Cache-first strategy for static resources
        if (STATIC_FILES.some(file => request.url.endsWith(file)) || 
            url.pathname.startsWith('/assets/')) {
            return await cacheFirst(request);
        }
        
        // Stale-while-revalidate for dynamic content
        if (DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
            return await staleWhileRevalidate(request);
        }
        
        // Default: network with fallback
        return await networkWithFallback(request);
        
    } catch (error) {
        console.error('Service Worker: Request failed:', error);
        return await fallbackResponse(request);
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Update cache in background
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    });
    
    // Return cached version immediately if available
    return cachedResponse || fetchPromise;
}

// Network with fallback
async function networkWithFallback(request) {
    try {
        return await fetch(request);
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return await fallbackResponse(request);
    }
}

// Fallback responses for offline scenarios
async function fallbackResponse(request) {
    const url = new URL(request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        return new Response(
            `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Arris Ahmad Blog</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                           margin: 0; padding: 2rem; text-align: center; background: #f9fafb; }
                    .container { max-width: 500px; margin: 0 auto; }
                    .icon { font-size: 4rem; margin-bottom: 1rem; }
                    h1 { color: #374151; margin-bottom: 1rem; }
                    p { color: #6b7280; margin-bottom: 2rem; }
                    .btn { background: #3b82f6; color: white; padding: 0.75rem 1.5rem; 
                           border: none; border-radius: 0.5rem; text-decoration: none; 
                           display: inline-block; font-weight: 500; }
                    .btn:hover { background: #2563eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">📡</div>
                    <h1>You're Offline</h1>
                    <p>It looks like you're not connected to the internet. Please check your connection and try again.</p>
                    <a href="/" class="btn" onclick="window.location.reload()">Try Again</a>
                </div>
                <script>
                    // Auto-retry when connection is restored
                    window.addEventListener('online', () => window.location.reload());
                </script>
            </body>
            </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
    
    // Return placeholder for images
    if (request.destination === 'image') {
        return new Response(
            `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif">
                    Image not available offline
                </text>
            </svg>`,
            {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
    
    // Generic fallback
    return new Response('Resource not available offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache'
        }
    });
}

// Background sync for analytics and form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    // Implement analytics sync when online
    console.log('Service Worker: Syncing analytics data');
    // This would sync any stored analytics data when connection is restored
}

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/assets/icons/arrisahmad.jpg',
        badge: '/assets/icons/arrisahmad.jpg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Read Now',
                icon: '/assets/icons/arrisahmad.jpg'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/arrisahmad.jpg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Arris Ahmad Blog', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Cleanup old caches periodically
setInterval(() => {
    caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
            if (cacheName.includes('v') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                caches.delete(cacheName);
            }
        });
    });
}, 24 * 60 * 60 * 1000); // Clean up daily

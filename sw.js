const CACHE_NAME = 'simple-todo-pwa-cache-v1';
const urlsToCache = [
    '/', // Cache the root (index.html)
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    // Add paths to your icons here:
    '/Images/images.png',
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache essential files:', error);
            })
    );
});

// Fetch event: serve cached assets or fetch from network
self.addEventListener('fetch', (event) => {
    // We only intercept requests for assets we might have cached
    // This basic strategy tries cache first
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache match - fetch from network
                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                console.error('Service Worker: Fetch failed:', event.request.url, error);
                // You could return an offline page here if needed
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating new service worker.');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Claim clients immediately so the new service worker controls existing tabs
    event.waitUntil(clients.claim());
});
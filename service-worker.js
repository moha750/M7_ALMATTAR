const CACHE_NAME = 'm7-almattar-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png',
  '/IBR08014.jpg',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/favicon-96x96.png',
  '/images/apple-touch-icon.png',
  '/images/site.webmanifest',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
  'https://unpkg.com/@supabase/supabase-js@2',
  'https://unpkg.com/i18next@21.6.4/i18next.min.js',
  'https://unpkg.com/i18next-http-backend@1.4.2/i18nextHttpBackend.min.js',
  'https://unpkg.com/i18next-browser-languagedetector@6.1.2/i18nextBrowserLanguageDetector.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
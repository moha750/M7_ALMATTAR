const CACHE_NAME = 'm7-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/images/favicon-96x96.png',
  '/images/favicon.svg',
  '/images/apple-touch-icon.png',
  // أضف مسارات الصور والخطوط وغيرها حسب الحاجة
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

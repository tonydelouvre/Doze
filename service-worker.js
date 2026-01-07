const CACHE_VERSION = "doze-v2";
const CACHE_NAME = `doze-cache-${CACHE_VERSION}`;

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/app.js",
  "/js/time.js",
  "/js/sleep.js",
  "/js/storage.js",
  "/js/chart.js",
  "/js/reminder.js",
  "/assets/icon-192.png",
  "/assets/icon-512.png"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE (hapus cache lama)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

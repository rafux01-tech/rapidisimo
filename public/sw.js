self.addEventListener("install", () => {
  // Activamos el service worker inmediatamente.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Para empezar, no hacemos caché agresivo. Solo es necesario tener
// un service worker registrado para que la app sea instalable como PWA.


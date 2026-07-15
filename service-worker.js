const CACHE_NAME = "etat-des-lieux-v4-stable";
const LOCAL_ASSETS = [
  "./","./index.html","./assets/styles.css","./js/app.js","./js/db.js",
  "./js/templates.js","./js/signature.js","./js/pdf.js",
  "./manifest.webmanifest","./icons/apple-touch-icon.png",
  "./icons/favicon-32.png","./icons/icon-192.png","./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return new Response("Ressource indisponible hors connexion.", {
          status: 503,
          headers: {"Content-Type": "text/plain; charset=utf-8"}
        });
      });
    })
  );
});

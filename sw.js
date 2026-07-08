const CACHE_NAME = "controle-calorias-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/variables.css",
  "./js/app.js",
  "./js/auth.js",
  "./js/config.js",
  "./js/router.js",
  "./js/supabase.js",
  "./views/login.html",
  "./views/dashboard.html",
  "./views/meal.html",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
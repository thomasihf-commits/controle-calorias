const CACHE_NAME = "controle-calorias-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/style.css",
  "./js/app.js",
  "./js/auth.js",
  "./js/config.js",
  "./js/router.js",
  "./js/supabase.js",
  "./js/controllers/loginController.js",
  "./js/controllers/dashboardController.js",
  "./js/controllers/mealController.js",
  "./js/controllers/historyController.js",
  "./js/controllers/profileController.js",
  "./js/services/mealService.js",
  "./js/services/aiService.js",
  "./views/login.html",
  "./views/dashboard.html",
  "./views/meal.html",
  "./views/history.html",
  "./views/profile.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});

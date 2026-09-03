const CACHE_NAME = "math-platform-v1";
const APP_SHELL = [
  "./student.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// عند التثبيت: خزّن هيكل التطبيق الأساسي محلياً
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// عند التفعيل: احذف أي نسخ كاش قديمة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// عند الطلب: جرّب الشبكة أولاً (لبيانات فايربيس المحدّثة)، وإن فشلت استخدم الكاش
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

const CACHE_NAME = 'ccna-study-hub-v4';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/storage.js',
  './js/i18n.js',
  './js/data-questions.js',
  './js/data-flashcards.js',
  './js/data-labs.js',
  './js/data-kw.js',
  './js/data-graph.js',
  './js/data-zh.js',
  './js/subnetting.js',
  './js/app.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

const EXHIBIT_ASSETS = [
  './exhibits/dd-a-1.jpg',
  './exhibits/dd-a-10.jpg',
  './exhibits/dd-a-11.jpg',
  './exhibits/dd-a-12.jpg',
  './exhibits/dd-a-13.jpg',
  './exhibits/dd-a-14.jpg',
  './exhibits/dd-a-15.jpg',
  './exhibits/dd-a-16.jpg',
  './exhibits/dd-a-17.jpg',
  './exhibits/dd-a-18.jpg',
  './exhibits/dd-a-19.jpg',
  './exhibits/dd-a-2.jpg',
  './exhibits/dd-a-20.jpg',
  './exhibits/dd-a-21.jpg',
  './exhibits/dd-a-22.jpg',
  './exhibits/dd-a-23.jpg',
  './exhibits/dd-a-24.jpg',
  './exhibits/dd-a-25.jpg',
  './exhibits/dd-a-26.jpg',
  './exhibits/dd-a-27.jpg',
  './exhibits/dd-a-28.jpg',
  './exhibits/dd-a-29.jpg',
  './exhibits/dd-a-3.jpg',
  './exhibits/dd-a-30.jpg',
  './exhibits/dd-a-31.jpg',
  './exhibits/dd-a-32.jpg',
  './exhibits/dd-a-33.jpg',
  './exhibits/dd-a-34.jpg',
  './exhibits/dd-a-35.jpg',
  './exhibits/dd-a-36.jpg',
  './exhibits/dd-a-37.jpg',
  './exhibits/dd-a-38.jpg',
  './exhibits/dd-a-39.jpg',
  './exhibits/dd-a-4.jpg',
  './exhibits/dd-a-40.jpg',
  './exhibits/dd-a-41.jpg',
  './exhibits/dd-a-42.jpg',
  './exhibits/dd-a-43.jpg',
  './exhibits/dd-a-5.jpg',
  './exhibits/dd-a-6.jpg',
  './exhibits/dd-a-7.jpg',
  './exhibits/dd-a-8.jpg',
  './exhibits/dd-a-9.jpg',
  './exhibits/dd-q-1.jpg',
  './exhibits/dd-q-10.jpg',
  './exhibits/dd-q-11.jpg',
  './exhibits/dd-q-12.jpg',
  './exhibits/dd-q-13.jpg',
  './exhibits/dd-q-14.jpg',
  './exhibits/dd-q-15.jpg',
  './exhibits/dd-q-16.jpg',
  './exhibits/dd-q-17.jpg',
  './exhibits/dd-q-18.jpg',
  './exhibits/dd-q-19.jpg',
  './exhibits/dd-q-2.jpg',
  './exhibits/dd-q-20.jpg',
  './exhibits/dd-q-21.jpg',
  './exhibits/dd-q-22.jpg',
  './exhibits/dd-q-23.jpg',
  './exhibits/dd-q-24.jpg',
  './exhibits/dd-q-25.jpg',
  './exhibits/dd-q-26.jpg',
  './exhibits/dd-q-27.jpg',
  './exhibits/dd-q-28.jpg',
  './exhibits/dd-q-29.jpg',
  './exhibits/dd-q-3.jpg',
  './exhibits/dd-q-30.jpg',
  './exhibits/dd-q-31.jpg',
  './exhibits/dd-q-32.jpg',
  './exhibits/dd-q-33.jpg',
  './exhibits/dd-q-34.jpg',
  './exhibits/dd-q-35.jpg',
  './exhibits/dd-q-36.jpg',
  './exhibits/dd-q-37.jpg',
  './exhibits/dd-q-38.jpg',
  './exhibits/dd-q-39.jpg',
  './exhibits/dd-q-4.jpg',
  './exhibits/dd-q-40.jpg',
  './exhibits/dd-q-41.jpg',
  './exhibits/dd-q-42.jpg',
  './exhibits/dd-q-43.jpg',
  './exhibits/dd-q-5.jpg',
  './exhibits/dd-q-6.jpg',
  './exhibits/dd-q-7.jpg',
  './exhibits/dd-q-8.jpg',
  './exhibits/dd-q-9.jpg',
  './exhibits/ex-pdf-f100.jpg',
  './exhibits/ex-pdf-f108.jpg',
  './exhibits/ex-pdf-f109.jpg',
  './exhibits/ex-pdf-f11.jpg',
  './exhibits/ex-pdf-f110.jpg',
  './exhibits/ex-pdf-f112.jpg',
  './exhibits/ex-pdf-f115.jpg',
  './exhibits/ex-pdf-f117.jpg',
  './exhibits/ex-pdf-f118.jpg',
  './exhibits/ex-pdf-f119.jpg',
  './exhibits/ex-pdf-f12.jpg',
  './exhibits/ex-pdf-f121.jpg',
  './exhibits/ex-pdf-f123.jpg',
  './exhibits/ex-pdf-f124.jpg',
  './exhibits/ex-pdf-f125.jpg',
  './exhibits/ex-pdf-f126.jpg',
  './exhibits/ex-pdf-f127.jpg',
  './exhibits/ex-pdf-f128.jpg',
  './exhibits/ex-pdf-f131.jpg',
  './exhibits/ex-pdf-f134.jpg',
  './exhibits/ex-pdf-f135.jpg',
  './exhibits/ex-pdf-f136.jpg',
  './exhibits/ex-pdf-f138.jpg',
  './exhibits/ex-pdf-f139.jpg',
  './exhibits/ex-pdf-f145.jpg',
  './exhibits/ex-pdf-f146.jpg',
  './exhibits/ex-pdf-f147.jpg',
  './exhibits/ex-pdf-f15.jpg',
  './exhibits/ex-pdf-f151.jpg',
  './exhibits/ex-pdf-f156.jpg',
  './exhibits/ex-pdf-f158.jpg',
  './exhibits/ex-pdf-f168.jpg',
  './exhibits/ex-pdf-f172.jpg',
  './exhibits/ex-pdf-f178.jpg',
  './exhibits/ex-pdf-f18.jpg',
  './exhibits/ex-pdf-f180.jpg',
  './exhibits/ex-pdf-f181.jpg',
  './exhibits/ex-pdf-f184.jpg',
  './exhibits/ex-pdf-f186.jpg',
  './exhibits/ex-pdf-f187.jpg',
  './exhibits/ex-pdf-f188.jpg',
  './exhibits/ex-pdf-f19.jpg',
  './exhibits/ex-pdf-f191.jpg',
  './exhibits/ex-pdf-f192.jpg',
  './exhibits/ex-pdf-f193.jpg',
  './exhibits/ex-pdf-f195.jpg',
  './exhibits/ex-pdf-f196.jpg',
  './exhibits/ex-pdf-f200.jpg',
  './exhibits/ex-pdf-f201.jpg',
  './exhibits/ex-pdf-f202.jpg',
  './exhibits/ex-pdf-f204.jpg',
  './exhibits/ex-pdf-f206.jpg',
  './exhibits/ex-pdf-f207.jpg',
  './exhibits/ex-pdf-f208.jpg',
  './exhibits/ex-pdf-f210.jpg',
  './exhibits/ex-pdf-f212.jpg',
  './exhibits/ex-pdf-f214.jpg',
  './exhibits/ex-pdf-f216.jpg',
  './exhibits/ex-pdf-f218.jpg',
  './exhibits/ex-pdf-f219.jpg',
  './exhibits/ex-pdf-f222.jpg',
  './exhibits/ex-pdf-f226.jpg',
  './exhibits/ex-pdf-f230.jpg',
  './exhibits/ex-pdf-f239.jpg',
  './exhibits/ex-pdf-f241.jpg',
  './exhibits/ex-pdf-f244.jpg',
  './exhibits/ex-pdf-f245.jpg',
  './exhibits/ex-pdf-f249.jpg',
  './exhibits/ex-pdf-f25.jpg',
  './exhibits/ex-pdf-f250.jpg',
  './exhibits/ex-pdf-f251.jpg',
  './exhibits/ex-pdf-f252.jpg',
  './exhibits/ex-pdf-f253.jpg',
  './exhibits/ex-pdf-f254.jpg',
  './exhibits/ex-pdf-f258.jpg',
  './exhibits/ex-pdf-f264.jpg',
  './exhibits/ex-pdf-f265.jpg',
  './exhibits/ex-pdf-f266.jpg',
  './exhibits/ex-pdf-f269.jpg',
  './exhibits/ex-pdf-f273.jpg',
  './exhibits/ex-pdf-f276.jpg',
  './exhibits/ex-pdf-f280.jpg',
  './exhibits/ex-pdf-f285.jpg',
  './exhibits/ex-pdf-f287.jpg',
  './exhibits/ex-pdf-f289.jpg',
  './exhibits/ex-pdf-f29.jpg',
  './exhibits/ex-pdf-f290.jpg',
  './exhibits/ex-pdf-f292.jpg',
  './exhibits/ex-pdf-f293.jpg',
  './exhibits/ex-pdf-f294.jpg',
  './exhibits/ex-pdf-f3.jpg',
  './exhibits/ex-pdf-f30.jpg',
  './exhibits/ex-pdf-f300.jpg',
  './exhibits/ex-pdf-f303.jpg',
  './exhibits/ex-pdf-f304.jpg',
  './exhibits/ex-pdf-f305.jpg',
  './exhibits/ex-pdf-f308.jpg',
  './exhibits/ex-pdf-f31.jpg',
  './exhibits/ex-pdf-f310.jpg',
  './exhibits/ex-pdf-f316.jpg',
  './exhibits/ex-pdf-f32.jpg',
  './exhibits/ex-pdf-f322.jpg',
  './exhibits/ex-pdf-f324.jpg',
  './exhibits/ex-pdf-f325.jpg',
  './exhibits/ex-pdf-f326.jpg',
  './exhibits/ex-pdf-f327.jpg',
  './exhibits/ex-pdf-f329.jpg',
  './exhibits/ex-pdf-f331.jpg',
  './exhibits/ex-pdf-f332.jpg',
  './exhibits/ex-pdf-f340.jpg',
  './exhibits/ex-pdf-f343.jpg',
  './exhibits/ex-pdf-f344.jpg',
  './exhibits/ex-pdf-f348.jpg',
  './exhibits/ex-pdf-f352.jpg',
  './exhibits/ex-pdf-f359.jpg',
  './exhibits/ex-pdf-f36.jpg',
  './exhibits/ex-pdf-f360.jpg',
  './exhibits/ex-pdf-f361.jpg',
  './exhibits/ex-pdf-f362.jpg',
  './exhibits/ex-pdf-f363.jpg',
  './exhibits/ex-pdf-f365.jpg',
  './exhibits/ex-pdf-f366.jpg',
  './exhibits/ex-pdf-f368.jpg',
  './exhibits/ex-pdf-f370.jpg',
  './exhibits/ex-pdf-f372.jpg',
  './exhibits/ex-pdf-f373.jpg',
  './exhibits/ex-pdf-f374.jpg',
  './exhibits/ex-pdf-f375.jpg',
  './exhibits/ex-pdf-f376.jpg',
  './exhibits/ex-pdf-f388.jpg',
  './exhibits/ex-pdf-f393.jpg',
  './exhibits/ex-pdf-f394.jpg',
  './exhibits/ex-pdf-f395.jpg',
  './exhibits/ex-pdf-f397.jpg',
  './exhibits/ex-pdf-f398.jpg',
  './exhibits/ex-pdf-f4.jpg',
  './exhibits/ex-pdf-f400.jpg',
  './exhibits/ex-pdf-f402.jpg',
  './exhibits/ex-pdf-f403.jpg',
  './exhibits/ex-pdf-f404.jpg',
  './exhibits/ex-pdf-f405.jpg',
  './exhibits/ex-pdf-f406.jpg',
  './exhibits/ex-pdf-f409.jpg',
  './exhibits/ex-pdf-f410.jpg',
  './exhibits/ex-pdf-f412.jpg',
  './exhibits/ex-pdf-f416.jpg',
  './exhibits/ex-pdf-f421.jpg',
  './exhibits/ex-pdf-f426.jpg',
  './exhibits/ex-pdf-f43.jpg',
  './exhibits/ex-pdf-f433.jpg',
  './exhibits/ex-pdf-f45.jpg',
  './exhibits/ex-pdf-f46.jpg',
  './exhibits/ex-pdf-f47.jpg',
  './exhibits/ex-pdf-f52.jpg',
  './exhibits/ex-pdf-f53.jpg',
  './exhibits/ex-pdf-f54.jpg',
  './exhibits/ex-pdf-f55.jpg',
  './exhibits/ex-pdf-f56.jpg',
  './exhibits/ex-pdf-f57.jpg',
  './exhibits/ex-pdf-f58.jpg',
  './exhibits/ex-pdf-f6.jpg',
  './exhibits/ex-pdf-f63.jpg',
  './exhibits/ex-pdf-f65.jpg',
  './exhibits/ex-pdf-f66.jpg',
  './exhibits/ex-pdf-f7.jpg',
  './exhibits/ex-pdf-f74.jpg',
  './exhibits/ex-pdf-f79.jpg',
  './exhibits/ex-pdf-f8.jpg',
  './exhibits/ex-pdf-f81.jpg',
  './exhibits/ex-pdf-f87.jpg',
  './exhibits/ex-pdf-f9.jpg',
  './exhibits/ex-pdf-f90.jpg',
  './exhibits/ex-pdf-f93.jpg',
  './exhibits/ex-pdf-f95.jpg',
  './exhibits/ex-pdf-f96.jpg',
  './exhibits/ex-pdf-f99.jpg',
  './exhibits/ex-pdf-h122.jpg',
  './exhibits/ex-pdf-h136.jpg',
  './exhibits/ex-pdf-h161.jpg',
  './exhibits/ex-pdf-h168.jpg',
  './exhibits/ex-pdf-h173.jpg',
  './exhibits/ex-pdf-h181.jpg',
  './exhibits/ex-pdf-h186.jpg',
  './exhibits/ex-pdf-h22.jpg',
  './exhibits/ex-pdf-h46.jpg',
  './exhibits/ex-pdf-h47.jpg',
  './exhibits/ex-pdf-h48.jpg',
  './exhibits/ex-pdf-h63.jpg',
  './exhibits/sim-1a-topo.jpg',
  './exhibits/sim-1b-topo.jpg',
  './exhibits/sim-1-topo.jpg',
  './exhibits/sim-2a-topo.jpg',
  './exhibits/sim-2-topo.jpg',
  './exhibits/sim-3a-topo.jpg',
  './exhibits/sim-3b-topo.jpg',
  './exhibits/sim-3-topo.jpg',
  './exhibits/sim-4a-topo.jpg',
  './exhibits/sim-4b-topo.jpg',
  './exhibits/sim-4-topo.jpg',
  './exhibits/sim-5a-topo.jpg',
  './exhibits/sim-5-topo.jpg'
];

async function preCacheExhibits() {
  const cache = await caches.open(CACHE_NAME);
  const chunkSize = 16;
  for (let i = 0; i < EXHIBIT_ASSETS.length; i += chunkSize) {
    const chunk = EXHIBIT_ASSETS.slice(i, i + chunkSize);
    await Promise.allSettled(
      chunk.map(async (url) => {
        const hit = await cache.match(url);
        if (hit) return;
        const res = await fetch(url);
        if (res && res.ok) {
          const ct = (res.headers.get('content-type') || '').toLowerCase();
          if (!ct.startsWith('text/html')) await cache.put(url, res);
        }
      })
    );
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(CORE_ASSETS.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => preCacheExhibits())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first with index.html offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put('./index.html', clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Images (exhibits & icons): cache-first, never fall back to HTML!
  if (url.pathname.includes('/exhibits/') || url.pathname.includes('/icons/') || /\.(jpg|jpeg|png|svg|webp|gif)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          const ct = (cached.headers.get('content-type') || '').toLowerCase();
          if (!ct.startsWith('text/html')) return cached;
        }
        return fetch(event.request).then((res) => {
          if (res && res.ok) {
            const ct = (res.headers.get('content-type') || '').toLowerCase();
            if (!ct.startsWith('text/html')) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
            }
          }
          return res;
        });
      })
    );
    return;
  }

  // App shell JS/CSS/Manifest: network-first so updates land immediately on desktop & Samsung PWA
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
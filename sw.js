const CACHE_NAME = 'high-low-game-cache-v1';
const urlsToCache = [
  './',
  './index.html', // index.html があれば
  './style.css',  // CSSファイルがあれば
  './script.js',  // JSファイルがあれば
  './icons/icon-192x192.png', // アイコンファイルがあれば
  './icons/icon-512x512.png'  // アイコンファイルがあれば
  // その他の必要なアセット（画像など）を追加
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにリソースがあればそれを使用
        if (response) {
          return response;
        }
        // キャッシュになければネットワークから取得
        return fetch(event.request);
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
            // 現在のキャッシュ以外の古いキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

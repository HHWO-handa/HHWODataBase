const CACHE_NAME = 'qr-app-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://unpkg.com/html5-qrcode'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// フェッチ処理
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // GASのAPIリクエストはネットワーク優先
    if (url.includes('script.google.com')) {
        event.respondWith(fetch(event.request).catch(() => new Response('')));
        return;
    }

    // それ以外はキャッシュ優先
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

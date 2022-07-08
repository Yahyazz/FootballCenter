importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    console.log("Workbox success loaded.");

    workbox.precaching.precacheAndRoute([
        { url: '/', revision: '1' },
        { url: '/index.html', revision: '1' },
        { url: '/teams.html', revision: '1' },
        { url: '/nav.html', revision: '1' },
        { url: '/manifest.json', revision: '1' },
        { url: '/sw-main.js', revision: '1' },
        { url: '/js/detail.js', revision: '1' },
        { url: '/service-worker.js', revision: '1' },
        { url: '/css/style.css', revision: '1' },
        { url: '/css/materialize.min.css', revision: '1' },
        { url: '/js/materialize.min.js', revision: '1' },
        { url: '/js/nav.js', revision: '1' },
        { url: '/js/api.js', revision: '1' },
        { url: '/js/idb.js', revision: '1' },
        { url: '/js/db.js', revision: '1' },
    ], {
        ignoreURLParametersMatching: [/.*/]
    });

    workbox.routing.registerRoute(
        /.*(?:png|gif|jpg|jpeg|svg|webp)$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'image-cache',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ]
        })
    );

    workbox.routing.registerRoute(
        new RegExp('/'),
        new workbox.strategies.StaleWhileRevalidate(),
    );

    workbox.routing.registerRoute(
        new RegExp('/pages/'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'pages',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('/image/'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'image',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 10,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/v2/'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'data-api',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 60 * 30,
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        new workbox.strategies.CacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 10,
                }),
            ],
        })
    );
} else {
    console.log("Workbox failed to load.");
}

self.addEventListener("push", function(e) {
    var body;
    if (e.data) {
        body = e.data.text();
    } else {
        body = 'Push messagge no payload';
    }

    var options = {
        body: body,
        icon: '/image/logo-96.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    e.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});
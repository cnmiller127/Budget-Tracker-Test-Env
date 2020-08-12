const FILES_TO_CACHE = [
    '/',
    '/styles.css',
    '/index.html',
    '/index.js',
    '/dist/manifest.json',
    '/dist/bundle.js',
    '/dist/icon_72x72.png',
    '/dist/icon_96x96.png',
    '/dist/icon_128x128.png',
    '/dist/icon_144x144.png',
    '/dist/icon_152x152.png',
    '/dist/icon_192x192.png',
    '/dist/icon_384x384.png',
    '/dist/icon_512x512.png'
  ];

  /////DSSSSSSSSSSSSSSSSSSSSS
  const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// activate
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim()
  // .then(() => {
  //           const request = self.indexedDB.open("transactions", 1);
  
  
  //           request.onupgradeneeded = ({ target }) => {
  //               const db = target.result;
  //               const objectStore = db.createObjectStore("transactions", {keyPath: "id", autoIncrement: true});
  //               objectStore.createIndex("name", "name");
  //               objectStore.createIndex("value", "value");
  //               objectStore.createIndex("date", "date");
  //             };
            
  //             request.onsuccess = event => {
  //               console.log(request.result);
  //               const db = request.result;
  //               const transaction = db.transaction(["transactions"], "readwrite");
  //               const transactionsStore = transaction.objectStore("transactions");
  //               const nameIndex = transactionsStore.index("name");
  //               const valueIndex = transactionsStore.index("value");
  //               const dateIndex = transactionsStore.index("date");
                    
  //             }
  //         })
});

// fetch
self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});

  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
  //   for(let registration of registrations) {
  //    registration.unregister()
  //  } })
  
  // const STATIC_CACHE = "static-cache-v1";
  // const RUNTIME_CACHE = "runtime-cache";
  // // Install static cache
  // self.addEventListener("install", event => {
  //   event.waitUntil(
  //     caches
  //       .open(STATIC_CACHE)
  //       .then(cache => cache.addAll(FILES_TO_CACHE))
  //       .then(() => self.skipWaiting())
  //   );
  // });
  
  // // The activate handler takes care of cleaning up old caches.
  // self.addEventListener("activate", event => {

  //   const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
  //   event.waitUntil(
  //     caches
  //       .keys()
  //       .then(cacheNames => {
  //         // return array of cache names that are old to delete
  //         return cacheNames.filter(
  //           cacheName => !currentCaches.includes(cacheName)
  //         );
  //       })
  //       .then(cachesToDelete => {
  //         return Promise.all(
  //           cachesToDelete.map(cacheToDelete => {
  //             return caches.delete(cacheToDelete);
  //           })
  //         );
  //       })
  //       .then(() => self.clients.claim()).then(() => {
  //         const request = self.indexedDB.open("offline-transactions", 1);


  //         request.onupgradeneeded = ({ target }) => {
  //             const db = target.result;
  //             const objectStore = db.createObjectStore("transactions", {keyPath: "id", autoIncrement: true});
  //             objectStore.createIndex("name", "name");
  //             objectStore.createIndex("value", "value");
  //             objectStore.createIndex("date", "date");
  //           };
          
  //           request.onsuccess = event => {
  //             console.log(request.result);
  //             const db = request.result;
  //             const transaction = db.transaction(["transactions"], "readwrite");
  //             const transactionsStore = transaction.objectStore("transactions");
  //             const nameIndex = transactionsStore.index("name");
  //             const valueIndex = transactionsStore.index("value");
  //             const dateIndex = transactionsStore.index("date");
             
              
              
  //           }
  //       })
  //   );
  // });
  
  // self.addEventListener("fetch", event => {
  //   // non GET requests are not cached and requests to other origins are not cached
  //   if (
  //     event.request.method !== "GET" ||
  //     !event.request.url.startsWith(self.location.origin)
  //   ) {
  //     event.respondWith(fetch(event.request));
  //     return;
  //   }
  
  //   // handle runtime GET requests for data from /api routes
  //   if (event.request.url.includes("/api/transaction")) {
  //     // make network request and fallback to cache if network request fails (offline)
  //     event.respondWith(
  //       caches.open(RUNTIME_CACHE).then(cache => {
  //         return fetch(event.request)
  //           .then(response => {
  //             cache.put(event.request, response.clone());
  //             return response;
  //           })
  //           .catch(() => caches.match(event.request));
  //       })
  //     );
  //     return;
  //   }
  
  //   // use cache first for all other requests for performance
  //   event.respondWith(
  //     caches.match(event.request).then(cachedResponse => {
  //       if (cachedResponse) {
  //         return cachedResponse;
  //       }
  
  //       // request is not in cache. make network request and cache the response
  //       return caches.open(RUNTIME_CACHE).then(cache => {
  //         return fetch(event.request).then(response => {
  //           return cache.put(event.request, response.clone()).then(() => {
  //             return response;
  //           });
  //         });
  //       });
  //     })
  //   );
  // });
  
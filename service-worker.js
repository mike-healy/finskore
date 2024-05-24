// Service Worker

/*
This should cache all the assets in v1 cache
But if anything changes you're not going to know. The cache will keep serving the stale ones.

SSL! – ah shit, this will probably fail because of SSL. Damn.
*/

const putInCache = async(request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

// Retrieve from cache if available
const cacheFirst = async({ request, fallbackUrl }) => {
  const fromCache = await caches.match(request);

  if (fromCache) {
    return fromCache;
  }

  try {
    const fromNetwork = await fetch(request);

    // Clone, because a response can only be consumed once
    putInCache(request, fromNetwork.clone());

    return fromNetwork;
  } catch (error) {
    const fallback = await caches.match(fallbackUrl);
    
    return (fallback)
      ? fallback
      : new Response('Network error', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
  }
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: '/offline.html',
    })
  );
});

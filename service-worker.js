const putInCache = async(request, response) => {

  // Try excluding this file from cache
  if (request.url.endsWith('service-worker.js')) {
    console.log('not caching service-worker.js file');
    return;
  }

  const cache = await caches.open('v105`'); // update on deploy. Will that be enough, or is this script itself cached?
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
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: '/offline.html',
    })
  );
});

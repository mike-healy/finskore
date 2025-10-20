const ENABLE_SW = false; // I think caching gets stuck. Disable until I figure it out.

if (ENABLE_SW && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(
    (registration) => {
      console.log('SW registered');
    },
    (error) => {
      console.error('Service worker rego failed');
    }
  );
}

const ENABLE_SW = true;

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

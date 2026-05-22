export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service worker registered:', reg);
          
          // Check for updates every 30 minutes
          setInterval(() => {
            reg.update();
          }, 30 * 60 * 1000);
        })
        .catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
    });
  }
}

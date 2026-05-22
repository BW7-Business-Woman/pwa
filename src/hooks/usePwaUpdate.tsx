import { useState, useEffect, useCallback } from 'react';

export function usePwaUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorkerContainer | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const registration = navigator.serviceWorker.ready;

    registration.then((reg) => {
      // Check for waiting service worker (already downloaded)
      if (reg.waiting) {
        setUpdateAvailable(true);
        setWaitingServiceWorker(reg.waiting);
      }

      // Listen for new service worker updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is ready and controller exists (update available)
            setUpdateAvailable(true);
            setWaitingServiceWorker(newWorker);
          }
        });
      });
    });

    // Check for updates periodically (every 30 minutes)
    const updateCheckInterval = setInterval(() => {
      registration.then((reg) => reg.update());
    }, 30 * 60 * 1000);

    return () => clearInterval(updateCheckInterval);
  }, []);

  const updateApp = useCallback(() => {
    if (!waitingServiceWorker) return;

    // Send message to waiting service worker to skip waiting
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });

    // Reload page once activated
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, [waitingServiceWorker]);

  return {
    updateAvailable,
    updateApp,
  };
}

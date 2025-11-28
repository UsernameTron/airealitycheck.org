/**
 * Service Worker - Self-unregistering
 * This service worker clears all caches and unregisters itself
 */

// Clear all caches and unregister
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', async() => {
  // Clear all caches
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cache => caches.delete(cache)));

  // Unregister this service worker
  const registration = await self.registration;
  await registration.unregister();

  // Take control and reload clients
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => client.navigate(client.url));
});

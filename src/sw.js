self.addEventListener('install', installEvent => {
  return;
});

self.addEventListener('activate', activateEvent => {
  return self.clients.claim();
});

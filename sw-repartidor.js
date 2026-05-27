// Service Worker — Repartidor GasExpress
// Keepalive GPS en background
const CACHE='gasexpress-rep-v1';

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{
  e.waitUntil(self.clients.claim());
});

// Keepalive GPS: responde a mensajes del cliente
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='GPS_KEEPALIVE'){
    // Mantener el SW activo mientras el GPS está encendido
    e.waitUntil(new Promise(resolve=>setTimeout(resolve,20000)));
  }
});

// Cache básico para assets estáticos
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=e.request.url;
  if(url.includes('firebaseio.com')||url.includes('googleapis.com/firebasejs')) return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      return cached||fetch(e.request).then(res=>{
        if(res&&res.status===200&&!url.includes('fonts.')){
          caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
        }
        return res;
      }).catch(()=>cached);
    })
  );
});

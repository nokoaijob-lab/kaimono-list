var C="kaimono-v2";
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim());});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(caches.open(C).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(r){
      var f=fetch(e.request).then(function(n){if(n&&n.ok)c.put(e.request,n.clone());return n;}).catch(function(){return r;});
      return r||f;
    });
  }));
});

// アプリ本体だけをキャッシュ。曲データは端末内(IndexedDB)にあるので通信しない。
var C = "drive-music-v1";
var SHELL = ["./", "index.html", "manifest.json", "icon.svg"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("drive-music-") === 0 && k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// キャッシュ優先: オフラインでも、通信できても、まず端末内のものを使う
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (r) {
      if (r) {
        fetch(e.request).then(function (n) { if (n && n.ok) c.put(e.request, n.clone()); }).catch(function () {});
        return r;
      }
      return fetch(e.request).then(function (n) { if (n && n.ok) c.put(e.request, n.clone()); return n; });
    });
  }));
});

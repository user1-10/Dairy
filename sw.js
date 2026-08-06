/* 日记 App · 离线 Service Worker（GitHub Pages 版）
 *
 * 策略：
 *  - 安装时预缓存全部静态资源（index.html / sw.js / manifest / 图标）
 *  - 运行时：
 *      · 导航请求（打开 App）：网络优先，成功则更新缓存，失败回退缓存首页
 *        → 即便 GitHub 不可达（如大陆网络环境），也能离线打开 App
 *      · 其它静态资源：缓存优先，命中即返回，后台静默更新
 *
 * 效果：首次联网加载后自动缓存；之后断网 / GitHub 被墙，仍可完全离线使用。
 */
const CACHE = 'diary-v1';
const ASSETS = [
  './',
  './index.html',
  './sw.js',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil((function () {
    return caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        // 单个资源失败不影响整体安装（容错，保证 SW 一定能激活）
        return c.add(u).catch(function (err) { console.warn('[sw] 跳过缓存:', u, err); });
      }));
    }).then(function () { return self.skipWaiting(); });
  })());
});

self.addEventListener('activate', function (e) {
  e.waitUntil((function () {
    return caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); });
  })());
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 只处理同源资源

  // 导航请求：网络优先 + 离线回退
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (r) {
        if (r && r.status === 200) {
          caches.open(CACHE).then(function (c) { c.put('./index.html', r.clone()); });
        }
        return r;
      }).catch(function () {
        return caches.match('./index.html').then(function (cached) {
          return cached || caches.match('./');
        });
      })
    );
    return;
  }

  // 其它静态资源：缓存优先，命中即返回，后台更新
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (r) {
        if (r && r.status === 200) {
          caches.open(CACHE).then(function (c) { c.put(req, r.clone()); });
        }
        return r;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});

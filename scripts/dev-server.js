/* NEXUS 静态预览服务（零依赖）：静态文件 + SSE 热更新 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8770);
const HOST = process.env.HOST || '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const clients = new Set();
let timer = null;

function broadcast() {
  for (const res of clients) {
    try { res.write('data: reload\n\n'); } catch (e) { clients.delete(res); }
  }
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, 'http://' + HOST + ':' + PORT);

  if (parsed.pathname === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.write('retry: 1000\n\n');
    res.write('data: connected\n\n');
    clients.add(res);
    const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch (e) {} }, 15000);
    req.on('close', () => { clearInterval(ping); clients.delete(res); });
    return;
  }

  let rel = decodeURIComponent(parsed.pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const full = path.join(ROOT, rel);

  if (!full.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }

  fs.stat(full, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 ' + rel);
      return;
    }
    const ext = path.extname(full).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': st.size
    });
    fs.createReadStream(full).pipe(res);
  });
});

fs.watch(ROOT, { recursive: true }, (evt, file) => {
  if (!file) return;
  if (!/\.(html|css|js|json)$/i.test(file)) return;
  clearTimeout(timer);
  timer = setTimeout(broadcast, 120);
});

server.listen(PORT, HOST, () => {
  console.log('NEXUS dev server http://' + HOST + ':' + PORT + '/');
  console.log('root: ' + ROOT);
  console.log('hot reload: ON (SSE /__reload)');
});

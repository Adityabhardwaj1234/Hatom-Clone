#!/usr/bin/env node
// Logging static server: prints every request and 404; accepts POST /log for client beacons.
// Usage: node logserver.js <OUT_DIR> [PORT]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || './clone');
const PORT = parseInt(process.argv[3] || '8766', 10);
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff':'font/woff',
  '.woff2':'font/woff2','.glb':'model/gltf-binary','.mp4':'video/mp4','.mp3':'audio/mpeg','.wasm':'application/wasm',
  '.ico':'image/x-icon','.txt':'text/plain','.xml':'application/xml','.map':'application/json' };

http.createServer((req, res) => {
  console.log('REQ', req.method, req.url);
  if (req.method === 'POST' && req.url === '/log') {
    let b = ''; req.on('data', (c) => b += c); req.on('end', () => { console.log('CLIENT_LOG:', b); res.writeHead(204); res.end(); });
    return;
  }
  let p = path.join(ROOT, req.url.split('?')[0]);
  try { if (fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); } catch (e) {}
  fs.readFile(p, (err, data) => {
    if (err) { console.log('404', p); res.writeHead(404); res.end('not found'); return; }
    const ext = path.extname(p);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  });
}).listen(PORT, () => console.log('server on', PORT, 'root', ROOT));

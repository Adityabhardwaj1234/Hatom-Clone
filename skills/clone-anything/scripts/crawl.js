#!/usr/bin/env node
// Recursive same-origin asset crawler.
// Usage: node crawl.js <BASE_URL> <OUT_DIR>
// Example: node crawl.js https://www.hatom.com ./clone
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE = (process.argv[2] || 'https://example.com').replace(/\/$/, '');
const OUT  = path.resolve(process.argv[3] || './clone');

function mkdirp(p){ fs.mkdirSync(p, {recursive:true}); }
function urlToPath(u){
  let rel = u.pathname.replace(/^\/+/, '');
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  else if (!path.extname(rel)) rel = rel.replace(/\/?$/, '/') + 'index.html';
  return path.join(OUT, rel);
}
function exists(p){ try { return fs.statSync(p).isFile(); } catch (e) { return false; } }
function fetchBuf(url){
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CloneBot/1.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        return resolve(fetchBuf(next));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode + ' ' + url)); }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ buf: Buffer.concat(chunks), type: res.headers['content-type'] || '' }));
    }).on('error', reject);
  });
}
const visited = new Set();
const queue = [];
function enqueue(url){
  let full; try { full = new URL(url, BASE).href; } catch (e) { return; }
  if (!full.startsWith(BASE)) return;
  if (visited.has(full)) return;
  visited.add(full);
  if (exists(urlToPath(new URL(full)))) return;
  queue.push(full);
}
function extractRefs(text, baseUrl){
  const refs = new Set();
  const strRe = /["'`]([^"'`\n]{1,500})["'`]/g; let m;
  while ((m = strRe.exec(text)) !== null) {
    const v = m[1];
    if (v.includes('${') || v.includes(' ') || v.includes(',') || v.includes('(') || v.includes(')') || v.includes('{') || v.includes('}')) continue;
    if (v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://')) refs.add(v);
  }
  const urlRe = /url\(\s*["']?([^"')\s]{1,500})["']?\s*\)/g;
  while ((m = urlRe.exec(text)) !== null) { const v = m[1]; if (!v.includes('${')) refs.add(v); }
  const impRe = /import\(\s*["']([^"']+)["']\s*\)/g;
  while ((m = impRe.exec(text)) !== null) refs.add(m[1]);
  const fromRe = /from\s+["']([^"']+)["']/g;
  while ((m = fromRe.exec(text)) !== null) refs.add(m[1]);
  for (const r of refs) {
    try {
      const u = new URL(r, baseUrl);
      if (u.origin === new URL(BASE).origin) enqueue(u.pathname + u.search);
    } catch (e) {}
  }
}
enqueue('/');
const textExts = /\.(js|css|json|svg|html|txt|map|xml)$/i;
function walk(dir){
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (textExts.test(e.name)) { try { extractRefs(fs.readFileSync(p, 'utf8'), BASE); } catch (err) {} }
  }
}
if (fs.existsSync(OUT)) walk(OUT);

(async () => {
  let count = 0, fails = 0;
  while (queue.length) {
    const url = queue.shift();
    let res;
    try { res = await fetchBuf(url); }
    catch (e) { fails++; if (fails < 200) console.log('FAIL', url, e.message); continue; }
    const outPath = urlToPath(new URL(url));
    mkdirp(path.dirname(outPath));
    if (!exists(outPath)) { fs.writeFileSync(outPath, res.buf); count++; }
    if (count % 25 === 0) console.log('downloaded', count, 'remaining', queue.length);
    const isText = /text|javascript|json|css|xml|svg/.test(res.type || '') || textExts.test(url);
    if (isText) extractRefs(res.buf.toString('utf8'), url);
  }
  console.log('TOTAL downloaded', count, 'fails', fails, 'visited', visited.size);
})();

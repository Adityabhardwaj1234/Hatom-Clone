#!/usr/bin/env node
// Download all prerendered routes + their _payload.json from a Nuxt build manifest.
// Usage: node downloadroutes.js <BASE_URL> <MANIFEST_PATH_OR_URL> <OUT_DIR>
// If manifest is a URL, it will be fetched. Routes come from manifest.prerendered.
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = (process.argv[2] || 'https://example.com').replace(/\/$/, '');
const MANIFEST = process.argv[3];
const OUT = path.resolve(process.argv[4] || './clone');

function fetchBuf(url){ return new Promise((res,rej)=>{
  const mod = url.startsWith('https')?https:http;
  mod.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{
    if(r.statusCode>=300&&r.statusCode<400&&r.headers.location){const n=new URL(r.headers.location,url).href;r.resume();return res(fetchBuf(n));}
    if(r.statusCode!==200){r.resume();return rej(new Error('HTTP '+r.statusCode+' '+url));}
    const c=[];r.on('data',d=>c.push(d));r.on('end',()=>res({code:r.statusCode,buf:Buffer.concat(c)}));
  }).on('error',e=>res({code:0,buf:Buffer.alloc(0),err:e.message}));
});}

(async () => {
  let manifest;
  if (/^https?:\/\//.test(MANIFEST)) {
    const r = await fetchBuf(MANIFEST);
    manifest = JSON.parse(r.buf.toString('utf8'));
  } else {
    manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  }
  const routes = manifest.prerendered || manifest.routes || [];
  console.log('routes:', routes.length);
  for (const route of routes) {
    const dir = route === '/' ? OUT : path.join(OUT, route);
    fs.mkdirSync(dir, { recursive: true });
    if (route !== '/') {
      const htmlUrl = BASE + (route.endsWith('/') ? route : route + '/');
      const r = await fetchBuf(htmlUrl);
      if (r.code === 200) { fs.writeFileSync(path.join(dir, 'index.html'), r.buf); console.log('HTML ok', route, r.buf.length); }
      else console.log('HTML fail', route, r.code);
    }
    const payloadUrl = BASE + (route.endsWith('/') ? route : route + '/') + '_payload.json';
    const pr = await fetchBuf(payloadUrl);
    if (pr.code === 200) { fs.writeFileSync(path.join(dir, '_payload.json'), pr.buf); console.log('PAYLOAD ok', route, pr.buf.length); }
    else console.log('PAYLOAD fail', route, pr.code);
  }
  console.log('ALL DONE');
})();

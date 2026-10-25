#!/usr/bin/env node
// Re-scan existing clone for any missing refs and fetch them. Safe against directories.
// Usage: node incremental.js <BASE_URL> <OUT_DIR>
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE = (process.argv[2] || 'https://example.com').replace(/\/$/, '');
const OUT  = path.resolve(process.argv[3] || './clone');

function mkdirp(p){ fs.mkdirSync(p, {recursive:true}); }
function urlToPath(u){
  let rel = u.pathname.replace(/^\/+/, '');
  if (rel === '') rel = 'index.html';
  else if (!path.extname(rel)) rel = rel.replace(/\/?$/, '/') + 'index.html';
  return path.join(OUT, rel);
}
function exists(p){ try { return fs.statSync(p).isFile(); } catch (e) { return false; } }
function fetchBuf(url){ return new Promise((res,rej)=>{
  const mod = url.startsWith('https')?https:http;
  mod.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{
    if(r.statusCode>=300&&r.statusCode<400&&r.headers.location){const n=new URL(r.headers.location,url).href;r.resume();return res(fetchBuf(n));}
    if(r.statusCode!==200){r.resume();return rej(new Error('HTTP '+r.statusCode+' '+url));}
    const c=[];r.on('data',d=>c.push(d));r.on('end',()=>res({buf:Buffer.concat(c),type:r.headers['content-type']||''}));
  }).on('error',rej);
});}
const visited=new Set(), queue=[];
function enqueue(url){ let full; try{full=new URL(url,BASE).href;}catch(e){return;}
  if(!full.startsWith(BASE)) return; if(visited.has(full)) return; visited.add(full);
  const op=urlToPath(new URL(full)); if(exists(op)) return; queue.push(full);
}
function extractRefs(text,baseUrl){
  const refs=new Set();
  const strRe=/["'`]([^"'`\n]{1,500})["'`]/g; let m;
  while((m=strRe.exec(text))!==null){const v=m[1];
    if(v.includes('${')||v.includes(' ')||v.includes(',')||v.includes('(')||v.includes(')')||v.includes('{')||v.includes('}')) continue;
    if(v.startsWith('/')||v.startsWith('http://')||v.startsWith('https://')) refs.add(v);
  }
  const urlRe=/url\(\s*["']?([^"')\s]{1,500})["']?\s*\)/g;
  while((m=urlRe.exec(text))!==null){const v=m[1]; if(!v.includes('${')) refs.add(v);}
  const impRe=/import\(\s*["']([^"']+)["']\s*\)/g;
  while((m=impRe.exec(text))!==null) refs.add(m[1]);
  for(const r of refs){ try{const u=new URL(r,baseUrl); if(u.origin===new URL(BASE).origin) enqueue(u.pathname+u.search);}catch(e){} }
}
const textExts=/\.(js|css|json|svg|html|txt|map|xml)$/i;
function walk(dir){ if(!fs.existsSync(dir)) return;
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else if(textExts.test(e.name)){ try{extractRefs(fs.readFileSync(p,'utf8'),BASE);}catch(err){} }
  }
}
walk(OUT);
const routes = process.argv.slice(4);
for(const r of routes) enqueue(r);

(async()=>{ let count=0,fails=0;
  while(queue.length){ const url=queue.shift(); let res;
    try{res=await fetchBuf(url);}catch(e){fails++; if(fails<200) console.log('FAIL',url,e.message); continue;}
    const outPath=urlToPath(new URL(url));
    if(fs.existsSync(outPath)&&fs.statSync(outPath).isDirectory()){ console.log('skip dir',outPath); continue; }
    mkdirp(path.dirname(outPath));
    if(!exists(outPath)){ fs.writeFileSync(outPath,res.buf); count++; }
    if(count%25===0) console.log('downloaded',count,'remaining',queue.length);
    const isText=/text|javascript|json|css|xml|svg/.test(res.type||'')||textExts.test(url);
    if(isText) extractRefs(res.buf.toString('utf8'),url);
  }
  console.log('TOTAL downloaded',count,'fails',fails);
})();

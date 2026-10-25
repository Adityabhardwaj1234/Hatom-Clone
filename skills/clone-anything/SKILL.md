---
name: clone-anything
description: Fully clone any website, web app, Electron app, or shipped binary locally. Uses REA for reverse engineering when needed, recursive asset crawling, 404-driven verification, and optional source reconstruction. Ask the user whether to run the clone as-is or generate readable source code.
location: C:\Users\MY PC\OneDrive\Desktop\HatomCloneTestREA\.agents\skills\clone-anything\SKILL.md
---

# Clone Anything — Universal, REA-Augmented Cloning Skill

## Purpose

Produce a **complete, locally runnable copy** of a target (website, SPA, SSR app,
Electron app, native binary, or package) including **all scripts, styles, fonts,
images, media, 3D assets, workers, wasm, and data files**, and verify it with a
real browser until zero missing assets remain.

This skill combines:
- Recursive same-origin asset crawling (HTML → JS → CSS → JSON → binaries).
- REA (`rea-agents`) for reverse engineering shipped binaries/packages and
  JavaScript application graphs.
- 404-driven verification loop using an instrumented static server.
- Optional source reconstruction (decompilation/deobfuscation) — **only when
  explicitly requested**.

---

## Mandatory first question (ask before doing anything)

Before cloning, ask the user:

> **Do you want me to (A) run the clone as-is (static mirror, fastest, faithful
> runtime), or (B) generate readable source code (decompiled/reconstructed
> project, slower, may be incomplete)?**

- **(A) Run as-is**: mirror all assets and serve them. No source transformation.
- **(B) Generate source**: additionally decompile bundles, reconstruct a
  buildable project, and (where possible) restore original module structure.
  Only attempt (B) if REA or a suitable decompiler is available.

Record the choice and branch accordingly. Default to (A) if the user does not
answer.

---

## Decision tree: pick the right toolchain

| Target type | Primary tool | REA needed? |
|---|---|---|
| Live website / SSR app / SPA | Recursive crawler + static server | Optional (for JS graph) |
| Electron app (installed) | `analyze_javascript_application` on app.asar | Yes |
| Native binary / archive / APK / IPA / firmware | `open_binary` + focused tools | Yes |
| npm package / tarball | Extract + `analyze_javascript_application` | Yes |
| Managed (.NET) assembly | `inspect_managed_artifact` | Yes |

If the target is "my app" with no name/path, **ask which app** before searching.

---

## Phase 0 — Environment & REA readiness

1. Verify tools: `node`, `npm`, `python`, `git`.
2. Check if REA MCP tools are available. If not, use the CLI fallback:
   `npx -y rea-agents@6.7.0 <command>`.
3. If REA tools are absent/blocked, diagnose with
   `npx -y rea-agents@6.7.0 doctor --json` and repair per the REA connection
   guide. Do **not** install unrelated software (Node, Java, Ghidra, etc.).
4. Only run REA when the claim depends on a shipped binary/package or
   decompilation. For a complete source repo, use normal tools.

---

## Phase 1 — Reconnaissance

1. Fetch the homepage (and any locale roots) with `webfetch` or `curl`.
2. Identify:
   - Framework: Nuxt, Next.js, Vite, Webpack, Create React App, Angular, etc.
   - Asset base path: `/assets`, `/_next/static`, `/static`, `/public`.
   - SSR payload endpoint: `/_payload.json`, `/_next/data`, `__NEXT_DATA__`.
   - Build id / manifest: `/_payload.json?uuid`, `builds/meta/{id}.json`.
   - External CDNs: media, fonts, analytics, 3D decoders.
3. Save the raw HTML. Parse `<script src>`, `<link href>`, `<img src>`,
   `url(...)` in CSS, and inline `__NUXT__`/`__NEXT_DATA__`.

---

## Phase 2 — Recursive asset crawler

Create `crawl.js` (template below). It BFS-downloads every same-origin URL
discovered, extracts references from text assets, and skips already-downloaded
files.

**Reference extraction rules (critical — avoid false positives):**
- Only enqueue strings that start with `/` or `http(s)://`.
- Skip strings containing spaces, commas, `${`, `{`, `}`, `(`, `)`.
- Extract from: HTML attributes, CSS `url(...)`, JS quoted strings,
  `import(...)`, `from "..."`.
- Also handle locale-prefixed payloads: `/fr/_payload.json`, etc.
- Never enqueue API paths (they are not files) — but do not crash on 404s.

**Template: crawl.js**

```js
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE = process.argv[2] || 'https://target.example';
const OUT  = process.argv[3] || './clone';

function mkdirp(p){ fs.mkdirSync(p, {recursive:true}); }
function urlToPath(u){
  let rel = u.pathname.replace(/^\/+/,'');
  if(rel==='' || rel.endsWith('/')) rel += 'index.html';
  else if(!path.extname(rel)) rel = rel.replace(/\/?$/,'/')+'index.html';
  return path.join(OUT, rel);
}
function exists(p){ try{return fs.statSync(p).isFile();}catch(e){return false;} }
function fetchBuf(url){ return new Promise((res,rej)=>{
  const mod = url.startsWith('https')?https:http;
  mod.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},r=>{
    if(r.statusCode>=300 && r.statusCode<400 && r.headers.location){
      const next=new URL(r.headers.location,url).href; r.resume(); return res(fetchBuf(next));
    }
    if(r.statusCode!==200){ r.resume(); return rej(new Error('HTTP '+r.statusCode+' '+url)); }
    const c=[]; r.on('data',d=>c.push(d)); r.on('end',()=>res({buf:Buffer.concat(c),type:r.headers['content-type']||''}));
  }).on('error',rej);
});}
const visited=new Set(), queue=[];
function enqueue(url){ let full; try{full=new URL(url,BASE).href;}catch(e){return;}
  if(!full.startsWith(BASE)) return; if(visited.has(full)) return; visited.add(full);
  if(exists(urlToPath(new URL(full)))) return; queue.push(full);
}
function extractRefs(text,baseUrl){
  const refs=new Set();
  const strRe=/["'`]([^"'`\n]{1,400})["'`]/g; let m;
  while((m=strRe.exec(text))!==null){ const v=m[1];
    if(v.includes('${')||v.includes(' ')||v.includes(',')||v.includes('(')||v.includes(')')||v.includes('{')||v.includes('}')) continue;
    if(v.startsWith('/')||v.startsWith('http://')||v.startsWith('https://')) refs.add(v);
  }
  const urlRe=/url\(\s*["']?([^"')\s]{1,400})["']?\s*\)/g;
  while((m=urlRe.exec(text))!==null){ const v=m[1]; if(!v.includes('${')) refs.add(v); }
  const impRe=/import\(\s*["']([^"']+)["']\s*\)/g;
  while((m=impRe.exec(text))!==null) refs.add(m[1]);
  for(const r of refs){ try{ const u=new URL(r,baseUrl);
    if(u.origin===new URL(BASE).origin) enqueue(u.pathname+u.search); }catch(e){}
  }
}
enqueue('/');
const textExts=/\.(js|css|json|svg|html|txt|map)$/i;
function walk(dir){ for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory()) walk(p);
  else if(textExts.test(e.name)){ try{extractRefs(fs.readFileSync(p,'utf8'),BASE);}catch(err){} }
}}
// seed from existing files
if(fs.existsSync(OUT)) walk(OUT);
(async()=>{ let count=0,fails=0;
  while(queue.length){ const url=queue.shift(); let res;
    try{res=await fetchBuf(url);}catch(e){fails++; if(fails<100) console.log('FAIL',url,e.message); continue;}
    const outPath=urlToPath(new URL(url)); mkdirp(path.dirname(outPath));
    if(!exists(outPath)){ fs.writeFileSync(outPath,res.buf); count++; }
    if(count%25===0) console.log('downloaded',count,'remaining',queue.length);
    const isText=/text|javascript|json|css|xml|svg/.test(res.type||'')||textExts.test(url);
    if(isText) extractRefs(res.buf.toString('utf8'),url);
  }
  console.log('TOTAL downloaded',count,'fails',fails);
})();
```

Run with: `node crawl.js https://target.example ./clone`.

---

## Phase 3 — REA analysis (optional but recommended for apps)

For JavaScript apps:
```
npx -y rea-agents@6.7.0 analyze-javascript-application <clone> --json
```
- Use `--source-path` to focus on the main bundle if the full run hangs.
- Increase `--analysis-timeout-ms` (default 300000) and `--max-heap-mb` for large bundles.
- Output is UTF-16 LE JSON; read with `encoding='utf-16'`.

For binaries/archives: follow the REA routing table (open_binary, inspect_artifact,
inspect_android_package, inspect_managed_artifact, inspect_firmware_regions, etc.).

REA gives you:
- Module/function graph and feature traces.
- All string/route endpoints (useful to find hidden asset paths).
- Limitations and unknowns (respect them — do not over-claim).

---

## Phase 4 — Discover dynamic chunks & decoders

Modern bundlers lazy-load chunks. The crawler catches quoted paths, but some
chunks are loaded via:
- Webpack: `__webpack_require__.e("chunk-name")` → chunk filename in a manifest.
- Vite: dynamic `import("./Foo-XXXX.js")`.
- Three.js: DRACO/Basis decoders at configured paths.

**Always search the main bundle for:**
- `decoderPath`, `transcoderPath`, `workerPath`, `basis_transcoder`, `draco_decoder`.
- `assets/builds/meta/*.json` (Nuxt build manifest).
- Chunk name patterns: `/assets/[A-Za-z0-9]{8}.js`.

Download any missing decoders/workers manually.

---

## Phase 5 — Route & payload completeness (SSR frameworks)

For Nuxt/Next SSR apps:
1. Get the build manifest (`builds/meta/{id}.json`) → `prerendered` route list.
2. For each route, download `{route}/index.html` and `{route}/_payload.json`.
3. Locale roots often use the same UUID but different payload content.

**Template: downloadroutes.js** (adapt routes array from the manifest).

---

## Phase 6 — 404-driven verification loop (the "perfect clone" step)

This is what separates a partial mirror from a complete one.

1. Serve the clone with a **logging static server** (template below) that prints
   every 404.
2. Open the site in a real browser (desktop_browser_open or manual).
3. Wait 10–20 seconds for lazy chunks, WebGL, audio, and route payloads to load.
4. Read the server log. For every 404, download the missing file from origin.
5. Re-run. Repeat until a full load produces **zero 404s** for core assets.
6. Inject a beacon (optional) to confirm the page rendered (body length > 0).

**Template: logserver.js**

```js
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=process.argv[2]||'./clone';
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.glb':'model/gltf-binary','.mp4':'video/mp4','.mp3':'audio/mpeg'};
http.createServer((req,res)=>{
  console.log('REQ',req.method,req.url);
  if(req.method==='POST'&&req.url==='/log'){let b='';req.on('data',c=>b+=c);req.on('end',()=>{console.log('CLIENT_LOG:',b);res.writeHead(204);res.end();});return;}
  let p=path.join(ROOT,req.url.split('?')[0]);
  try{if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');}catch(e){}
  fs.readFile(p,(err,data)=>{
    if(err){console.log('404',p);res.writeHead(404);res.end('not found');return;}
    const ext=path.extname(p);
    res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','Access-Control-Allow-Origin':'*'});
    res.end(data);
  });
}).listen(process.argv[3]||8766,()=>console.log('server on',process.argv[3]||8766));
```

Run: `node logserver.js ./clone 8766`.

**Beacon injection (temporary, remove after):** add to `<head>`:
```html
<script>setTimeout(()=>fetch('/log',{method:'POST',body:JSON.stringify({type:'beacon',title:document.title,bodyLen:document.body?document.body.innerHTML.length:0})}),4000);</script>
```

---

## Phase 7 — Missing-asset static scan

Run `checkmissing.py` (template) to scan all text files for quoted paths and
verify each exists on disk. Ignores code false positives (strings without a
file extension or starting with `/assets/` but containing spaces/commas).

```python
import os,re
root='clone'; missing=set()
for dp,_,fs in os.walk(root):
  for f in fs:
    p=os.path.join(dp,f)
    if not f.endswith(('.js','.css','.html','.json')): continue
    try: s=open(p,encoding='utf-8',errors='ignore').read()
    except: continue
    for rgx in [r'"(/[^"]+)"', r"'(/[^']+)'"]:
      for m in re.finditer(rgx,s):
        ref=m.group(1).split('?')[0]
        if ref.endswith('/') or '.' not in os.path.basename(ref): continue
        target=os.path.join(root,ref.lstrip('/'))
        if not os.path.isfile(target): missing.add(ref)
print('missing:',len(missing))
for m in sorted(missing): print(m)
```

---

## Phase 8 — External media & CDNs

Payloads often reference external media (S3, DigitalOcean Spaces, Cloudinary).
For a **fully offline** clone:
1. Extract all `https://` URLs from payload JSON and JS.
2. Download them into a mirrored `clone/external/` or `clone/media/` tree.
3. Optionally rewrite payload URLs to local paths (risky — only if needed and
   test thoroughly). Default: keep original URLs (works when online).

For a **run-as-is** clone, leave external URLs untouched.

---

## Phase 9 — Source reconstruction (only if user chose B)

Only perform when explicitly requested. Steps:
1. Run REA `analyze_javascript_application` to get the module graph.
2. Use the graph's `locations` and `semantic_graph` to identify original
   module boundaries.
3. Deobfuscate with `js-beautify` / `prettier` (formatting only, not logic).
4. For each original module, create a file under `src/` mirroring the path.
5. Map imports/exports from the graph.
6. Note: reconstructed source will **not** build identically; mark as
   "best-effort reconstruction" in README. Do not claim it is the original.

Tools (install only if authorized): `npm i -g js-beautify prettier`.

---

## Phase 10 — Packaging & run instructions

Write `README.md` with:
- Prerequisites (Python or Node).
- How to run: `cd clone && python -m http.server 8765` → open
  http://127.0.0.1:8765.
- Locale routes: `/fr/`, `/zh/`, `/ko/`, `/pt/`, `/ro/`, `/es/`, `/en/preview/`.
- Known limitations: external API/media calls require network; some
  preview/about/contact routes need their payload (included).
- Credits: original site belongs to its owners; clone is for educational use.

---

## Phase 11 — Git commit & push

```bash
git init
git add .
git commit -m "Full clone of <target>"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

If authentication fails, ask the user for a PAT or use `gh auth login`. Do not
store tokens in the repo.

Large files (>50MB): consider Git LFS. Check file sizes first.

---

## Robustness checklist

- [ ] All core assets return 200 (zero 404s on home page load).
- [ ] WebGL scene renders (master scene GLB, textures, decoders).
- [ ] Audio/lottie load.
- [ ] All locale routes load.
- [ ] Build manifest downloaded.
- [ ] External URLs documented.
- [ ] README.md present.
- [ ] No debug/instrumentation scripts left in HTML.
- [ ] No secrets committed.

---

## Anti-patterns to avoid

- Do not assume a library is available; check package.json / neighboring files.
- Do not commit secrets or API keys.
- Do not claim static analysis observed execution.
- Do not describe a broad investigation as complete while required questions
  remain open.
- Do not leave debug beacon scripts in the final clone.

---

## Included scripts index

| Script | Purpose |
|---|---|
| `crawl.js` | Recursive same-origin asset crawler |
| `incremental.js` / `incremental2.js` | Re-scan and fetch missing refs safely |
| `downloadroutes.js` | Fetch all prerendered routes + payloads |
| `logserver.js` | Static server with 404 + client-log capture |
| `checkmissing.py` | Static missing-asset scanner |
| `extracturls.py` | Extract external URLs from payloads |
| `findchunks.py` | Find JS chunk references |

All templates are in Phase 2/5/6/7 above.

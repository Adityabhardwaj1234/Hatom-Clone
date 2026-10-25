# Verification Reference

## The 404-driven loop

1. Serve the clone with `scripts/logserver.js`.
2. Open in a real browser (or `desktop_browser_open`).
3. Wait 15–30 seconds for lazy chunks, WebGL, audio, route payloads.
4. Read server log. Every `404` → download that file from origin.
5. Repeat until a full load produces zero 404s for core assets.

## What counts as "done"

- Home page loads with zero 404s.
- WebGL scene renders (master scene GLB, textures, decoders).
- Audio and Lottie load.
- All locale routes load.
- Build manifest present.
- `checkmissing.py` reports 0 missing (excluding code false positives).

## Beacon check

Inject temporarily into `<head>`:
```html
<script>setTimeout(()=>fetch('/log',{method:'POST',body:JSON.stringify({type:'beacon',title:document.title,bodyLen:document.body?document.body.innerHTML.length:0})}),4000);</script>
```
A growing `bodyLen` across reloads indicates progressive rendering.

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Only loading screen shows | Missing decoder or GLB | Check 404 log; download missing |
| Page reloads repeatedly | Hydration error → `reloadNuxtApp` | Check console; usually missing payload/build meta |
| CORS errors on payload | crossorigin fetch without headers | Ensure same-origin serving (python http.server is fine) |
| Empty scene | DRACO decoder path wrong | Verify `/webgl/libs/draco/` files |
| Locale shows English | Wrong payload file | Ensure `/<locale>/_payload.json` exists |

## Static scan

Run `scripts/checkmissing.py ./clone` for a quick scan of quoted paths vs disk.
Run `scripts/verifyclone.py ./clone` for a comprehensive report.

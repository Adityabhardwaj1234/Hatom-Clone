---
name: clone-anything
description: Fully clone any website, web app, SSR/SPA, Electron app, or shipped binary into a locally runnable copy. Uses recursive asset crawling, REA reverse engineering when needed, and a 404-driven verification loop until zero missing assets remain. Ask the user whether to run the clone as-is or generate readable source code. Use this skill whenever the user mentions cloning, mirroring, downloading, or reverse engineering a website, web app, Electron app, binary, APK, IPA, firmware, or package — even if they don't explicitly say "clone."
compatibility: Requires Node.js 18+, Python 3.8+, and git. REA is optional but recommended for binaries/packages/Electron apps. No unrelated software is installed.
---

# Clone Anything — Universal, REA-Augmented Cloning Skill

## Mandatory first question

Before doing anything, ask the user:

> **Do you want me to (A) run the clone as-is (static mirror, faithful runtime,
> fastest), or (B) generate readable source code (decompiled/reconstructed
> project, slower, best-effort)?**

- **(A) Run as-is**: mirror all assets and serve them. No transformation.
- **(B) Generate source**: additionally decompile bundles and reconstruct a
  buildable project. Only if REA or a decompiler is available.

Default to (A) if unanswered. Record the choice and branch accordingly.

## Decision tree

| Target | Primary tool | REA? |
|---|---|---|
| Live website / SSR / SPA | Recursive crawler + static server | Optional (JS graph) |
| Electron app (installed) | `analyze_javascript_application` on app.asar | Yes |
| Native binary / archive / APK / IPA / firmware | `open_binary` + focused tools | Yes |
| npm package / tarball | Extract + `analyze_javascript_application` | Yes |
| Managed (.NET) assembly | `inspect_managed_artifact` | Yes |

If the user says "my app" with no name/path, **ask which app** before searching.

## High-level process

1. **Reconnaissance** — fetch homepage, identify framework, asset layout, payload endpoints.
2. **Crawl** — run `scripts/crawl.js` to recursively download all same-origin assets.
3. **REA analysis** (optional) — `analyze_javascript_application` for JS graph / hidden paths.
4. **Dynamic chunks & decoders** — find lazy chunks, DRACO/Basis decoders, workers.
5. **Route & payload completeness** — for SSR frameworks, fetch all prerendered routes + payloads.
6. **404-driven verification loop** — serve with `scripts/logserver.js`, open in browser, fix every 404 until zero.
7. **Static scan** — run `scripts/checkmissing.py` and `scripts/verifyclone.py`.
8. **External media** — document or download CDN assets.
9. **Source reconstruction** — only if user chose (B). See `references/source-reconstruction.md`.
10. **Package** — write `README.md`, commit, push.

## Phase 1 — Reconnaissance

Fetch the homepage and any locale roots. Identify:
- Framework (Nuxt, Next.js, Vite, Webpack, Angular, etc.).
- Asset base path (`/assets`, `/_next/static`, `/static`).
- SSR payload endpoint (`/_payload.json`, `/_next/data`, `__NEXT_DATA__`).
- Build id / manifest (`assets/builds/meta/<id>.json`).
- External CDNs (media, fonts, analytics, 3D decoders).

Save raw HTML. Parse `<script src>`, `<link href>`, `<img src>`, `url(...)` in
CSS, and inline `__NUXT__`/`__NEXT_DATA__`.

## Phase 2 — Recursive asset crawler

Run `scripts/crawl.js <BASE_URL> <OUT_DIR>`:

```bash
node scripts/crawl.js https://www.hatom.com ./clone
```

The crawler BFS-downloads every same-origin URL, extracts references from text
assets, and skips already-downloaded files. See `references/asset-crawling.md`
for framework detection, false-positive avoidance, and dynamic chunk discovery.

## Phase 3 — REA analysis (optional but recommended for apps)

For JavaScript apps:
```bash
npx -y rea-agents@6.7.0 analyze-javascript-application <clone> --json
```
- Output is **UTF-16 LE** — read with `encoding='utf-16'`.
- For large bundles, use `--source-path <file>` to focus.
- Raise `--analysis-timeout-ms` and `--max-heap-mb` for large bundles.
- See `references/rea-workflow.md` for connection, routing, and evidence discipline.

For binaries/archives, follow the REA routing table in `references/rea-workflow.md`.

## Phase 4 — Dynamic chunks & decoders

Search the main bundle for:
- 8-char hash filenames: `[A-Za-z0-9]{8}\.js`.
- `decoderPath`, `transcoderPath`, `workerPath`, `basis_transcoder`, `draco_decoder`.
- `assets/builds/meta/*.json` (Nuxt build manifest).

Download any missing decoders/workers manually. Common Three.js paths:
- `/webgl/libs/draco/` → `draco_decoder.js`, `draco_wasm_wrapper.js`, `draco_decoder.wasm`
- `/webgl/libs/basis/` → `basis_transcoder.js`, `basis_transcoder.wasm`

## Phase 5 — Route & payload completeness (SSR frameworks)

For Nuxt/Next SSR apps:
1. Get the build manifest → `prerendered` route list.
2. Run `scripts/downloadroutes.js <BASE_URL> <MANIFEST> <OUT_DIR>`.
3. Locale roots use the same UUID but different payload content.

## Phase 6 — 404-driven verification loop (the "perfect clone" step)

1. Serve the clone: `node scripts/logserver.js ./clone 8766`.
2. Open in a real browser (or `desktop_browser_open`).
3. Wait 15–30 seconds for lazy chunks, WebGL, audio, route payloads.
4. Read the server log. Every `404` → download that file from origin.
5. Repeat until zero 404s for core assets.
6. Inject the beacon (temporarily) to confirm rendering.

See `references/verification.md` for common failure modes and the beacon template.

## Phase 7 — Missing-asset static scan

```bash
python scripts/checkmissing.py ./clone
python scripts/verifyclone.py ./clone
```

`checkmissing.py` scans quoted paths vs disk. `verifyclone.py` gives a comprehensive
report (missing assets, empty files, JSON parse issues, root index.html).

## Phase 8 — External media & CDNs

Extract all `https://` URLs from payloads:
```bash
python scripts/extracturls.py ./clone
```
For a **fully offline** clone, download into `clone/external/` or `clone/media/`.
For a **run-as-is** clone, leave them. Document in README either way.

## Phase 9 — Source reconstruction (only if user chose B)

See `references/source-reconstruction.md`. Only on explicit request. Run REA,
deobfuscate, reconstruct module boundaries, mark as best-effort.

## Phase 10 — Packaging & run instructions

Write `README.md` with prerequisites, run command (`python -m http.server 8765`),
locale routes, known limitations, and credits. See the Hatom clone README for a
template.

## Phase 11 — Git commit & push

```bash
git init && git add -A
git commit -m "Full clone of <target>"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

If push protection blocks a secret (often a false positive in a minified
bundle), redact the matching token pattern in the file, amend, and re-push.
See the Hatom clone history for an example.

## Robustness checklist

- [ ] All core assets return 200 (zero 404s on home page load).
- [ ] WebGL scene renders (master scene GLB, textures, decoders).
- [ ] Audio and Lottie load.
- [ ] All locale routes load.
- [ ] Build manifest downloaded.
- [ ] External URLs documented.
- [ ] README.md present.
- [ ] No debug/instrumentation scripts left in HTML.
- [ ] No secrets committed.

## Bundled resources

- `scripts/` — crawl.js, incremental.js, downloadroutes.js, logserver.js,
  checkmissing.py, extracturls.py, verifyclone.py.
- `references/` — rea-workflow.md, asset-crawling.md, verification.md,
  source-reconstruction.md, schemas.md.
- `agents/` — verifier.md (verification subagent).
- `evals/evals.json` — test cases.

## Anti-patterns

- Do not assume a library is available; check first.
- Do not commit secrets or API keys.
- Do not claim static analysis observed execution.
- Do not leave debug beacon scripts in the final clone.
- Do not describe a broad investigation as complete while required questions
  remain open.

## Trigger eval queries (for description optimization)

Should trigger:
- "Clone https://example.com fully and run it locally"
- "Mirror this website including all images and scripts"
- "Download the whole site so I can run it offline"
- "Reverse engineer this Electron app and give me a copy"
- "I need an offline copy of this web app with all 3D assets"

Should not trigger:
- "How do I deploy a website to Vercel?"
- "Write a Python script to scrape a single page"
- "What is the difference between SSR and CSR?"
- "Help me fix a bug in my React component"
- "Set up a GitHub Actions workflow"

# Asset Crawling Reference

## Framework detection

| Signal in HTML | Framework | Asset base | Payload |
|---|---|---|---|
| `__NUXT__`, `/_payload.json` | Nuxt 3 | `/assets` | `/_payload.json?<id>` |
| `__NEXT_DATA__`, `/_next/` | Next.js | `/_next/static` | `/_next/data/<buildId>/...` |
| `import.meta`, Vite chunks | Vite | `/assets` | none |
| `webpackJsonp`, `__webpack_require__` | Webpack | `/static/js` | none |
| `ng-version` | Angular | none | none |

## Discovery sources (scan all of these)

1. HTML: `src`, `href`, `content`, `data-src`, `data-href`, `poster`.
2. CSS: `url(...)`, `@import`, `@font-face src`.
3. JS: quoted strings starting with `/` or `http`, `import()`, `from`, dynamic chunk manifests.
4. JSON: any string field that is a URL.
5. Inline: `__NUXT__`, `__NEXT_DATA__`, `window.__APP_CONFIG__`.

## False-positive avoidance

Only enqueue a string if ALL of:
- starts with `/` or `http://` or `https://`
- contains no spaces, commas, `${`, `{`, `}`, `(`, `)`

This filters out API paths embedded in code (e.g. `"/transactions/count"`) is actually
a false negative risk — but those are not files, so skipping them is fine; the
crawler relies on the 404 loop to catch real misses.

## Dynamic chunks

- Search the main bundle for 8-char hash filenames: `[A-Za-z0-9]{8}\.js`.
- Webpack: parse the chunk manifest (`self.webpackChunk...`).
- Three.js: locate `decoderPath` / `transcoderPath` / `workerPath` assignments.
- Nuxt: fetch `assets/builds/meta/<id>.json` → `prerendered` routes.

## Decoders / workers (Three.js)

Common paths:
- `/webgl/libs/draco/` → `draco_decoder.js`, `draco_wasm_wrapper.js`, `draco_decoder.wasm`
- `/webgl/libs/basis/` → `basis_transcoder.js`, `basis_transcoder.wasm`

## External media

Extract all `https://` URLs from payloads. For offline clones, download into
`clone/external/` or `clone/media/`. For run-as-is clones, leave them.

## Locale routes

Nuxt SSR apps serve locale-specific payloads at `/<locale>/_payload.json` even
though the UUID query is shared. Download each.

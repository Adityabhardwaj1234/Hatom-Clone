# Hatom — Maintainable Source (Best-Effort)

This folder contains a runnable, human-maintainable scaffold of the Hatom clone.

## Run

```bash
npm install
npm run dev
```

Opens http://localhost:5173. The app runs from the production bundle served as
static assets (see `assets/`, `webgl/`, etc. at the project root), so it loads
exactly like the original clone.

## Structure

- `index.html` — original SSR shell (entry point).
- `assets/`, `webgl/`, `audio/`, `lottie/`, `images/`, `video/` — static assets.
- `src/main.js` — beautified production bundle (readable reference).
- `src/components/` — one stub file per discovered Vue component (55 total).
- `src/bundles/` — (add via `decompile-all.js`) beautified per-chunk bundles.

## Source reconstruction

The `src/main.js` and `src/components/` are best-effort reconstructions produced
by `scripts/decompile.js` / `scripts/decompile-all.js` from the clone-anything
skill. Original module boundaries are inferred; this will not build as a
from-scratch source project. Use for reading, debugging, and gradual
refactoring.

## Notes

- External API calls (MultiversX, Hatom app) require network access.
- To regenerate beautified bundles: `node ../HatomCloneTestREA/.agents/skills/clone-anything/scripts/decompile-all.js . .`

# Source Reconstruction (Optional, on request only)

Only perform when the user explicitly chooses "generate readable source code".

## Automated decompilation

Use the bundled scripts:

```bash
# Single bundle
node scripts/decompile.js <bundle.js> <out_dir>

# All bundles in a clone
node scripts/decompile-all.js <clone_dir> <out_dir>
```

- `decompile.js` — beautifies one bundle with prettier, extracts component
  names (`__name:"..."`), writes stub files, scaffolds a Vite/Vue project.
- `decompile-all.js` — processes every `.js` in `<clone>/assets/`, writes
  beautified bundles to `src/bundles/`, aggregates all component names.

## Maintainable source scaffold

After decompilation, create a runnable, human-maintainable project:

1. Create `public/` and move ALL static assets there (`assets/`, `webgl/`,
   `audio/`, `lottie/`, `images/`, `video/`, locale route folders, payloads,
   `index.html`-adjacent files). Keep `index.html`, `package.json`,
   `vite.config.js`, `README.md`, `.gitignore`, and `src/` at the project root.
   Move `index.html` back to the project root (Vite needs it as the entry).
   **Important:** pre-built bundles (e.g. `assets/DzIV7Ypb.js`) must live under
   `public/` so Vite copies them verbatim instead of trying to bundle them
   (which fails with "Identifier '__vitePreload' has already been declared").
2. Add `package.json` with `dev`/`build`/`preview` scripts using Vite.
3. Add `vite.config.js` (port 5173, vue plugin).
4. Keep `index.html` as the original SSR shell (entry point loads the bundle).
5. Put beautified bundles in `src/bundles/` and component stubs in
   `src/components/`.
6. Add `src/main.js` (beautified entry) and `README.md` with run instructions.
7. Verify with `npm install && npm run dev` (serves on localhost:5173) and
   `npm run build` (must succeed and produce `dist/`).

See the Hatom repo (https://github.com/Adityabhardwaj1234/Hatom) for a working
example.

## Run the reconstructed project

```bash
cd <project>
npm install
npm run dev      # http://localhost:5173
npm run build    # produces dist/
```

## Steps (full pipeline)

1. Run REA `analyze_javascript_application` on the clone for the module graph.
2. Run `decompile-all.js` to produce beautified bundles.
3. Build the maintainable scaffold (above), placing assets under `public/`.
4. Verify with `npm run dev` and `npm run build`.
5. Refine module boundaries using REA's semantic graph.
6. Deobfuscate/format further with `prettier` / `js-beautify` if needed.
7. For each original module, create `src/<original-path>`.
8. Map imports/exports from the graph's edges.
9. Mark the result as "best-effort reconstruction" — it will not build identically.

## Tools (install only if authorized)

```bash
npm i -g js-beautify prettier
```

## Warnings

- Reconstructed source is not the original; never claim it is.
- Many modules are inlined/bundled; boundaries are inferred.
- Do not commit reconstructed source as if it were original.
- Do not leave `node_modules/` in the commit (add to .gitignore).

## When NOT to do this

- If the user chose "run as-is".
- If REA is unavailable and no decompiler exists.
- If the target is a live site with no shipped bundle (just mirror it).

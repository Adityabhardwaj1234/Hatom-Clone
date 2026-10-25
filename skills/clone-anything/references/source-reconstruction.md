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

1. Copy the clone's static assets to the project root (so `/assets`, `/webgl`,
   etc. resolve).
2. Add `package.json` with `dev`/`build`/`preview` scripts using Vite.
3. Add `vite.config.js` (port 5173, vue plugin).
4. Keep `index.html` as the original SSR shell (entry point loads the bundle).
5. Put beautified bundles in `src/bundles/` and component stubs in
   `src/components/`.
6. Add `src/main.js` (beautified entry) and `README.md` with run instructions.
7. Verify with `npm install && npm run dev` — must serve on localhost:5173.

See the Hatom clone's `maintainable-source/` folder for a working example.

## Run the reconstructed project

```bash
cd maintainable-source
npm install
npm run dev
```

Opens http://localhost:5173. The app runs from the production bundle served as
static assets, so it loads exactly like the original clone, while the beautified
bundles in `src/` provide a readable reference.

## Steps (full pipeline)

1. Run REA `analyze_javascript_application` on the clone for the module graph.
2. Run `decompile-all.js` to produce a readable project.
3. Build the maintainable scaffold (above).
4. Verify with `npm run dev`.
5. Read `normalized_result.semantic_graph` and `locations` to refine module
   boundaries.
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

## When NOT to do this

- If the user chose "run as-is".
- If REA is unavailable and no decompiler exists.
- If the target is a live site with no shipped bundle (just mirror it).

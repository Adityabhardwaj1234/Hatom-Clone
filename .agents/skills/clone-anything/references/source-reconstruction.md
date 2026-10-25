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

## Steps

1. Run REA `analyze_javascript_application` on the clone for the module graph.
2. Run `decompile-all.js` to produce a readable project.
3. Read `normalized_result.semantic_graph` and `locations` to refine module
   boundaries.
4. Deobfuscate/format further with `prettier` / `js-beautify` if needed.
5. For each original module, create `src/<original-path>`.
6. Map imports/exports from the graph's edges.
7. Mark the result as "best-effort reconstruction" — it will not build identically.

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

# Source Reconstruction (Optional, on request only)

Only perform when the user explicitly chooses "generate readable source code".

## Steps

1. Run REA `analyze_javascript_application` on the clone.
2. Read `normalized_result.semantic_graph` and `locations` to identify module
   boundaries and original file paths.
3. Deobfuscate/format with `prettier` / `js-beautify` (formatting only).
4. For each original module, create `src/<original-path>`.
5. Map imports/exports from the graph's edges.
6. Mark the result as "best-effort reconstruction" — it will not build identically.

## Tools (install only if authorized)

```
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

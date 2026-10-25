# Schemas

## evals/evals.json

```json
{
  "skill_name": "clone-anything",
  "evals": [
    {
      "id": 1,
      "prompt": "Clone https://example.com fully and run it locally",
      "expected_output": "A local directory with all assets, zero 404s on load, README.md",
      "files": []
    }
  ]
}
```

## grading.json (per run)

```json
{
  "expectations": [
    { "text": "index.html present", "passed": true, "evidence": "clone/index.html exists" }
  ]
}
```

## timing.json (per run)

```json
{ "total_tokens": 0, "duration_ms": 0, "total_duration_seconds": 0.0 }
```

## benchmark.json (aggregate)

See skill-creator `references/schemas.md` for the full benchmark schema.
The viewer (`eval-viewer/generate_review.py`) depends on exact field names.

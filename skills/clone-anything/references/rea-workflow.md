# REA Workflow for Cloning

## When to use REA

Use REA when the target is a **shipped binary, package, archive, APK, IPA, firmware,
or Electron app** — i.e., when behavior is not established by available source.
For a live website or a complete source repo, use normal tools first; REA is
optional for the JavaScript graph.

## Connection

1. Check if REA MCP tools are present. If yes, use them directly.
2. If absent, diagnose: `npx -y rea-agents@6.7.0 doctor --json`.
3. Repair registration with a dry-run plan first:
   `npx -y rea-agents@6.7.0 setup --client <client> --dry-run --json`.
   Apply only after approval: `... setup --client <client> --yes`.
4. Never install unrelated software (Node, Java, Ghidra, JADX, etc.).

## Routing by target

| Target | First tool |
|---|---|
| ASAR / extracted JS tree | `analyze_javascript_application` |
| ZIP/APK/IPA/MSIX/DMG | `open_binary` (archive route) |
| Android APK code | `inspect_android_package` |
| Managed PE/CLI | `inspect_managed_artifact` |
| Firmware | `inspect_firmware_regions` |
| .NET NativeAOT | native Ghidra analysis |
| Electron runtime (open) | `list_electron_targets` |
| Browser page (open) | `list_browser_targets` |
| EVM bytecode | `inspect_evm_interface` |
| Go binary | `inspect_go_binary` |
| Rust binary | `inspect_rust_binary` |
| SQLite DB | `inspect_sqlite_database` |
| ELF layout | `inspect_binary_layout` |
| Core dump | `inspect_recorded_crash` |
| PE resources | `inspect_pe_resources` |
| Native exe/lib/db | `open_binary` then focused tools |

## JavaScript application analysis (CLI fallback)

```
npx -y rea-agents@6.7.0 analyze-javascript-application <path> --json
```

- Output is **UTF-16 LE** — read with `encoding='utf-16'`.
- For large bundles, use `--source-path <file>` to focus.
- Raise `--analysis-timeout-ms` (default 300000) and `--max-heap-mb` (default 1024).
- Use `--detail summary` equivalent via `inspect_analysis_view` when using MCP.
- Export full session with `export_evidence_bundle` if transport truncates.

## Evidence discipline

- Distinguish observations, inferences, unknowns.
- Cite Evidence IDs; preserve limitations and incomplete coverage.
- Never imply static analysis observed execution.
- Close native sessions with `close_binary` when done.

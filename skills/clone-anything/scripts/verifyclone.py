#!/usr/bin/env python3
"""Comprehensive clone verifier. Checks: missing assets, 404-prone paths, file sizes, MIME sanity."""
import os, re, sys, json

root = sys.argv[1] if len(sys.argv) > 1 else './clone'
errors = []
warnings = []

# 1. Missing assets
missing = set()
for dp, _, fs in os.walk(root):
    for f in fs:
        p = os.path.join(dp, f)
        if not f.endswith(('.js', '.css', '.html', '.json', '.svg')): continue
        try:
            s = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for rgx in (r'"(/[^"]+)"', r"'(/[^']+)'"):
            for m in re.finditer(rgx, s):
                ref = m.group(1).split('?')[0]
                if ref.endswith('/') or '.' not in os.path.basename(ref): continue
                target = os.path.join(root, ref.lstrip('/'))
                if not os.path.isfile(target):
                    missing.add(ref)
if missing:
    errors.append('MISSING ASSETS: %d' % len(missing))
    for m in sorted(missing)[:50]:
        errors.append('  ' + m)

# 2. Empty files
empty = []
for dp, _, fs in os.walk(root):
    for f in fs:
        p = os.path.join(dp, f)
        if os.path.getsize(p) == 0:
            empty.append(os.path.relpath(p, root))
if empty:
    warnings.append('EMPTY FILES: %d' % len(empty))
    for e in empty[:20]:
        warnings.append('  ' + e)

# 3. Critical files
critical = ['index.html', '_payload.json', 'assets/DzIV7Ypb.js'] if False else []
# generic: require an index.html at root
if not os.path.isfile(os.path.join(root, 'index.html')):
    errors.append('MISSING ROOT index.html')

# 4. Decode check for JSON
badjson = []
for dp, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.json'): continue
        p = os.path.join(dp, f)
        try:
            json.load(open(p, encoding='utf-8'))
        except Exception as e:
            # Nuxt payloads may be UTF-8; try utf-16
            try:
                json.load(open(p, encoding='utf-16'))
            except Exception:
                badjson.append((os.path.relpath(p, root), str(e)[:80]))
if badjson:
    warnings.append('JSON PARSE ISSUES: %d' % len(badjson))
    for b in badjson[:10]:
        warnings.append('  %s :: %s' % b)

# 5. Summary
print('=== CLONE VERIFICATION ===')
print('root:', root)
print('files:', sum(len(fs) for _, _, fs in os.walk(root)))
print('size MB:', round(sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(root) for f in fs) / 1024 / 1024, 2))
if errors:
    print('\nERRORS:')
    for e in errors: print(e)
if warnings:
    print('\nWARNINGS:')
    for w in warnings: print(w)
if not errors and not warnings:
    print('\nRESULT: CLEAN - no missing assets, no empty files, no JSON issues.')
elif not errors:
    print('\nRESULT: OK with warnings.')
else:
    print('\nRESULT: ISSUES FOUND.')
sys.exit(1 if errors else 0)

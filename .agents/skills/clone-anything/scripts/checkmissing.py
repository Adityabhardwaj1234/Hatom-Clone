#!/usr/bin/env python3
"""Static missing-asset scanner. Scans all text files in clone dir for quoted paths and verifies existence."""
import os, re, sys

root = sys.argv[1] if len(sys.argv) > 1 else './clone'
missing = set()
checked = 0
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
                checked += 1
                if not os.path.isfile(target):
                    missing.add(ref)

print('checked refs:', checked)
print('missing:', len(missing))
for m in sorted(missing):
    print(m)
sys.exit(1 if missing else 0)

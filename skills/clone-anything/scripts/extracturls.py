#!/usr/bin/env python3
"""Extract all external https:// URLs from payload JSON and JS files in a clone."""
import os, re, sys

root = sys.argv[1] if len(sys.argv) > 1 else './clone'
urls = set()
for dp, _, fs in os.walk(root):
    for f in fs:
        p = os.path.join(dp, f)
        if not f.endswith(('.js', '.json', '.html')): continue
        try:
            s = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        for m in re.finditer(r'https://[A-Za-z0-9_\-./?=&%+#]+', s):
            urls.add(m.group(0).rstrip('.,;:'))
print(len(urls))
for u in sorted(urls):
    print(u)

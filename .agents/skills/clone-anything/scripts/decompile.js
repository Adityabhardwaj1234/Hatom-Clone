#!/usr/bin/env node
// Best-effort source reconstruction from a minified JS bundle.
// Usage: node decompile.js <BUNDLE.js> <OUT_DIR>
// Produces a project skeleton with a beautified entry file and per-component stubs.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bundle = process.argv[2];
const outDir = path.resolve(process.argv[3] || './src-reconstructed');
if (!bundle || !fs.existsSync(bundle)) { console.error('Usage: node decompile.js <bundle.js> <out_dir>'); process.exit(1); }

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, 'src'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'src', 'components'), { recursive: true });

const raw = fs.readFileSync(bundle, 'utf8');
console.log('bundle size:', raw.length);

// 1. Beautify with prettier (if available) else write raw
let beautified = raw;
try {
  const tmpIn = path.join(outDir, '_bundle_in.js');
  fs.writeFileSync(tmpIn, raw);
  beautified = execSync('npx --yes prettier --parser babel "' + tmpIn + '"', { encoding: 'utf8', maxBuffer: 1024 * 1024 * 200 });
  fs.unlinkSync(tmpIn);
  console.log('beautified with prettier');
} catch (e) {
  console.log('prettier failed, writing raw:', e.message.slice(0, 120));
}
fs.writeFileSync(path.join(outDir, 'src', 'main.js'), beautified);
console.log('wrote src/main.js');

// 2. Extract component names
const names = new Set();
const re = /__name\s*:\s*["']([^"']+)["']/g;
let m;
while ((m = re.exec(raw)) !== null) names.add(m[1]);
console.log('found', names.size, 'component names');

// 3. Create a stub file per component
for (const name of names) {
  const safe = name.replace(/[^A-Za-z0-9_\-]/g, '_');
  const filePath = path.join(outDir, 'src', 'components', safe + '.js');
  const content = `// Reconstructed stub for component: ${name}\n// The implementation lives in src/main.js (search for __name:"${name}").\n// This file is a best-effort placeholder; the original module boundary is inferred.\nexport const ${safe} = null;\n`;
  fs.writeFileSync(filePath, content);
}
console.log('wrote', names.size, 'component stubs');

// 4. Write a package.json skeleton
const pkg = {
  name: 'reconstructed-app',
  version: '0.0.0',
  private: true,
  type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  dependencies: { vue: '^3.4.0' },
  devDependencies: { vite: '^5.0.0', '@vitejs/plugin-vue': '^5.0.0' }
};
fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(pkg, null, 2));

// 5. Write vite.config.js
fs.writeFileSync(path.join(outDir, 'vite.config.js'),
  `import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nexport default defineConfig({ plugins: [vue()], server: { port: 5173 } });\n`);

// 6. Write index.html
fs.writeFileSync(path.join(outDir, 'index.html'),
  `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Reconstructed App</title>\n</head>\n<body>\n<div id="app"></div>\n<script type="module" src="/src/main.js"></script>\n</body>\n</html>\n`);

// 7. Write README
fs.writeFileSync(path.join(outDir, 'README.md'),
  `# Reconstructed Source (Best-Effort)\n\nThis directory contains a best-effort reconstruction of a minified bundle.\n\n- \`src/main.js\` — beautified bundle (entry point).\n- \`src/components/\` — one stub file per discovered component name.\n\n## Limitations\n\n- Original module boundaries are inferred, not exact.\n- The bundle will not build as-is; this is for reading/analysis only.\n- Do not claim this is the original source.\n`);

// 8. Write component index
const indexContent = [...names].sort().map(n => `- ${n}`).join('\n');
fs.writeFileSync(path.join(outDir, 'COMPONENTS.md'), '# Discovered components\n\n' + indexContent + '\n');

console.log('DONE. Output:', outDir);
console.log('Components:', names.size);

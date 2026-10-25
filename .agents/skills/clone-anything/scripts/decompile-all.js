#!/usr/bin/env node
// Decompile ALL bundles in a clone's assets dir into one reconstructed source project.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cloneDir = process.argv[2];
const outDir = path.resolve(process.argv[3] || './src-reconstructed');
if (!cloneDir || !fs.existsSync(cloneDir)) { console.error('Usage: node decompile-all.js <clone_dir> <out_dir>'); process.exit(1); }

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, 'src'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'src', 'bundles'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'src', 'components'), { recursive: true });

const assetsDir = path.join(cloneDir, 'assets');
const bundles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js')).sort();
console.log('bundles:', bundles.length);

const allNames = new Set();
for (const b of bundles) {
  const raw = fs.readFileSync(path.join(assetsDir, b), 'utf8');
  const tmpIn = path.join(outDir, '_tmp_' + b);
  fs.writeFileSync(tmpIn, raw);
  let beautified = raw;
  try {
    beautified = execSync('npx --yes prettier --parser babel "' + tmpIn + '"', { encoding: 'utf8', maxBuffer: 1024 * 1024 * 200 });
  } catch (e) {
    console.log('prettier failed for', b, e.message.slice(0, 80));
  }
  fs.unlinkSync(tmpIn);
  const safeName = b.replace(/[^A-Za-z0-9_.-]/g, '_');
  fs.writeFileSync(path.join(outDir, 'src', 'bundles', safeName), beautified);
  const re = /__name\s*:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(raw)) !== null) allNames.add(m[1]);
  console.log('  ', b, raw.length, '-> beautified', beautified.length);
}

console.log('total component names:', allNames.size);
for (const name of allNames) {
  const safe = name.replace(/[^A-Za-z0-9_\-]/g, '_');
  fs.writeFileSync(path.join(outDir, 'src', 'components', safe + '.js'),
    `// Reconstructed stub for component: ${name}\n// Implementation lives in src/bundles/*.js (search for __name:"${name}").\nexport const ${safe} = null;\n`);
}

// package.json
const pkg = {
  name: 'hatom-reconstructed',
  version: '0.0.0',
  private: true,
  type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  dependencies: { vue: '^3.4.0' },
  devDependencies: { vite: '^5.0.0', '@vitejs/plugin-vue': '^5.0.0' }
};
fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(pkg, null, 2));
fs.writeFileSync(path.join(outDir, 'vite.config.js'),
  `import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nexport default defineConfig({ plugins: [vue()], server: { port: 5173 } });\n`);
// index.html from original clone if available
const cloneIndex = path.join(cloneDir, 'index.html');
if (fs.existsSync(cloneIndex)) fs.copyFileSync(cloneIndex, path.join(outDir, 'index.html'));
// README
fs.writeFileSync(path.join(outDir, 'README.md'),
  `# Hatom Reconstructed Source (Best-Effort)\n\nGenerated from the minified production bundle.\n\n- \`src/bundles/\` — beautified bundles (entry points).\n- \`src/components/\` — one stub per discovered component name.\n\n## Limitations\n\n- Original module boundaries are inferred.\n- Will not build as-is; intended for reading/analysis.\n- Do not claim this is the original source.\n`);
// component index
fs.writeFileSync(path.join(outDir, 'COMPONENTS.md'), '# Discovered components (' + allNames.size + ')\n\n' + [...allNames].sort().map(n => '- ' + n).join('\n') + '\n');

console.log('DONE. Output:', outDir);
console.log('Bundles:', bundles.length, 'Components:', allNames.size);

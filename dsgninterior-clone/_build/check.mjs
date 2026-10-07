// Verify every locally referenced asset exists in the mirror.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIRROR = path.resolve(__dirname, '..', 'mirror');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

const REF_RE = /\/(?:media|dist)\/[^\s"'()<>,]+/g;
const ROOT_RE = /["'(]\/(favicon\.ico|favicon\.svg|icon\.png|banner\.png|site\.webmanifest|apple-touch-icon\.png)/g;

const missing = new Map(); // ref -> [files]
const files = walk(MIRROR);

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!['.html', '.css', '.js', '.json', '.webmanifest', '.xml'].includes(ext)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  const refs = new Set();
  for (const m of txt.matchAll(REF_RE)) refs.add(m[0].split('#')[0].split('?')[0]);
  for (const m of txt.matchAll(ROOT_RE)) refs.add('/' + m[1]);
  for (const r of refs) {
    const local = path.join(MIRROR, r.replace(/^\/+/, ''));
    if (!fs.existsSync(local)) {
      if (!missing.has(r)) missing.set(r, []);
      if (missing.get(r).length < 2) missing.get(r).push(path.relative(MIRROR, f));
    }
  }
}

console.log(`Scanned ${files.length} files.`);
console.log(`Missing local assets: ${missing.size}`);
for (const [r, from] of [...missing].slice(0, 80)) console.log(`  ${r}   <- ${from.join(', ')}`);

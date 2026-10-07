// Build a curl --parallel config from mirrored HTML/CSS/JS asset references.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MIRROR = path.join(ROOT, 'mirror');
const ORIGIN = 'https://dsgninterior.se';

const ASSET_RE = /\/(?:media|dist)\/[^\s"'()<>,]+/g;
const ROOT_FILES = [
  '/favicon.ico', '/favicon.svg', '/icon.png', '/banner.png',
  '/site.webmanifest', '/robots.txt', '/sitemap.xml',
  '/apple-touch-icon.png',
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const clean = (u) => u.split('#')[0].split('?')[0];

async function main() {
  const files = walk(MIRROR);
  const set = new Set();
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!['.html', '.css', '.js', '.json', '.webmanifest', '.xml'].includes(ext)) continue;
    const txt = await fsp.readFile(f, 'utf8').catch(() => '');
    for (const m of txt.matchAll(ASSET_RE)) set.add(clean(m[0]));
    for (const rf of ROOT_FILES) if (txt.includes(rf)) set.add(rf);
  }
  for (const rf of ROOT_FILES) set.add(rf);

  const lines = [];
  let skipped = 0;
  for (const a of [...set].sort()) {
    const rel = a.replace(/^\/+/, '');
    const out = 'mirror/' + rel.replace(/\\/g, '/');
    if (fs.existsSync(path.join(ROOT, out))) { skipped++; continue; }
    lines.push(`url = "${ORIGIN}${a}"`);
    lines.push(`output = "${out}"`);
  }

  const cfg = path.join(__dirname, 'curl.cfg');
  await fsp.writeFile(cfg, lines.join('\n') + '\n', 'utf8');
  console.log(`unique assets: ${set.size}, already present: ${skipped}, to download: ${lines.length / 2}`);
  console.log('config -> ' + cfg);
}

main().catch((e) => { console.error(e); process.exit(1); });

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIRROR = path.resolve(__dirname, '..', 'mirror');

const pages = {
  home: 'en/index.html',
  works: 'en/projects/index.html',
  work: 'en/projects/tarsier/index.html',
  archive: 'en/dsgn-archive/index.html',
  office: 'en/office/index.html',
  default: 'en/privacy-policy/index.html',
};

function label(n) {
  const id = n.getAttribute?.('id');
  const cls = n.getAttribute?.('class');
  return n.rawTagName + (id ? '#' + id : '') + (cls ? '.' + cls.split(/\s+/).join('.') : '');
}

function dump(n, depth, max) {
  if (n.nodeType !== 1) return;
  console.log('  '.repeat(depth) + label(n));
  if (depth >= max) return;
  for (const c of n.childNodes) dump(c, depth + 1, max);
}

for (const [name, rel] of Object.entries(pages)) {
  const html = fs.readFileSync(path.join(MIRROR, rel), 'utf8');
  const root = parse(html);
  const page = root.querySelector('.page') || root.querySelector('#app > div');
  console.log('\n========== ' + name + '  (' + rel + ') ==========');
  dump(page, 0, 3);
}

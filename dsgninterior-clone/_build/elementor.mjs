// Extract Elementor-ready section blocks from the mirrored pages.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MIRROR = path.join(ROOT, 'mirror');
const OUT = path.join(ROOT, 'elementor');

// template -> representative mirrored page
const TEMPLATES = {
  home: 'en/index.html',
  works: 'en/projects/index.html',
  work: 'en/projects/tarsier/index.html',
  archive: 'en/dsgn-archive/index.html',
  office: 'en/office/index.html',
  default: 'en/privacy-policy/index.html',
};

const KNOWN = [
  'home-banners', 'works-grid', 'archives-grid', 'archives-header', 'default-header',
  'page-content', 'work-texts', 'work-gallery', 'work-credits', 'work-related',
  'footer', 'header', 'banner', 'menu', 'sr',
];

function slugFor(el) {
  const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
  const id = el.getAttribute('id');
  // office section -> use the "section-*" class
  const sec = cls.find((c) => c.startsWith('section-'));
  if (cls.includes('office-section') && sec) return sec;
  for (const k of KNOWN) if (cls.includes(k)) return k;
  if (id) return id;
  return el.rawTagName + (cls[0] ? '-' + cls[0] : '');
}

// Split a .page node into ordered, top-level sections.
function collectSections(page) {
  const out = [];
  const push = (n) => { if (n && n.nodeType === 1) out.push(n); };
  for (const child of page.childNodes) {
    if (child.nodeType !== 1) continue;
    if (child.rawTagName === 'main') {
      // a <main> that is itself a styled section (e.g. the home swiper) stays whole
      if ((child.getAttribute('class') || '').trim()) { push(child); continue; }
      for (const c of child.childNodes) {
        if (c.nodeType !== 1) continue;
        if (c.rawTagName === 'article' && c.getAttribute('class')?.includes('work')) {
          for (const cc of c.childNodes) push(cc);
        } else if (c.rawTagName === 'article') {
          for (const cc of c.childNodes) push(cc);
        } else push(c);
      }
    } else push(child);
  }
  return out;
}

// Make lazy markup work without the site's JS.
function normalize(node) {
  const html = node.outerHTML
    .replace(/\bdata-srcset=/g, 'srcset=')
    .replace(/\bdata-sizes=/g, 'sizes=')
    .replace(/\bclass="([^"]*)\blazy\b([^"]*)"/g, (m, a, b) => `class="${(a + b).replace(/\s+/g, ' ').trim()}"`);
  return html;
}

// Force `.img` / `.video` to their "loaded" state so images are visible with no JS.
function markLoaded(html) {
  return html
    .replace(/class="img"/g, 'class="img loaded"')
    .replace(/class="img /g, 'class="img loaded ')
    .replace(/class="video"/g, 'class="video loaded"')
    .replace(/class="video /g, 'class="video loaded ');
}

async function main() {
  await fsp.mkdir(OUT, { recursive: true });

  // shared assets — stylesheet with fonts bundled locally so the package is self-contained
  const css = await fsp.readFile(path.join(MIRROR, 'dist/assets/app-IJLh3IBL.css'), 'utf8');
  const cssLocal = css.replace(/url\((\/dist\/assets\/(cera-pro-[^)"]+))\)/g, 'url(./fonts/$2)');
  await fsp.writeFile(path.join(OUT, 'dsgn-styles.css'), cssLocal, 'utf8');

  const fontDir = path.join(OUT, 'fonts');
  await fsp.mkdir(fontDir, { recursive: true });
  for (const f of await fsp.readdir(path.join(MIRROR, 'dist/assets'))) {
    if (f.startsWith('cera-pro-')) {
      await fsp.copyFile(path.join(MIRROR, 'dist/assets', f), path.join(fontDir, f));
    }
  }
  await fsp.copyFile(path.join(MIRROR, 'dist/assets/app-k78B1xDx.js'), path.join(OUT, 'dsgn-app.js'));

  await fsp.writeFile(path.join(OUT, 'dsgn-standalone.css'), `/* dsgn interior — makes section/page blocks render correctly WITHOUT the site JS.
   Enqueue this after dsgn-styles.css. It only overrides the JS-driven fade-in states. */
.welcome .home-banners,
.welcome .header,
.welcome .footer,
.welcome header.banner .split,
.welcome header.banner .split div { opacity: 1 !important; }
.work-banner img, .work-banner video { opacity: 1 !important; }
`, 'utf8');

  const index = [];

  for (const [tpl, rel] of Object.entries(TEMPLATES)) {
    const raw = await fsp.readFile(path.join(MIRROR, rel), 'utf8');
    const root = parse(raw, { comment: true });
    const page = root.querySelector('.page') || root.querySelector('#app > div');
    if (!page) { console.log(`!! no .page in ${rel}`); continue; }

    const pageClass = page.getAttribute('class');

    // full-page block
    const full = markLoaded(normalize(page));
    const pageDir = path.join(OUT, 'pages');
    await fsp.mkdir(pageDir, { recursive: true });
    await fsp.writeFile(path.join(pageDir, `${tpl}.html`), full + '\n', 'utf8');

    // section blocks
    const sections = collectSections(page);
    const secDir = path.join(OUT, 'sections', tpl);
    await fsp.mkdir(secDir, { recursive: true });
    const list = [];
    let i = 0;
    for (const s of sections) {
      i++;
      const slug = String(i).padStart(2, '0') + '-' + slugFor(s);
      await fsp.writeFile(path.join(secDir, slug + '.html'), markLoaded(normalize(s)) + '\n', 'utf8');
      list.push(slug);
    }

    // standalone preview page (assets re-pointed at ../mirror so it opens directly)
    const prevDir = path.join(OUT, 'preview');
    await fsp.mkdir(prevDir, { recursive: true });
    const previewBody = full
      .replaceAll('/media/', '../../mirror/media/')
      .replaceAll('/dist/', '../../mirror/dist/');
    await fsp.writeFile(path.join(prevDir, `${tpl}.html`),
`<!doctype html>
<html lang="en" class="is-rendering">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${tpl} — dsgn interior (section preview)</title>
  <link href="../../mirror/dist/assets/app-IJLh3IBL.css" rel="stylesheet">
</head>
<body>
${previewBody}
</body>
</html>
`, 'utf8');

    index.push({ tpl, rel, pageClass, sections: list });
    console.log(`${tpl}: ${list.length} sections  [${pageClass}]`);
  }

  // manifest
  await fsp.writeFile(path.join(OUT, 'sections-index.json'), JSON.stringify(index, null, 2) + '\n', 'utf8');
  console.log('\nWrote -> ' + OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });

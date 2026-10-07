// Mirror dsgninterior.se -> ./mirror
// Downloads all EN+SV pages from sitemap, rewrites dsgninterior.se -> root-relative,
// then downloads every referenced asset (media, dist, root files).
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MIRROR = path.join(ROOT, 'mirror');
const ORIGIN = 'https://dsgninterior.se';

const log = (...a) => console.log(...a);
const exists = (p) => fs.existsSync(p);

// ---------- helpers ----------
async function fetchWithRetry(url, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (mirror-bot)' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

async function fetchText(url) {
  const res = await fetchWithRetry(url);
  return await res.text();
}

function urlPathToLocal(urlPath) {
  // "/en/projects" -> "en/projects/index.html"; "/" -> "index.html"
  let p = urlPath.split('#')[0].split('?')[0];
  p = p.replace(/^\/+/, '');
  if (p === '' || p.endsWith('/')) return path.join(p, 'index.html');
  const ext = path.extname(p);
  if (ext === '') return path.join(p, 'index.html');
  return p;
}

function assetToLocal(url) {
  // "/media/x.jpg" -> "media/x.jpg"; strip origin + query
  let u = url.replace(ORIGIN, '').split('#')[0].split('?')[0];
  u = u.replace(/^\/+/, '');
  return u;
}

const ASSET_RE = /(?:https?:\/\/dsgninterior\.se)?\/(?:media|dist)\/[^\s"'()<>,]+/g;
const ROOT_FILES = [
  '/favicon.ico', '/favicon.svg', '/icon.png', '/banner.png',
  '/site.webmanifest', '/robots.txt', '/sitemap.xml',
];

// ---------- main ----------
async function main() {
  await fsp.mkdir(MIRROR, { recursive: true });

  // 1. get page list from sitemap
  log('Fetching sitemap...');
  const sitemap = await fetchText(`${ORIGIN}/sitemap.xml`);
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pagePaths = [...new Set(locs.map((l) => new URL(l).pathname))];
  log(`Found ${pagePaths.length} pages`);

  const assetQueue = new Set();

  // 2. crawl each page, rewrite, save
  for (const p of pagePaths) {
    const url = ORIGIN + p;
    let html;
    try {
      html = await fetchText(url);
    } catch (e) {
      log(`  !! failed page ${p}: ${e.message}`);
      continue;
    }

    const before = html.length;

    // collect assets before rewriting
    for (const m of html.matchAll(ASSET_RE)) assetQueue.add(m[0]);
    for (const f of ROOT_FILES) if (html.includes(f)) assetQueue.add(f);

    // rewrite origin -> root-relative
    html = html.replaceAll(ORIGIN, '');

    // strip analytics (third-party)
    html = html.replace(/<script async src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>\s*/g, '');
    html = html.replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>\s*/g, '');

    // rewrite internal page links to trailing slash form (so static server + hosts serve index.html)
    for (const pp of pagePaths) {
      const q = pp.endsWith('/') ? pp : pp + '/';
      html = html.split(`href="${pp}"`).join(`href="${q}"`);
    }

    const out = path.join(MIRROR, urlPathToLocal(p));
    await fsp.mkdir(path.dirname(out), { recursive: true });
    await fsp.writeFile(out, html, 'utf8');
    log(`  page ${p} -> ${path.relative(MIRROR, out)}  (${before} -> ${html.length} b)`);
  }

  // 3. download all assets (css, js, fonts, images, videos)
  const assets = [...assetQueue].filter((a) => a && !a.endsWith('.html'));
  log(`\nDownloading ${assets.length} unique assets...`);

  let done = 0, bytes = 0, failed = [];
  const CONC = 12;
  let idx = 0;
  async function worker() {
    while (idx < assets.length) {
      const a = assets[idx++];
      const out = path.join(MIRROR, assetToLocal(a));
      try {
        if (!exists(out)) {
          const res = await fetchWithRetry(ORIGIN + a);
          const buf = Buffer.from(await res.arrayBuffer());
          await fsp.mkdir(path.dirname(out), { recursive: true });
          await fsp.writeFile(out, buf);
          bytes += buf.length;
        }
      } catch (e) {
        failed.push(`${a} (${e.message})`);
      }
      done++;
      if (done % 100 === 0) log(`  ...${done}/${assets.length}  ${(bytes / 1048576).toFixed(1)} MB`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  log(`\nAssets done. ${done - failed.length}/${assets.length} ok, ${(bytes / 1048576).toFixed(1)} MB downloaded.`);
  if (failed.length) {
    log(`FAILED (${failed.length}):`);
    failed.slice(0, 30).forEach((f) => log('  ' + f));
  }

  // 4. root redirect
  await fsp.writeFile(
    path.join(MIRROR, 'index.html'),
    `<!doctype html><meta charset="utf-8"><title>dsgn interior</title>
<meta http-equiv="refresh" content="0; url=./en/">
<script>location.replace('./en/');</script>
<a href="./en/">dsgn interior</a>\n`,
    'utf8'
  );
  log('\nMirror complete -> ' + MIRROR);
}

main().catch((e) => { console.error(e); process.exit(1); });

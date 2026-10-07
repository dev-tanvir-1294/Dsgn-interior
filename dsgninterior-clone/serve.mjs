// Tiny static server for the mirrored site.
//   node serve.mjs [port]      ->  http://localhost:8080/
// Serves ./mirror as web root with clean-URL support (/en/projects -> /en/projects/index.html).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, 'mirror');
const PORT = Number(process.argv[2] || 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.mp4': 'video/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg', '.pdf': 'application/pdf',
};

function resolve(filePath) {
  const candidates = [filePath, filePath + '.html', path.join(filePath, 'index.html')];
  for (const c of candidates) {
    try {
      const st = fs.statSync(c);
      if (st.isFile()) return c;
      if (st.isDirectory()) {
        const idx = path.join(c, 'index.html');
        if (fs.existsSync(idx)) return idx;
      }
    } catch { /* keep trying */ }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const found = resolve(path.join(ROOT, safe));

  // directory URL without trailing slash -> redirect so relative paths resolve
  if (found && !urlPath.endsWith('/')) {
    const asDir = path.join(ROOT, safe, 'index.html');
    if (path.resolve(found) === path.resolve(asDir)) {
      res.writeHead(301, { Location: urlPath + '/' });
      return res.end();
    }
  }

  if (!found) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found: ' + urlPath);
  }
  const ext = path.extname(found).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(found).pipe(res);
});

server.listen(PORT, () => {
  console.log(`dsgn interior mirror  ->  http://localhost:${PORT}/`);
  console.log(`EN: http://localhost:${PORT}/en/   SV: http://localhost:${PORT}/sv/`);
  console.log('Ctrl+C to stop.');
});

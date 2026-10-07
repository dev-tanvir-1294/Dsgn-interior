# dsgn interior — full static clone (for WordPress / Elementor)

A pixel-accurate, fully offline clone of **https://dsgninterior.se** (English **and** Swedish),
plus a ready-to-use **Elementor conversion kit**.

- **`mirror/`** — the complete static clone. Renders identically to the live site (same markup,
  stylesheet, fonts, images, videos and interaction bundle). Use it as the master reference.
- **`elementor/`** — the same design split into paste-ready blocks, a self-contained stylesheet
  and step-by-step conversion instructions. See **`elementor/README.md`**.

---

## Quick start

```bash
node serve.mjs          # serves ./mirror  ->  http://localhost:8080/
```

Then open:

- Home (EN): <http://localhost:8080/en/>  ·  Home (SV): <http://localhost:8080/sv/>
- Projects: <http://localhost:8080/en/projects/>

> A local server is **required** — the site uses ES-module JavaScript, which browsers refuse to
> load over `file://`. `serve.mjs` is a tiny zero-dependency static server with clean-URL support
> (`/en/projects` → `/en/projects/index.html`). It works on any static host too (Netlify, Vercel,
> nginx, Apache) since all pages are `…/index.html` with root-relative asset paths.

---

## What's inside

```
dsgninterior-clone/
├─ serve.mjs                # local preview server (node serve.mjs [port])
├─ README.md
├─ mirror/                  # ← the pixel-perfect clone
│  ├─ index.html            # /  → redirects to /en/
│  ├─ en/  sv/              # all 32 pages (16 EN + 16 SV)
│  │   └─ …/index.html      # e.g. en/projects/tarsier/index.html
│  ├─ media/                # 3,781 image/video files (avif + webp + jpg + mp4, responsive sizes)
│  ├─ dist/assets/          # app CSS + JS bundle + Cera Pro fonts (woff2/woff)
│  └─ favicon.*, icon.png, banner.png, site.webmanifest, robots.txt, sitemap.xml
├─ elementor/               # ← conversion kit (open elementor/README.md)
│  ├─ dsgn-styles.css       # full stylesheet (fonts re-pointed to ./fonts)
│  ├─ dsgn-standalone.css   # no-JS visibility override
│  ├─ dsgn-app.js           # optional interaction bundle
│  ├─ fonts/                # Cera Pro 400/500/700
│  ├─ pages/                # one complete page block per template
│  ├─ sections/<tpl>/       # the same pages split into sections
│  └─ preview/              # open in a browser to see each block rendered
└─ tools/                   # the scripts used to build all of this (optional)
```

### Pages cloned (all English + Swedish)

Home · Projects listing · 11 project detail pages (`fellowmind-goteborg`, `car-info`,
`stretch-care`, `fellowmind-stockholm`, `fellowmind-malmo`, `fellowmind-jonkoping`, `tarsier`,
`helo`, `bba`, `stratiteq`) · dsgn Archive · Office · Privacy Policy · Legal Notice.

---

## How it was mirrored

1. **Pages** — read from `sitemap.xml`, fetched over HTTP (not a headless browser, so the
   server-rendered header/menu/footer are included verbatim), and saved as directory-style
   `index.html` files.
2. **Paths** — every `https://dsgninterior.se` URL rewritten to root-relative, so the mirror is
   self-contained. Internal links get a trailing slash; canonical/hreflang/OG tags too.
3. **Assets** — the stylesheet, JS bundle, fonts, and every responsive image/video variant
   referenced by any page (`~3,800` files), downloaded and verified.
4. **Analytics removed** — the original Google Analytics snippet is intentionally not carried
   over.

A link checker (`tools/check.mjs`) reports **0 missing local assets**.

---

## Fidelity notes

- Same stylesheet, fonts, markup and interaction bundle as the live site. Verified by rendering
  the mirror in a Chromium browser and comparing against the live pages.
- The site's own interactions run from `dist/assets/app-k78B1xDx.js`: **Swiper** (home banner
  slider), **GSAP** (parallax/entrance animations), **Lenis** (smooth scroll), menu + read-more.
  These work in `mirror/` because the JS bundle is included.
- Image `srcset`/`sizes` (avif/webp/jpeg) and lazy-loading are preserved exactly.

---

## Rebuilding / re-running the tools (optional)

`tools/` contains the build scripts. They need Node 18+ and one dependency:

```bash
cd tools
npm install                     # node-html-parser (only elementor.mjs uses it)
node mirror.mjs                 # re-crawl pages into ../mirror
node assets.mjs && curl.exe -sS --parallel --parallel-max 16 --create-dirs --retry 2 --config curl.cfg
                                # (run from the project root) re-download assets
node check.mjs                  # verify every local reference resolves
node elementor.mjs              # regenerate ../elementor
```

---

## Converting to WordPress + Elementor

See **`elementor/README.md`** for the full guide: which stylesheets to enqueue, how to paste the
blocks, the template → page map, and the image-path options.

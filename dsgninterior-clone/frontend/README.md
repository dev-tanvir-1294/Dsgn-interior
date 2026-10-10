# dsgn interior — Next.js frontend (headless)

The React/Next.js frontend for the dsgn interior site. WordPress (see
`../dsgn-headless/`) is the content backend; this app renders the site and gives
it the SPA feel (no full page reloads).

---

## 1. Setup

```bash
npm install
copy .env.local.example .env.local   # then edit WORDPRESS_URL
npm run dev                           # http://localhost:3000
```

Set `WORDPRESS_URL` to your headless WordPress install (no trailing slash).
Without it, the site renders using the fallback content in `src/lib/config.ts`.

---

## 2. How it works

- **Server components** fetch WordPress over the REST API (with ISR revalidation)
  and render the markup. Navigation between routes is instant — React swaps the
  page without a full reload.
- **`src/lib/wp.ts`** — the REST client (projects, pages, menu, site settings).
- **`src/lib/config.ts`** — fallback header/footer text and the home hero copy.
- **`src/styles/`** — the full dsgn design system (`dsgn-styles.css`) + fonts,
  copied from `../elementor/`, plus `overrides.css`.

### Routes

| Route | Source |
|---|---|
| `/` | Home hero slider (featured projects) |
| `/projects/` | All projects (grid) |
| `/projects/[slug]/` | Single project (banner, specs, gallery, related) |
| `/office/`, `/dsgn-archive/`, `/privacy-policy/`, … | Catch-all → WordPress pages |

---

## 3. What's rebuilt vs. content-driven

- **Rebuilt as React components:** home hero, project listing, project detail
  (banner + specs + read-more + gallery + related), header/menu, footer.
- **Content-driven from WordPress:** the Office / dsgn Archive / Privacy /
  Legal pages render whatever is in the WordPress page editor (`content.rendered`).
  Paste the matching sections from `../elementor/sections/` into those pages to
  reproduce them exactly, or rebuild them as components later.

The home hero shows **featured** projects (the `dsgn_featured` meta flag) after
the fixed welcome slide. Edit the welcome slide copy in `src/lib/config.ts`.

---

## 4. Editing without touching core code

- **Projects / images / menus** → wp-admin (Projects, Menus, Media Library).
- **Header/footer text** → WordPress options (see `../dsgn-headless/README.md`).
- **Home welcome slide copy** → `src/lib/config.ts`.

---

## 5. Notes / next steps

- **Smooth scroll** is Lenis (see `SmoothScroll.tsx`); remove it from the layout
  if you don't want it.
- **GSAP entrance/parallax animations** from the original are not yet ported —
  the hero slider (Swiper), duotone hover and read-more all work.
- **WooCommerce** is not wired up here; the `/shop/` catch-all would need the
  WooCommerce REST API (`/wp-json/wc/v3/products`) + a product page.

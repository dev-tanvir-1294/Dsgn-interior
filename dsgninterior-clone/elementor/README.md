# dsgn interior — Elementor conversion kit

Everything here is ready to drop into WordPress + Elementor. It is derived from the
pixel-accurate static clone in `../mirror/`, with lazy-loading already "activated"
so the markup renders correctly **without** the original JavaScript.

---

## 1. What you get

| File / folder | Purpose |
|---|---|
| `dsgn-styles.css` | The site's **entire stylesheet** (design system, layout, components). Enqueue globally. |
| `dsgn-standalone.css` | Small override so blocks look right **without** the site JS (the original hides content until JS fades it in). Enqueue right after the stylesheet. |
| `dsgn-app.js` | The original interaction bundle (**Swiper** slider, GSAP parallax, Lenis smooth scroll, menu, read-more). **Optional** — only needed for the animated home slider and scroll effects. |
| `fonts/` | Cera Pro webfonts. `dsgn-styles.css` already points at `./fonts/` — keep the two together. |
| `pages/*.html` | One **complete page** block per template (header + content + footer). Paste one into a single Elementor **HTML widget** for a like-for-like page. |
| `sections/<template>/NN-*.html` | The same pages split into **individual sections** (paste one widget per section). |
| `preview/*.html` | Open these in a browser to see each template of blocks rendered on its own. |
| `sections-index.json` | Machine-readable list of every section. |

---

## 2. Template → WordPress page map

| Kit template | Live pages | Suggested WP page |
|---|---|---|
| `home` | `/en`, `/sv` | Front page |
| `works` | `/en/projects`, `/sv/projekt` | Projects (archive) |
| `work` | `/en/projects/<slug>` (×11) | Single project template |
| `archive` | `/en/dsgn-archive`, `/sv/dsgn-archive` | dsgn Archive |
| `office` | `/en/office`, `/sv/kontor` | Office / About |
| `default` | `/en/privacy-policy`, `/en/legal-notice` | Text pages |

Each template's sections, in order:

- **home** — `01-header` · `02-home-banners` · `03-footer`
- **works** — `01-header` · `02-sr` (page intro) · `03-works-grid` · `04-footer`
- **work** — `01-header` · `02-banner` (hero) · `03-work-texts` (specs + body + Read more) · `04-work-gallery` · `05-work-credits` · `06-work-related` · `07-footer`
- **archive** — `01-header` · `02-archives-header` · `03-archives-grid` · `04-footer`
- **office** — `01-header` · `02-sr` · `03-section-presentation` · `04-section-team` · `05-section-services` · `06-section-process` · `07-section-contact` · `08-footer`
- **default** — `01-header` · `02-default-header` · `03-page-content` · `04-footer`

---

## 3. Recommended workflow (fastest path to pixel-perfect)

1. **Enqueue the stylesheet once, site-wide.** Add to a child theme's `functions.php`:

   ```php
   add_action('wp_enqueue_scripts', function () {
       wp_enqueue_style('dsgn', get_stylesheet_directory_uri() . '/dsgn/dsgn-styles.css', [], null);
       wp_enqueue_style('dsgn-standalone', get_stylesheet_directory_uri() . '/dsgn/dsgn-standalone.css', ['dsgn'], null);
       // OPTIONAL — only if you want the animated slider / scroll effects:
       // wp_enqueue_script_module('dsgn', get_stylesheet_directory_uri() . '/dsgn/dsgn-app.js', [], null);
   });
   ```

   Upload `elementor/` (the CSS, the `fonts/` folder, and optionally `dsgn-app.js`) into your
   child theme as `/dsgn/`. The stylesheet already points at `./fonts/`, so keep them together.

2. **Build a page:** Elementor → add an **HTML widget** → paste `pages/<template>.html`.
   Do this once per WordPress page using the matching template
   (e.g. paste `pages/home.html` into your front page).

   > Prefer finer control? Paste each file in `sections/<template>/` into its own HTML widget
   > instead — same result, more editable blocks.

3. **Point the images at WordPress.** All blocks reference images as `/media/…`
   (mirroring the original site structure). Choose one:
   - **Simplest:** upload the whole `mirror/media/` folder to your web root so `/media/…` resolves, **or**
   - **Proper:** import images into the WP Media Library and search-replace `/media/` with
     your uploads URL (e.g. `https://yoursite.se/wp-content/uploads/`), **or**
   - drop each image into an Elementor Image widget and let Elementor serve its own sizes.

4. **Test at 1440px, 768px and 390px** against `../mirror/` (the reference).

---

## 4. Things worth knowing

- **Fonts.** Cera Pro, weights 400 / 500 / 700, bundled in `fonts/`. Don't rename the files —
  the CSS references them by exact name.
- **`dsgn-standalone.css` matters.** The original page keeps `.home-banners`, the header, the
  footer and hero images at `opacity:0` until the site JS adds classes. That override forces
  them visible. Without it, pasted blocks look empty.
- **The home hero is a Swiper slider.** As static HTML only the first slide shows. To get the
  full rotating slider, enqueue `dsgn-app.js` **and** keep the `.home-banners > .swiper-wrapper >
  .swiper-slide` structure intact. If you'd rather not run the bundle, rebuild the hero with an
  Elementor slider/carousel instead — the first-slide markup alone is a valid static hero.
- **Layout root classes.** Section widgets expect the page wrappers from `pages/*.html`
  (`div.page.page-home`, `…page-works`, `…page-work`, `…page-archives`, `…page-office`,
  `…page-default`, plus the inner `<main>`). If you rebuild pieces manually, keep those wrappers —
  the CSS keys off them.
- **Header & footer** are repeated in every `pages/*.html` and as `01-header` / last section in
  `sections/`. If you use Elementor's Theme Builder for the header/footer, delete those two
  sections from the page block to avoid duplication.
- **Hover behaviour is intentional.** Project cards use a duotone effect: grayscale by default
  (`.img-gray`), full colour on hover (`.img-color`).
- **Analytics was removed.** The Google Analytics snippet from the original site is not included.

---

## 5. Preview the blocks

Open any file in `preview/` directly in a browser (they reference `../mirror/` for assets), or
serve the project root:

```
node ../serve.mjs        # then open http://localhost:8080/
```

`preview/` shows what each template's blocks look like **without** the site JS — i.e. exactly
what you'll see after pasting them into Elementor with the two stylesheets enqueued.

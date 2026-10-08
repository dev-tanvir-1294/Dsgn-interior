# dsgn interior — WordPress theme

A complete, installable WordPress theme that reproduces the dsgn interior site —
design, fonts, GSAP + Lenis smooth scroll, Swiper hero, and WooCommerce — so you
can install it and get the site as it looks now, then customise everything easily.

The interaction bundle (`assets/dsgn-app.js`) already contains **Swiper**, **GSAP**
and **Lenis**, so the animations and smooth scrolling work out of the box.

---

## 1. What's inside

```
dsgn-theme/
├─ style.css            # theme header (WordPress reads this to register the theme)
├─ functions.php        # enqueues CSS/JS/fonts, menus, WooCommerce support
├─ header.php           # fixed header (logo + primary menu + language switch)
├─ footer.php           # footer (contacts, address, logo, socials, legal)
├─ front-page.php       # the home page — full-screen Swiper hero (7 slides)
├─ page.php             # static pages (Elementor content renders here)
├─ single.php           # single posts
├─ archive.php          # blog/category/tag/date archives
├─ 404.php              # not-found page
├─ woocommerce.php      # wraps WooCommerce output in <main>
├─ index.php            # fallback template
├─ archive-project.php  # Projects grid (custom post type)
├─ single-project.php   # single Project page
└─ assets/
   ├─ dsgn-styles.css        # the full design system (enqueued)
   ├─ dsgn-standalone.css    # no-JS visibility fallback (enqueued)
   ├─ dsgn-woocommerce.css   # WooCommerce skin (enqueued only if WooCommerce is active)
   ├─ dsgn-projects.css      # project-card styles (grayscale -> colour hover)
   ├─ dsgn-app.js            # Swiper + GSAP + Lenis + menu (enqueued)
   ├─ fonts/                 # Cera Pro 400 / 500 / 700
   └─ media/                 # all site images + videos (bundled, served from the theme)
```

---

## 2. Requirements

- WordPress **6.0+** (works on older; no ES-module requirement — the JS is a plain script)
- PHP **7.4+**
- Optional but recommended: **Elementor** (to build the inner pages)
- Optional: **WooCommerce** (for the shop — the skin loads automatically)

---

## 3. Install

1. Zip the `dsgn-theme/` folder → `dsgn-theme.zip`.
2. WP Admin → **Appearance → Themes → Add New → Upload Theme** → upload the zip → **Activate**.
3. Set permalinks: **Settings → Permalinks → Post name** → Save. This makes the
   clean URLs (`/shop/`, `/projects/`, …) work.
4. **The home page now shows automatically** — `front-page.php` is used for the
   site front, so the hero slider appears on install.

> **Images/videos are bundled** in `assets/media/` and served directly from the
> theme — no separate upload needed. Every `/media/…` reference is rewritten to the
> theme's media folder automatically. To host the media elsewhere, set the base URL
> once in `wp-config.php`:
>
> ```php
> define( 'DSGN_MEDIA_URL', 'https://cdn.yoursite.com/media/' );
> ```
>
> ⚠️ The bundled media is ~300 MB — fine for local/dev, but for production you may
> prefer to delete `assets/media/` and set `DSGN_MEDIA_URL` to an external host/CDN
> instead of shipping it inside the theme.

---

## 4. Customise

### Menu (easiest)
- **Appearance → Menus** → create a menu → assign it to **Primary menu**.
- Until you do, a fallback menu (Shop / Projects / dsgn Archive / Office) is shown.
- The `.active` class is added to the current page automatically.

### Header / footer text
- Contact email, phone, address, socials, legal links → edit `footer.php`.
- Logo → the `.header-logo` markup in `header.php`.

### Home hero (slides)
- Edit `front-page.php` — each slide is a `<header>` or `<a class="banner swiper-slide">`
  block. Change the title, description, and the image `srcset` to add/remove slides.
- Keep the `.swiper-wrapper > .swiper-slide` structure and the `data-swiper-parallax`
  / `data-scroll-parallax` attributes so the Swiper + GSAP animations keep working.

### Inner pages (Projects, dsgn Archive, Office, …)
- Build them with **Elementor** and paste the **content sections** from the
  `elementor/sections/` folder (e.g. `02-sr`, `03-works-grid`) into Elementor
  HTML widgets. The theme already provides the header + footer + CSS/JS, so paste
  the *sections*, not the full `pages/*.html` (those include their own header/footer).

### Projects (custom post type — easiest way to add images)
The theme registers a **Projects** post type, so you don't need to hand-edit HTML
or deal with `/media/` paths for project images:

1. **WP Admin → Projects → Add New** — enter the title, description, and set a
   **Featured image** (upload it straight to the Media Library).
2. Projects automatically appear in a grid at **`/projects/`** (`archive-project.php`),
   and each project has its own page at **`/projects/<slug>/`** (`single-project.php`).
3. Card images use the same 3:4 ratio and grayscale-to-colour hover as the site.

> **Note:** after activating the theme (or registering a post type), go to
> **Settings → Permalinks → Save** once so the new `/projects/` URLs take effect.

### Shop
- Install & activate **WooCommerce**, then run **WooCommerce → Status → Tools →
  Create default WooCommerce pages**. The shop, product, cart and checkout pages
  are styled automatically by `assets/dsgn-woocommerce.css`.
- Add products under **Products → Add New**.

---

## 5. How the design & animations work

- **Design** → `assets/dsgn-styles.css` (Cera Pro, text `#594037`, bg `#F6F5F4`,
  accent `#E68762`). Same file as the `elementor/` kit, so rendering is identical.
- **Smooth scroll** → Lenis (bundled in `assets/dsgn-app.js`).
- **Entrance animations & parallax** → GSAP (bundled).
- **Home hero slider** → Swiper (bundled).
- The header/footer are revealed by the JS adding an `is-rendering` class to `<html>`;
  `dsgn-standalone.css` is a no-JS fallback for the home page.

Because the theme uses the *same* CSS, JS and markup as the `mirror/` reference,
the behaviour matches as long as the markup structure is preserved when editing.

---

## 6. Relationship to the other folders

| Folder | Role |
|---|---|
| `dsgn-theme/` | This installable WordPress theme (shell + home hero + CSS/JS + WooCommerce). |
| `elementor/` | The conversion kit — paste its **sections** into Elementor pages. |
| `shop/` | The WooCommerce skin + shop blocks (already folded into `assets/dsgn-woocommerce.css` here). |
| `mirror/` | The static reference — upload `mirror/media/` to your web root for images. |

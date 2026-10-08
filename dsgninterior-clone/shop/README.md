# dsgn interior — Shop (WooCommerce + Elementor)

A ready-to-install shop kit that turns the dsgn interior design into a working
**WooCommerce** store, skinned to match the rest of the site. Drop it into your
WordPress + Elementor setup and you can sell products without losing the design.

> **How it works:** WooCommerce is the *engine* — products, cart, checkout, payments,
> shipping, stock. This kit is the *skin and wiring*: it makes all of that look like
> dsgn interior (Cera Pro, warm paper background, warm brown text, terracotta accent)
> and gives you paste-ready Elementor blocks.

---

## 1. What's in this folder

| File / folder | Purpose |
|---|---|
| `functions.php` | Paste-ready PHP: declares WooCommerce support and enqueues the stylesheets. |
| `dsgn-woocommerce.css` | The WooCommerce skin (product grid, buttons, cart, checkout, notices, forms). Enqueue **after** `dsgn-styles.css` and WooCommerce's own CSS. |
| `blocks/header.html` | Site header with a **Shop** link added to the menu. |
| `blocks/footer.html` | Site footer (identical to the `elementor/` kit). |
| `blocks/shop-intro.html` | Page intro ("Shop" + tagline), matching the `sr` intro pattern. |
| `blocks/product-grid.html` | Reference markup for one product card — shows the target look. |
| `preview/shop.html` | Static preview of the shop grid. Open in a browser to see the intended style. |

It is designed to sit next to the existing conversion kit, which supplies
`dsgn-styles.css`, `dsgn-standalone.css`, `dsgn-app.js` and the Cera Pro `fonts/`.
See `../elementor/README.md` for that part.

---

## 2. Prerequisites

- WordPress installed
- **WooCommerce** plugin (active) — this is what actually sells products
- Elementor (active) — for building the pages
- The dsgn design system enqueued from `../elementor/` (see step 3)

---

## 3. Install — step by step

### Step 1 · Upload the assets

Copy the whole `elementor/` kit (the CSS, the `fonts/` folder, and optionally
`dsgn-app.js`) into your child theme as `/dsgn/`, as described in
`../elementor/README.md`. Then add **this** folder's two files next to them:

```
your-child-theme/
└─ dsgn/
   ├─ dsgn-styles.css
   ├─ dsgn-standalone.css
   ├─ dsgn-app.js            (optional)
   ├─ fonts/
   ├─ dsgn-woocommerce.css   ← from this folder
   └─ functions.php          ← paste into your child theme's functions.php
```

### Step 2 · Wire up `functions.php`

Paste the contents of `shop/functions.php` into your child theme's `functions.php`
(or `require` the file). It does three things:

1. Declares WooCommerce theme support.
2. Enqueues `dsgn-styles.css`, `dsgn-standalone.css`, then `dsgn-woocommerce.css` — in that order.
3. (Optional) enqueues the interaction bundle for the animated slider.

### Step 3 · Let WooCommerce create its pages

In WP admin: **WooCommerce → Status → Tools → Create default WooCommerce pages**
if they don't already exist. This gives you `/shop`, `/cart`, `/checkout`, and
`/my-account` — the pages the engine needs. (You can rename/set them under
**WooCommerce → Settings → Advanced**.)

### Step 4 · Add "Shop" to the menu

Use the paste-ready `blocks/header.html` (it already includes a Shop link), or
add the Shop page to your existing menu in **Appearance → Menus**. Keep the
header/footer consistent by reusing the blocks from the main `elementor/` kit.

### Step 5 · Build the shop page

- **Header / footer:** reuse `blocks/header.html` and `blocks/footer.html`
  (or Elementor's Theme Builder, as you did for the rest of the site).
- **Intro:** paste `blocks/shop-intro.html` into an Elementor **HTML widget**.
- **Products:** do **not** paste a static grid — the products are dynamic. Use one of:
  - the **WooCommerce "Products" widget** in Elementor, **or**
  - an Elementor **Shortcode widget** with `[products limit="12" columns="4"]`, **or**
  - the Gutenberg **"Products (Beta)"** block if you build that page in Gutenberg.

The CSS in `dsgn-woocommerce.css` already skins whatever WooCommerce outputs, so
whichever method you pick, the result matches the design. `blocks/product-grid.html`
is only a *reference* so you can see the intended card markup.

### Step 6 · Add products

**Products → Add New** for each item you sell: title, description, price,
product image, stock, and (for physical goods) weight/dimensions for shipping.
WooCommerce handles the catalog, search, category pages, and single-product pages.

### Step 7 · Configure payments & shipping

- **WooCommerce → Settings → Payments** — enable Stripe, Klarna, PayPal, bank transfer, etc.
- **WooCommerce → Settings → Shipping** — zones, rates, and methods.
- **WooCommerce → Settings → Tax** — tax rates (Sweden = 25 % VAT by default for most goods).

---

## 4. Design notes

- **Design tokens** used by the skin (defined in `dsgn-styles.css` `:root`):
  - Text `#594037` (warm brown) · Background `#F6F5F4` (warm paper) · Accent `#E68762` (terracotta)
  - Font **Cera Pro** (400 / 500 / 700)
- **Product cards** use the same 3:4 image ratio as the project cards, with a
  grayscale-to-colour hover (echoing the site's duotone effect). No JS required —
  it's pure CSS `filter`.
- **Buttons** are minimal: transparent with a 1px text-colour border; hover fills
  with the text colour. The primary "Add to cart" / "Place order" buttons are solid,
  and turn terracotta on hover.
- **The skin assumes WooCommerce's own CSS loads first** so these rules win.
  If you disable WooCommerce's styles (some themes do), the skin still covers the
  main pieces, but test the cart/checkout carefully.
- **Images:** the kit's other pages reference `/media/…`. For products, upload
  product images through the normal **WooCommerce product image** field — WooCommerce
  generates and serves its own sizes, so no path fixing is needed for the shop.

---

## 5. Test

- **1440px, 768px, 390px** — the grid collapses 4 → 3 → 2 → 1 columns.
- Check `/shop`, a single product, add-to-cart, `/cart`, and `/checkout`.
- Compare against `preview/shop.html` for the intended look.

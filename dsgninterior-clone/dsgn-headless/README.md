# dsgn interior — Headless WordPress child theme

A child theme of **Hello Elementor** that turns WordPress into a content backend
for the separate **Next.js** frontend (see `../frontend/`). The public site is
rendered by Next.js; WordPress only serves structured data over the REST API.

---

## 1. Install

1. Install and activate the **Hello Elementor** parent theme (this theme is a
   child of it). If you don't want the parent, delete the `Template:` line in
   `style.css` to use it standalone.
2. Zip this folder → `dsgn-headless.zip`.
3. WP Admin → **Appearance → Themes → Add New → Upload Theme** → upload → **Activate**.
4. **Settings → Permalinks → Post name → Save** (registers the `/projects/` rewrite).
5. Create a menu in **Appearance → Menus** and assign it to **Primary menu**.

---

## 2. What it exposes (REST API)

| Endpoint | Returns |
|---|---|
| `GET /wp-json/wp/v2/projects` | All projects (title, excerpt, content, meta, `dsgn_media`). |
| `GET /wp-json/wp/v2/projects?slug=…` | A single project. |
| `GET /wp-json/wp/v2/pages?slug=…` | A WordPress page (for office/archive/legal/…). |
| `GET /wp-json/dsgn/v1/menu` | The primary menu as a flat list. |
| `GET /wp-json/dsgn/v1/site` | Site name + header/footer text (editable options). |

### Project fields

Each project returns its title, editor content, excerpt, featured image
(cover) and this structured meta (editable in the block editor):

- `dsgn_location` — e.g. "Malmö, Sweden"
- `dsgn_area` — e.g. "900"
- `dsgn_year` — e.g. "2024"
- `dsgn_photo_credit` — e.g. "Photo: Andrea Papini"
- `dsgn_featured` — boolean; featured projects appear in the home hero slider
- `dsgn_gallery` — array of attachment IDs (the detail-page gallery)

The `dsgn_media` field resolves the cover + gallery to URLs with their
registered image sizes, so the frontend can build responsive `srcset`s.

---

## 3. Front-end redirect (optional)

To send the public site to Next.js, add to `wp-config.php`:

```php
define( 'DSGN_FRONTEND_URL', 'https://app.yoursite.se' );
```

The request path is preserved (`/projects/tarsier/` → `https://app.yoursite.se/projects/tarsier/`),
so Next.js handles routing. Without the constant, WordPress renders normally
(useful for previewing the REST data).

---

## 4. Editing site text without code

Header/footer text comes from options with defaults baked in. Change them via
`wp-cli`:

```bash
wp option update dsgn_contact_email "hello@yoursite.se"
wp option update dsgn_phone "+46 040 26 26 40"
wp option update dsgn_address_line_1 "Tessins väg 14"
wp option update dsgn_address_line_2 "217 58 Malmö"
wp option update dsgn_instagram "https://www.instagram.com/you/"
wp option update dsgn_linkedin "https://www.linkedin.com/company/you/"
```

Menus, projects and their images are all managed in wp-admin — nothing is
hardcoded in the frontend.

---

## 5. CORS

Permissive CORS headers are added to the REST API. The Next.js app fetches
server-side (no CORS needed), but this keeps client-side/dev calls working.

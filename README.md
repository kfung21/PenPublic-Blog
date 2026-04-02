# PenPublic Blog Update — April 2026

## What Changed

### `.vitepress/config.mjs` (REPLACE)
Auto-discovering config. Scans root for folders with `index.md` and builds nav + sidebar dynamically.

### `Pensions/` (NEW FOLDER — copy entire folder)
- `index.md` — Section landing page
- `california.md` — Main CA pensions overview (systems, history, bargaining, MOUs)
- `california-formulas.md` — Dedicated formula reference (CalPERS, CalSTRS, PEPRA)
- `Retirement-Benefits-at-CSU-and-UC-Systems.md` — CSU/UC retirement eligibility

### `API/index.md` (NEW FILE — copy into API/)
Renamed from `api-home.md` with frontmatter added. 
**After confirming it works, DELETE the old `API/api-home.md`** to avoid a duplicate sidebar entry.

## How Auto-Discovery Works

1. Drop a folder anywhere in the root
2. Add an `index.md` with frontmatter (at minimum: `title`)
3. Add `.md` files — they become sidebar items automatically
4. No config edits needed

### Frontmatter Controls

In any `index.md`:
- `title: My Section` — display name in nav
- `order: 2` — position in nav (lower = further left)  
- `nav: false` — hide this folder from nav entirely

In any `.md` file:
- `sidebar: false` — hide this file from the sidebar

## What NOT to Touch
- `posts/` and `blog/` folders are excluded from auto-discovery
- Blog system (`<BlogList />`, `posts.data.js`, `transformPageData`) is unchanged
- `about.md` and `faqs.md` are still manually wired in the config

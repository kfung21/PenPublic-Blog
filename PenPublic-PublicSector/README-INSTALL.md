# PenPublic — Public Sector Section (drop-in)

Copy over your project root, then RESTART the dev server (`npm run docs:dev`).

    PublicSector/
      index.md                              section landing page (dropdown: true)
      why-public-sector.md                  nav label: "Why the Public Sector"
      public-sector-faqs.md                 nav label: "FAQs"

    .vitepress/
      config.mjs                            REPLACE
      theme/index.js                        REPLACE (registers NavGroupLink)
      theme/components/NavGroupLink.vue     NEW

## Result

    Public Sector          <- click goes to /PublicSector/
      Why the Public Sector    <- appears on hover
      FAQs                     <- appears on hover

## The duplicate "Public Sector" in your navbar

Two folders in your project root both resolve to the title "Public Sector" --
almost certainly a leftover "Public Sector" (with a space) sitting next to
"PublicSector". Auto-discovery adds one navbar entry per folder.

This config now collapses the duplicate and prints the offending folder name
on startup, e.g.:

    [nav] Duplicate navbar entry "Public Sector" produced by two folders:
    "PublicSector" and "Public Sector". Showing "PublicSector".
    Delete the folder "Public Sector" from your project root.

Delete the folder it names. Until you do, the stray folder still builds pages
at its own URL even though it no longer shows in the navbar.

To list every folder feeding the navbar, run this in your project root:

    node -e "const fs=require('fs');fs.readdirSync('.').filter(f=>fs.statSync(f).isDirectory()&&fs.existsSync(f+'/index.md')).forEach(d=>console.log(JSON.stringify(d),(fs.readFileSync(d+'/index.md','utf8').match(/^title:.*/m)||[''])[0]))"

Quoted names make a stray space visible.

## What changed in config.mjs

1. buildSidebarItems() reads `navText` before `title`, so a page can show a
   short label in the nav and sidebar while keeping a longer page title:

       text: fm.navText || fm.title || fileNameToTitle(file)

2. autoDiscover() emits a NavGroupLink component entry for folders whose
   index.md has `dropdown: true`. Fires only on opt-in, so Pensions, API and
   California are untouched.

3. Duplicate navbar titles are collapsed with a console warning naming both
   folders.

## Why NavGroupLink exists

VitePress's built-in nav dropdown renders its label as a <button>, so there is
nothing to click -- and an item carrying both `link` and `items` is rendered as
a plain link with the dropdown discarded. NavGroupLink is wired in through the
supported `{ component, props }` nav item shape, so no VitePress internals are
patched. It renders an <a> for the label plus a hover/focus flyout styled with
the theme's own CSS variables.

Mobile: touch has no hover, so the flyout is hidden below 768px and the label
behaves as a normal full-width link to the landing page -- which lists both
pages. That is why PublicSector/index.md is worth keeping.

## Frontmatter reference

Folder index.md:
    title       nav label for the section
    order       position in the navbar (lower = further left)
    dropdown    true to render as a clickable group with a hover menu
    nav         false to hide the folder entirely

Any page .md:
    title       page title (browser tab, search index)
    navText     optional short label for nav and sidebar only
    order       position within the dropdown and sidebar
    sidebar     false to hide the page

## Note

autoDiscover() scans the filesystem once at config load, so a running dev
server will not notice a new folder. Restart it.

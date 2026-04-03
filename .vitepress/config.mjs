import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ─── Filesystem auto-discovery ─────────────────────────────────────
// Scans the project root for folders and .md files, then builds
// nav and sidebar automatically. Drop a folder with an index.md
// and it shows up everywhere — no config edits needed.

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Folders to never include in auto-generated nav/sidebar
const IGNORED_DIRS = new Set([
  'node_modules', '.vitepress', 'public', 'dist',
  'posts', 'blog',  // blog handled separately
])

/**
 * Parse frontmatter from a markdown file.
 * Returns an object with title, sidebar, nav, order, etc.
 */
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) return {}

    const fm = {}
    match[1].split(/\r?\n/).forEach(line => {
      const idx = line.indexOf(':')
      if (idx === -1) return
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()

      // Handle booleans
      if (val === 'true') val = true
      else if (val === 'false') val = false
      // Handle numbers
      else if (/^\d+$/.test(val)) val = parseInt(val, 10)
      // Handle arrays like ['tag1', 'tag2']
      else if (val.startsWith('[') && val.endsWith(']')) {
        try { val = JSON.parse(val.replace(/'/g, '"')) } catch {}
      }
      // Strip surrounding quotes
      else if ((val.startsWith("'") && val.endsWith("'")) ||
               (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1)
      }

      fm[key] = val
    })
    return fm
  } catch {
    return {}
  }
}

/**
 * Convert a filename like "water-districts.md" into "Water Districts"
 */
function fileNameToTitle(name) {
  return name
    .replace(/\.md$/, '')
    .replace(/^index$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}_/, '') // strip date prefix
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bApi\b/g, 'API')
    .replace(/\bMpo\b/g, 'MPO')
    .replace(/\bFaq\b/g, 'FAQ')
    .trim()
}

/**
 * Get a display title for a markdown file.
 * Priority: frontmatter title > filename conversion
 */
function getTitle(filePath, fileName) {
  const fm = parseFrontmatter(filePath)
  return fm.title || fileNameToTitle(fileName)
}

/**
 * Scan a directory and return sorted sidebar items.
 * Respects frontmatter: sidebar: false to exclude,
 * and order: N to control sort position.
 */
function buildSidebarItems(dirPath, dirName) {
  const files = fs.readdirSync(dirPath).filter(f =>
    f.endsWith('.md') && f !== 'index.md'
  )

  return files
    .map(file => {
      const filePath = path.join(dirPath, file)
      const fm = parseFrontmatter(filePath)

      // Skip if frontmatter says sidebar: false
      if (fm.sidebar === false) return null

      return {
        text: fm.title || fileNameToTitle(file),
        link: `/${dirName}/${file.replace(/\.md$/, '')}`,
        order: typeof fm.order === 'number' ? fm.order : 999,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order || a.text.localeCompare(b.text))
    .map(({ text, link }) => ({ text, link })) // strip order from output
}

/**
 * Auto-discover all content directories and build nav + sidebar.
 */
function autoDiscover() {
  const nav = []
  const sidebar = {}

  // ── Scan top-level directories ──
  const dirs = fs.readdirSync(ROOT).filter(name => {
    if (IGNORED_DIRS.has(name)) return false
    if (name.startsWith('.')) return false
    const stat = fs.statSync(path.join(ROOT, name))
    return stat.isDirectory()
  })

  for (const dirName of dirs) {
    const dirPath = path.join(ROOT, dirName)
    const indexPath = path.join(dirPath, 'index.md')

    // Skip folders without an index.md
    if (!fs.existsSync(indexPath)) continue

    const indexFm = parseFrontmatter(indexPath)

    // Skip if frontmatter says nav: false
    if (indexFm.nav === false) continue

    const title = indexFm.title || fileNameToTitle(dirName)
    const sidebarItems = buildSidebarItems(dirPath, dirName)

    // ── Build nav entry ──
    // If the folder has sub-pages, make it a dropdown
    if (sidebarItems.length > 0) {
      nav.push({
        text: title,
        link: `/${dirName}/`,
        activeMatch: `/${dirName}/`,
        _order: typeof indexFm.order === 'number' ? indexFm.order : 999,
      })
    } else {
      // Folder with only index.md — simple link
      nav.push({
        text: title,
        link: `/${dirName}/`,
        _order: typeof indexFm.order === 'number' ? indexFm.order : 999,
      })
    }

    // ── Build sidebar entry ──
    sidebar[`/${dirName}/`] = [
      {
        text: title,
        link: `/${dirName}/`,
        items: sidebarItems,
      }
    ]
  }

  // Sort nav by frontmatter order, then alphabetically
  nav.sort((a, b) => a._order - b._order || a.text.localeCompare(b.text))

  // Strip internal _order field
  nav.forEach(item => delete item._order)

  return { nav, sidebar }
}

// ─── Generate nav and sidebar ──────────────────────────────────────
const { nav: autoNav, sidebar: autoSidebar } = autoDiscover()

// ─── Final config ──────────────────────────────────────────────────
export default defineConfig({
  title: 'PenPublic',
  description: 'The Career Platform for Public Sector Workers',
  base: '/',

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900&family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&display=swap', rel: 'stylesheet' }],
  ],

  outline: {
    level: [2, 3],
    label: 'On this page'
  },

  lastUpdated: true,

  themeConfig: {
    siteTitle: 'PenPublic',
    logo: {
      src: 'https://pub-e046c9c0db1744fd96ceb26cb69378ad.r2.dev/PP%20Logo.svg',
      alt: 'PenPublic',
      link: '/'
    },

    nav: [
      { text: 'PenPublic Jobs', link: 'https://penpublic.com', target: '_self' },
      { text: 'Blog', link: '/posts/' },
      // ── Auto-discovered sections injected here ──
      ...autoNav,
      { text: 'About', link: '/about' },
    ],

    sidebar: {
      // ── Blog (manually wired to posts/ content loader) ──
      '/posts/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/posts/' },
          ]
        }
      ],

      // ── Auto-discovered sidebars injected here ──
      ...autoSidebar,

      // ── Pensions: manual override for structured sidebar ──
      '/Pensions/': [
        {
          text: 'Start Here',
          items: [
            { text: '📋 Pensions FAQ & 101', link: '/Pensions/pensions-faq' },
          ]
        },
        {
          text: 'California',
          collapsed: false,
          items: [
            { text: 'Pension Systems', link: '/Pensions/california' },
            { text: 'Pension Formulas', link: '/Pensions/california-formulas' },
            { text: 'CSU & UC Retirement', link: '/Pensions/Retirement-Benefits-at-CSU-and-UC-Systems' },
          ]
        },
        {
          text: 'New York',
          collapsed: false,
          items: [
            { text: 'Pension Systems', link: '/Pensions/new-york' },
            { text: 'Pension Formulas', link: '/Pensions/new-york-formulas' },
          ]
        },
        {
          text: 'D.C. & Federal',
          collapsed: false,
          items: [
            { text: 'Pension Systems', link: '/Pensions/dc-federal' },
            { text: 'Pension Formulas', link: '/Pensions/dc-federal-formulas' },
          ]
        },
        {
          text: 'Retirement Tools — Guides',
          collapsed: false,
          items: [
            { text: 'Calculators Guide', link: '/Pensions/calculators-guide' },
            { text: 'Compare Guide', link: '/Pensions/compare-guide' },
            { text: 'Projections Guide', link: '/Pensions/projections-guide' },
          ]
        },
      ],

      // ── Static pages ──
      '/about': [
        {
          text: 'About',
          items: [
            { text: 'About PenPublic', link: '/about' },
            { text: 'FAQs', link: '/faqs' },
          ]
        }
      ],
      '/faqs': [
        {
          text: 'About',
          items: [
            { text: 'About PenPublic', link: '/about' },
            { text: 'FAQs', link: '/faqs' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'youtube', link: 'https://youtube.com/@penpublic' },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      }
    },

    editLink: false,

    footer: {
      message: 'The career platform that converts America\'s workforce to public sector careers.',
      copyright: '© 2025-2026 PenPublic'
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },
  },

  async transformPageData(pageData) {
    if (pageData.relativePath?.startsWith('posts/')) {
      try {
        const { createContentLoader } = await import('vitepress')
        const posts = await createContentLoader('posts/*.md', {
          excerpt: true,
          render: true
        }).load()

        const filteredPosts = posts.filter(post =>
          !post.url.endsWith('index.html') && !post.url.endsWith('/')
        )

        const tags = new Map()
        filteredPosts.forEach(post => {
          const postTags = post.frontmatter.tags || []
          postTags.forEach(tag => {
            if (!tags.has(tag)) {
              tags.set(tag, [])
            }
            tags.set(tag, [...tags.get(tag), post])
          })
        })

        pageData.posts = filteredPosts.sort((a, b) => {
          return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
        })

        pageData.tags = Object.fromEntries(tags)
      } catch (e) {
        console.error('Error processing blog posts:', e)
        pageData.posts = []
        pageData.tags = {}
      }
    }
  }
})

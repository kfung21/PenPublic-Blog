import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PenPublic',
  description: 'The Career Platform for Public Sector Workers',
  base: '/',

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900&family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&display=swap', rel: 'stylesheet' }],
  ],

  // Show "On this page" outline for ## and ### headers
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
      { text: 'PenPublic Jobs', link: 'https://penpublic.com' },
      { text: 'Blog', link: '/posts/' },
      {
        text: 'Careers Wiki',
        items: [
          { text: 'California Overview', link: '/California/' },
          { text: 'Cities', link: '/California/cities' },
          { text: 'Counties', link: '/California/counties' },
          { text: 'State Agencies', link: '/California/agencies' },
          { text: 'Federal Agencies', link: '/California/agencies-fed' },
        ]
      },
      { text: 'About', link: '/about' },
    ],

    sidebar: {
      '/posts/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/posts/' },
          ]
        }
      ],

      '/California/': [
        {
          text: 'California',
          link: '/California/',
          items: [
            { text: 'Cities', link: '/California/cities' },
            { text: 'Counties', link: '/California/counties' },
          ]
        },
        {
          text: 'State & Federal',
          collapsed: false,
          items: [
            { text: 'State Agencies', link: '/California/agencies' },
            { text: 'Federal Agencies', link: '/California/agencies-fed' },
          ]
        },
        {
          text: 'Transportation & Infrastructure',
          collapsed: false,
          items: [
            { text: 'Transportation', link: '/California/transportation' },
            { text: 'MPOs', link: '/California/MPO' },
            { text: 'Ports', link: '/California/ports' },
          ]
        },
        {
          text: 'Water & Environment',
          collapsed: false,
          items: [
            { text: 'Water Districts', link: '/California/water-districts' },
            { text: 'Irrigation Districts', link: '/California/irrigation-districts' },
            { text: 'Sanitation Districts', link: '/California/sanitation-districts' },
            { text: 'Environmental', link: '/California/environmental' },
            { text: 'Mosquito Districts', link: '/California/mosquito-districts' },
          ]
        },
        {
          text: 'Utilities & Services',
          collapsed: false,
          items: [
            { text: 'Utilities', link: '/California/utilities' },
            { text: 'Fire Districts', link: '/California/fire-districts' },
            { text: 'Housing Authorities', link: '/California/housing' },
            { text: 'Parks & Recreation', link: '/California/parks-and-recreation' },
            { text: 'Community Services', link: '/California/community-service' },
            { text: 'Cemetery Districts', link: '/California/cemetery' },
            { text: 'Special Districts', link: '/California/special-districts' },
          ]
        },
        {
          text: 'Education & Health',
          collapsed: false,
          items: [
            { text: 'School Districts', link: '/California/schools' },
            { text: 'Other Education', link: '/California/education-other' },
            { text: 'Medical', link: '/California/medical' },
          ]
        },
      ],

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

// .vitepress/theme/posts.data.js
import { createContentLoader } from 'vitepress'

// Using ESM export syntax
export default createContentLoader('posts/*.md', {
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('index.html'))
      .sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
      })
  }
})

// Export the data for use in components
export const data = createContentLoader('posts/*.md', {
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('index.html'))
      .sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
      })
  }
})
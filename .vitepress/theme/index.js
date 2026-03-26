// .vitepress/theme/index.js
import { h, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogList from './components/BlogList.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {})
  },
  enhanceApp({ app, router, siteData }) {
    app.component('BlogList', BlogList)

    // Redirect logo/title click to main site
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        const titleLink = document.querySelector('.VPNavBarTitle a')
        if (titleLink) {
          titleLink.href = 'https://penpublic.com'
        }
      }
    }
  }
}
// .vitepress/theme/index.js
import { h, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BlogList from './components/BlogList.vue'
import PensionRankings from './components/PensionRankings.vue'
import NavGroupLink from './components/NavGroupLink.vue'
import RegionMap from './components/RegionMap.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    onMounted(() => {
      document.querySelectorAll('.VPFeature a[href*="penpublic.com"]').forEach(el => {
        el.removeAttribute('target')
        el.removeAttribute('rel')
      })
    })
    return h(DefaultTheme.Layout, null, {})
  },
  enhanceApp({ app }) {
    app.component('BlogList', BlogList)
    app.component('PensionRankings', PensionRankings)
    app.component('NavGroupLink', NavGroupLink)
    app.component('RegionMap', RegionMap)
  }
}

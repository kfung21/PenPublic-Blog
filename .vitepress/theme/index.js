// .vitepress/theme/index.js
import { h, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BlogList from './components/BlogList.vue'
import PensionRankings from './components/PensionRankings.vue'
import NavGroupLink from './components/NavGroupLink.vue'
import RegionMap from './components/RegionMap.vue'
import LaborChart from './components/LaborChart.vue'
import LaborLatest from './components/LaborLatest.vue'
import LaborSectors from './components/LaborSectors.vue'
import CostSummary from './components/CostSummary.vue'
import RevisionChart from './components/RevisionChart.vue'
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
    app.component('LaborChart', LaborChart)
    app.component('LaborLatest', LaborLatest)
    app.component('LaborSectors', LaborSectors)
    app.component('CostSummary', CostSummary)
    app.component('RevisionChart', RevisionChart)
  }
}

// .vitepress/theme/index.js
import { h, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BlogList from './components/BlogList.vue'
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
  }
}

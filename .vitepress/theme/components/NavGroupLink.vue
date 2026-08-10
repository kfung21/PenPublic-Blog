<!-- .vitepress/theme/components/NavGroupLink.vue -->
<!--
  A navbar dropdown whose top-level label is itself a link.

  VitePress's built-in nav group renders its label as a <button>, so there is
  nothing to click. This renders an <a> plus a hover/focus flyout, and is wired
  in through the supported { component, props } nav item shape.

  Desktop: click the label -> section landing page. Hover -> the page list.
  Mobile:  no hover exists, so the flyout is hidden and the label is a plain
           full-width link to the landing page, which lists the same pages.
-->
<script setup>
import { computed, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'

const props = defineProps({
  text: { type: String, required: true },
  link: { type: String, required: true },
  items: { type: Array, default: () => [] },
  activeMatch: { type: String, default: '' }
})

const route = useRoute()
const open = ref(false)

// Route paths may carry a .html suffix in dev; normalize before comparing.
function normalize(path) {
  return String(path || '')
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '')
}

const current = computed(() => normalize(route.path))

const isActive = computed(() =>
  current.value.startsWith(normalize(withBase(props.activeMatch || props.link)))
)

function isItemActive(link) {
  return current.value === normalize(withBase(link))
}
</script>

<template>
  <div
    class="PPNavGroup"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusin="open = true"
    @focusout="open = false"
  >
    <a class="PPNavGroup-label" :class="{ active: isActive }" :href="withBase(link)">
      <span>{{ text }}</span>
      <svg
        class="PPNavGroup-chevron"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </a>

    <div class="PPNavGroup-menu" :class="{ open }">
      <div class="PPNavGroup-menu-inner">
        <a
          v-for="item in items"
          :key="item.link"
          class="PPNavGroup-item"
          :class="{ active: isItemActive(item.link) }"
          :href="withBase(item.link)"
        >{{ item.text }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.PPNavGroup {
  position: relative;
}

.PPNavGroup-label {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition: color 0.25s;
}

.PPNavGroup-label:hover,
.PPNavGroup-label.active {
  color: var(--vp-c-brand-1);
}

.PPNavGroup-chevron {
  margin-top: 1px;
  opacity: 0.7;
  transition: transform 0.25s, opacity 0.25s;
}

.PPNavGroup:hover .PPNavGroup-chevron,
.PPNavGroup:focus-within .PPNavGroup-chevron {
  opacity: 1;
  transform: rotate(180deg);
}

.PPNavGroup-menu {
  position: absolute;
  top: calc(var(--vp-nav-height) - 10px);
  left: 0;
  padding-top: 10px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s, visibility 0.25s;
  z-index: 30;
}

.PPNavGroup-menu.open {
  opacity: 1;
  visibility: visible;
}

.PPNavGroup-menu-inner {
  min-width: 148px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  transition: background-color 0.5s;
}

.PPNavGroup-item {
  display: block;
  padding: 0 12px;
  border-radius: 6px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s;
}

.PPNavGroup-item:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.PPNavGroup-item.active {
  color: var(--vp-c-brand-1);
}

/*
  Mobile nav screen renders this same component. There is no hover on touch,
  so hide the flyout and let the label behave like any other screen menu link.
*/
@media (max-width: 767px) {
  .PPNavGroup-menu {
    display: none;
  }

  .PPNavGroup-label {
    display: block;
    padding: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    line-height: 48px;
    font-size: 14px;
    font-weight: 500;
  }

  .PPNavGroup-chevron {
    display: none;
  }
}
</style>

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
import { computed, ref, onMounted } from 'vue'
import { useRoute, withBase } from 'vitepress'

const props = defineProps({
  text: { type: String, required: true },
  link: { type: String, required: true },
  items: { type: Array, default: () => [] },
  activeMatch: { type: String, default: '' }
})

const route = useRoute()
const open = ref(false)          // desktop hover flyout
const expanded = ref(false)      // mobile accordion

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

// Mobile: tapping the header toggles the accordion instead of navigating.
// VitePress's router intercepts anchor clicks globally, so on mobile the
// label is rendered without an href entirely — nothing to navigate to.
// The landing page stays reachable via the "Overview" item (shown on
// mobile only, and only when it isn't already the first child).
const isMobile = ref(false)
let mq = null
function onLabelClick(e) {
  if (isMobile.value) {
    e.preventDefault()
    e.stopPropagation()
    expanded.value = !expanded.value
  }
}

const showOverviewItem = computed(() =>
  !props.items.length ||
  normalize(withBase(props.link)) !== normalize(withBase(props.items[0].link))
)

onMounted(() => {
  mq = window.matchMedia('(max-width: 767px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', e => { isMobile.value = e.matches })
  // start expanded when the reader is already inside this section
  if (isActive.value) expanded.value = true
})
</script>

<template>
  <div
    class="PPNavGroup"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusin="open = true"
    @focusout="open = false"
  >
    <a
      class="PPNavGroup-label"
      :class="{ active: isActive, expanded }"
      :href="isMobile ? undefined : withBase(link)"
      :role="isMobile ? 'button' : undefined"
      :aria-expanded="expanded"
      @click="onLabelClick"
    >
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

    <div class="PPNavGroup-menu" :class="{ open, expanded }">
      <div class="PPNavGroup-menu-inner">
        <a
          v-if="showOverviewItem"
          class="PPNavGroup-item PPNavGroup-overview"
          :class="{ active: isItemActive(link) }"
          :href="withBase(link)"
        >Overview</a>
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

/* The Overview item only exists for the mobile accordion —
   on desktop the label itself links to the landing page. */
.PPNavGroup-overview {
  display: none;
}

/*
  Mobile nav screen renders this same component. There is no hover on touch,
  so the header becomes an accordion: tap to expand the children (plus an
  "Overview" link to the landing page), tap again to collapse.
*/
@media (max-width: 767px) {
  .PPNavGroup-menu {
    position: static;
    padding-top: 0;
    opacity: 1;
    visibility: visible;
    display: none;
  }

  .PPNavGroup-menu.expanded {
    display: block;
  }

  .PPNavGroup-menu-inner {
    min-width: 0;
    padding: 0 0 0 16px;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .PPNavGroup-item {
    padding: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    border-radius: 0;
    line-height: 44px;
  }

  .PPNavGroup-item:hover {
    background: transparent;
  }

  .PPNavGroup-overview {
    display: block;
  }

  .PPNavGroup-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    line-height: 48px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .PPNavGroup-chevron {
    display: block;
    transition: transform 0.25s;
  }

  .PPNavGroup-label.expanded .PPNavGroup-chevron {
    transform: rotate(180deg);
  }

  /* the desktop hover rule also rotates the chevron; neutralize it here
     so rotation only tracks the expanded state */
  .PPNavGroup:hover .PPNavGroup-chevron,
  .PPNavGroup:focus-within .PPNavGroup-chevron {
    transform: none;
  }
  .PPNavGroup-label.expanded .PPNavGroup-chevron,
  .PPNavGroup:hover .PPNavGroup-label.expanded .PPNavGroup-chevron {
    transform: rotate(180deg);
  }
}
</style>

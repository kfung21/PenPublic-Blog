<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  state: { type: String, required: true },   // e.g. "CA" -> /region-maps/CA.json
})

// Region color palette (up to 10 regions per state)
const PALETTE = [
  '#2563eb', '#16a34a', '#ea580c', '#9333ea', '#0891b2',
  '#ca8a04', '#dc2626', '#4d7c0f', '#db2777', '#475569',
]

const data = ref(null)
const error = ref(null)

// ── interaction state ──
const hovered = ref(null)          // county object under cursor
const pinned = ref(null)           // county pinned by click/tap
const pinnedPos = ref({ x: 0, y: 0 })
const tooltip = ref({ x: 0, y: 0 })
const activeRegion = ref(null)     // locked region index (click), or null
const svgEl = ref(null)
const wrapEl = ref(null)

// viewBox as reactive numbers for zoom/pan
const vb = ref({ x: 0, y: 0, w: 0, h: 0 })
const zoomLevel = computed(() =>
  data.value ? (data.value.width / vb.value.w) : 1
)

// Map data is bundled from States/Regions/data/ — each state becomes its
// own lazy-loaded chunk, so no public/ folder or runtime fetch is needed.
const MAP_DATA = import.meta.glob('../../../States/Regions/data/*.json')

onMounted(async () => {
  try {
    const loader = MAP_DATA[`../../../States/Regions/data/${props.state}.json`]
    if (!loader) throw new Error('no data file for this state')
    data.value = (await loader()).default
    vb.value = { x: 0, y: 0, w: data.value.width, h: data.value.height }
  } catch (e) {
    error.value = `Could not load map data for ${props.state}: ${e.message}`
  }
})

const viewBox = computed(() =>
  `${vb.value.x} ${vb.value.y} ${vb.value.w} ${vb.value.h}`
)

function regionColor(i) { return PALETTE[i % PALETTE.length] }

function fillFor(county) {
  const primary = county.regions[0]
  const dim = activeRegion.value !== null && !county.regions.includes(activeRegion.value)
  return { color: regionColor(primary), dim }
}

function regionsLabel(county) {
  return county.regions.map(i => data.value.regions[i]).join(' · ')
}

const regionCounts = computed(() => {
  if (!data.value) return []
  const counts = data.value.regions.map(() => 0)
  for (const c of data.value.counties) for (const i of c.regions) counts[i]++
  return counts
})

// ── zoom / pan ──
function clientToSvg(evt) {
  const rect = svgEl.value.getBoundingClientRect()
  const relX = (evt.clientX - rect.left) / rect.width
  const relY = (evt.clientY - rect.top) / rect.height
  return {
    x: vb.value.x + relX * vb.value.w,
    y: vb.value.y + relY * vb.value.h,
  }
}

function zoomAt(factor, cx, cy) {
  if (!data.value) return
  const minW = data.value.width / 16   // max 16x zoom
  const maxW = data.value.width * 1.5
  const newW = Math.min(maxW, Math.max(minW, vb.value.w / factor))
  const scale = newW / vb.value.w
  vb.value = {
    x: cx - (cx - vb.value.x) * scale,
    y: cy - (cy - vb.value.y) * scale,
    w: newW,
    h: vb.value.h * scale,
  }
}

function onWheel(evt) {
  const pt = clientToSvg(evt)
  zoomAt(evt.deltaY < 0 ? 1.2 : 1 / 1.2, pt.x, pt.y)
}

function zoomButtons(dir) {
  const cx = vb.value.x + vb.value.w / 2
  const cy = vb.value.y + vb.value.h / 2
  zoomAt(dir > 0 ? 1.4 : 1 / 1.4, cx, cy)
}

function resetView() {
  if (!data.value) return
  vb.value = { x: 0, y: 0, w: data.value.width, h: data.value.height }
  activeRegion.value = null
  pinned.value = null
}

// drag pan + pinch zoom (pointer events: mouse + touch)
let dragging = false
let dragMoved = false
let lastPt = null
const pointers = new Map()   // active touch/mouse points by pointerId
let prevPinch = null         // { dist, mid: {clientX, clientY} }

function pinchState() {
  const [a, b] = [...pointers.values()]
  return {
    dist: Math.hypot(a.x - b.x, a.y - b.y),
    mid: { clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 },
  }
}

function onPointerDown(evt) {
  pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY })
  if (pointers.size === 2) {
    // second finger down: switch from drag to pinch
    dragging = false
    lastPt = null
    dragMoved = true          // a pinch is never a county click
    prevPinch = pinchState()
  } else if (pointers.size === 1) {
    dragging = true
    dragMoved = false
    lastPt = { x: evt.clientX, y: evt.clientY }
  }
  svgEl.value.setPointerCapture(evt.pointerId)
}

function onPointerMove(evt) {
  if (pointers.has(evt.pointerId)) {
    pointers.set(evt.pointerId, { x: evt.clientX, y: evt.clientY })
  }

  if (pointers.size === 2 && prevPinch) {
    // pinch: zoom around the midpoint, pan with midpoint movement
    const now = pinchState()
    if (prevPinch.dist > 0 && now.dist > 0) {
      const midSvg = clientToSvg(now.mid)
      zoomAt(now.dist / prevPinch.dist, midSvg.x, midSvg.y)
      const rect = svgEl.value.getBoundingClientRect()
      const dx = (now.mid.clientX - prevPinch.mid.clientX) / rect.width * vb.value.w
      const dy = (now.mid.clientY - prevPinch.mid.clientY) / rect.height * vb.value.h
      vb.value = { ...vb.value, x: vb.value.x - dx, y: vb.value.y - dy }
    }
    prevPinch = now
  } else if (dragging && lastPt) {
    const rect = svgEl.value.getBoundingClientRect()
    const dx = (evt.clientX - lastPt.x) / rect.width * vb.value.w
    const dy = (evt.clientY - lastPt.y) / rect.height * vb.value.h
    if (Math.abs(evt.clientX - lastPt.x) + Math.abs(evt.clientY - lastPt.y) > 2) dragMoved = true
    vb.value = { ...vb.value, x: vb.value.x - dx, y: vb.value.y - dy }
    lastPt = { x: evt.clientX, y: evt.clientY }
  }

  // tooltip position relative to wrapper
  if (wrapEl.value) {
    const wrect = wrapEl.value.getBoundingClientRect()
    tooltip.value = { x: evt.clientX - wrect.left, y: evt.clientY - wrect.top }
  }
}

function onPointerUp(evt) {
  pointers.delete(evt.pointerId)
  if (pointers.size < 2) prevPinch = null
  if (pointers.size === 1) {
    // one finger lifted mid-pinch: continue as a drag with the remaining finger
    const [p] = [...pointers.values()]
    dragging = true
    lastPt = { x: p.x, y: p.y }
  } else if (pointers.size === 0) {
    dragging = false
    lastPt = null
  }
  try { svgEl.value.releasePointerCapture(evt.pointerId) } catch {}
}

function onCountyClick(county, evt) {
  if (dragMoved) return   // was a pan, not a click
  // clicking any county selects its region (clicks within the same
  // region keep the highlight); empty-background click clears it
  activeRegion.value = county.regions[0]
  // pin the tooltip at the click/tap point (works on touch, where hover doesn't)
  pinned.value = county
  if (wrapEl.value) {
    const wrect = wrapEl.value.getBoundingClientRect()
    pinnedPos.value = { x: evt.clientX - wrect.left, y: evt.clientY - wrect.top }
  }
  evt.stopPropagation()
}

function onSvgClick() {
  // click/tap on empty map background (county clicks stopPropagation):
  // dismiss tooltip and restore the full-state view
  if (!dragMoved) {
    pinned.value = null
    activeRegion.value = null
  }
}

function onDocPointerDown(e) {
  // tap anywhere outside the component: dismiss tooltip and clear the
  // region highlight (zoom/pan stays where you left it)
  if (wrapEl.value && !wrapEl.value.contains(e.target)) {
    pinned.value = null
    activeRegion.value = null
  }
}

function onLegendClick(i) {
  activeRegion.value = activeRegion.value === i ? null : i
}

function onKeydown(e) {
  if (e.key === 'Escape') { activeRegion.value = null; pinned.value = null }
}
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onDocPointerDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onDocPointerDown)
})

// what the tooltip shows: cursor hover wins, otherwise the pinned county
const tipCounty = computed(() => hovered.value || pinned.value)
const tipPos = computed(() =>
  hovered.value ? { x: tooltip.value.x + 12, y: tooltip.value.y + 12 }
                : { x: pinnedPos.value.x + 12, y: pinnedPos.value.y - 8 }
)

function onCountyEnter(c, evt) {
  if (evt.pointerType === 'mouse') hovered.value = c  // touch relies on pinned
}
</script>

<template>
  <div class="region-map" ref="wrapEl">
    <div v-if="error" class="rm-error">{{ error }}</div>

    <template v-else-if="data">
      <div class="rm-toolbar">
        <span class="rm-hint">Scroll to zoom · drag to pan · click a county to highlight its region</span>
        <div class="rm-controls">
          <button @click="zoomButtons(1)" aria-label="Zoom in" title="Zoom in">+</button>
          <button @click="zoomButtons(-1)" aria-label="Zoom out" title="Zoom out">−</button>
          <button @click="resetView" aria-label="Reset view" title="Reset view">⟲</button>
        </div>
      </div>

      <svg
        ref="svgEl"
        :viewBox="viewBox"
        class="rm-svg"
        :class="{ 'rm-grabbing': false }"
        @wheel.prevent="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="hovered = null"
        @click="onSvgClick"
      >
        <path
          v-for="c in data.counties"
          :key="c.name"
          :d="c.d"
          class="rm-county"
          :class="{
            'rm-dim': fillFor(c).dim,
            'rm-hover': hovered === c || pinned === c,
          }"
          :fill="fillFor(c).color"
          :stroke-width="1 / zoomLevel"
          @pointerenter="onCountyEnter(c, $event)"
          @pointerleave="hovered = null"
          @click="onCountyClick(c, $event)"
        />
      </svg>

      <div
        v-if="tipCounty"
        class="rm-tooltip"
        :style="{ left: tipPos.x + 'px', top: tipPos.y + 'px' }"
      >
        <strong>{{ tipCounty.name }}</strong>
        <span>{{ regionsLabel(tipCounty) }}</span>
      </div>

      <div class="rm-legend">
        <button
          v-for="(r, i) in data.regions"
          :key="r"
          class="rm-chip"
          :class="{ 'rm-chip-active': activeRegion === i, 'rm-chip-muted': activeRegion !== null && activeRegion !== i }"
          @click="onLegendClick(i)"
        >
          <span class="rm-swatch" :style="{ background: regionColor(i) }"></span>
          {{ r }}
          <span class="rm-count">{{ regionCounts[i] }}</span>
        </button>
      </div>
    </template>

    <div v-else class="rm-loading">Loading map…</div>
  </div>
</template>

<style scoped>
.region-map {
  position: relative;
  margin: 1.5rem 0;
}
.rm-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.rm-hint {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.rm-controls {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.rm-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}
.rm-controls button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.rm-svg {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: grab;
  touch-action: none;
}
.rm-svg:active { cursor: grabbing; }
.rm-county {
  stroke: var(--vp-c-bg);
  opacity: 0.85;
  transition: opacity 0.15s;
  cursor: pointer;
}
.rm-county.rm-hover { opacity: 1; }
.rm-county.rm-dim { opacity: 0.12; }
.rm-tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  background: var(--vp-c-bg-elv, var(--vp-c-bg));
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  box-shadow: var(--vp-shadow-2, 0 2px 8px rgba(0,0,0,0.15));
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 260px;
}
.rm-tooltip span { color: var(--vp-c-text-2); font-size: 0.78rem; }
.rm-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0.75rem;
}
.rm-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  padding: 4px 10px;
  cursor: pointer;
  transition: opacity 0.15s, border-color 0.15s;
}
.rm-chip:hover { border-color: var(--vp-c-brand-1); }
.rm-chip-active { border-color: var(--vp-c-brand-1); font-weight: 600; }
.rm-chip-muted { opacity: 0.45; }
.rm-swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}
.rm-count {
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
}
.rm-loading, .rm-error {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}
</style>

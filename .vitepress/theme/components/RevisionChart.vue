<script setup>
// Interactive revision chart for VitePress. No chart library.
//
// Usage in a .md page (registered globally in theme/index.js):
//   <RevisionChart series="PAYEMS" />
//
// Reads labor.py's export from Unemployment/data/ (see laborData.js).

import { ref, computed, onMounted } from 'vue'
import { loadLabor } from './laborData.js'

const props = defineProps({
  series: { type: String, required: true },
  showRevisions: { type: Boolean, default: true },
})

const data = ref(null)
const error = ref(null)
const hover = ref(null)

// Load on mount only, so the build's SSR pass never touches it.
onMounted(async () => {
  try {
    data.value = await loadLabor(props.series)
  } catch (e) {
    error.value = e.message
  }
})

// --- geometry -------------------------------------------------------------
const W = 900
const H1 = 300
const H2 = 150
const PAD = { l: 52, r: 14, t: 16, b: 24 }

const H = computed(() => H1 + (props.showRevisions ? H2 : 0))
const plotW = W - PAD.l - PAD.r

const n = computed(() => data.value?.periods.length ?? 0)

function sx(i) {
  return PAD.l + (n.value < 2 ? plotW / 2 : (i / (n.value - 1)) * plotW)
}

const yLevel = computed(() => {
  const v = data.value.current.filter(x => x != null)
  const lo = Math.min(...v), hi = Math.max(...v)
  const pad = (hi - lo) * 0.08 || 1
  return { lo: lo - pad, hi: hi + pad }
})

function sy1(v) {
  const { lo, hi } = yLevel.value
  return PAD.t + ((hi - v) / (hi - lo)) * (H1 - PAD.t - PAD.b)
}

const rMax = computed(() => {
  const v = data.value.revision.filter(x => x != null).map(Math.abs)
  return Math.max(...v, 0.0001)
})

function sy2(v) {
  return H1 + PAD.t + ((rMax.value - v) / (2 * rMax.value)) * (H2 - PAD.t - PAD.b)
}

// --- line, split into solid (final) and dashed (provisional) runs ---------
// The boundary point belongs to both runs, otherwise the line breaks.
const runs = computed(() => {
  const d = data.value
  if (!d) return []
  const out = []
  let cur = [0]
  for (let i = 1; i < d.periods.length; i++) {
    const prevFinal = d.status[i - 1] === 2
    const nowFinal = d.status[i] === 2
    cur.push(i)
    if (prevFinal !== nowFinal) {
      out.push({ final: prevFinal, idx: cur })
      cur = [i]
    }
  }
  out.push({ final: d.status[cur[0]] === 2, idx: cur })
  return out.map(r => ({
    final: r.final,
    d: r.idx.map((i, k) => `${k ? 'L' : 'M'}${sx(i).toFixed(1)},${sy1(d.current[i]).toFixed(1)}`).join(' '),
  }))
})

const bars = computed(() => {
  const d = data.value
  if (!d || !props.showRevisions) return []
  const zero = sy2(0)
  const bw = Math.max((plotW / n.value) * 0.8, 0.7)
  return d.revision.map((v, i) => {
    if (!v) return null
    const y = sy2(v)
    return { x: sx(i) - bw / 2, y: Math.min(y, zero), w: bw, h: Math.abs(y - zero), up: v > 0 }
  }).filter(Boolean)
})

// --- axes -----------------------------------------------------------------
function ticks(lo, hi, count = 5) {
  if (hi <= lo) return [lo]
  const raw = (hi - lo) / count
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const step = [1, 2, 2.5, 5, 10].map(s => s * mag).find(s => s >= raw) || mag
  const out = []
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) out.push(+t.toFixed(10))
  return out
}

const yTicks1 = computed(() => ticks(yLevel.value.lo, yLevel.value.hi).map(v => ({ v, y: sy1(v) })))
const yTicks2 = computed(() => ticks(-rMax.value, rMax.value, 4).map(v => ({ v, y: sy2(v) })))
const xTicks = computed(() => {
  const d = data.value, step = Math.max(Math.floor(n.value / 7), 1), out = []
  for (let i = 0; i < n.value; i += step) out.push({ label: d.periods[i], x: sx(i) })
  return out
})

const zeroY = computed(() => sy2(0))

// --- hover ----------------------------------------------------------------
const STATUS = ['preliminary', 'revised', 'final']

function onMove(e) {
  if (!data.value) return
  const box = e.currentTarget.getBoundingClientRect()
  const xInView = ((e.clientX - box.left) / box.width) * W
  const i = Math.round(((xInView - PAD.l) / plotW) * (n.value - 1))
  hover.value = i >= 0 && i < n.value ? i : null
}

const tip = computed(() => {
  const i = hover.value, d = data.value
  if (i == null || !d) return null
  return {
    x: sx(i),
    period: d.periods[i],
    current: d.current[i],
    initial: d.initial[i],
    revision: d.revision[i],
    restated: d.restated[i],
    status: STATUS[d.status[i]],
    left: sx(i) / W * 100,
  }
})

const fmt = v => v == null ? '—' : (Math.abs(v) >= 1000 ? v.toLocaleString() : v.toFixed(1))
const sign = v => v == null || v === 0 ? '0' : (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2))
</script>

<template>
  <div class="rc">
    <p v-if="error" class="rc-err">Could not load {{ series }}: {{ error }}</p>
    <p v-else-if="!data" class="rc-load">Loading {{ series }}…</p>

    <template v-else>
      <div class="rc-head">
        <strong>{{ data.id }}</strong> — {{ data.title }}
        <span class="rc-sub">{{ data.months.toLocaleString() }} months ·
          {{ data.model }} revision model</span>
      </div>

      <div class="rc-wrap">
        <svg :viewBox="`0 0 ${W} ${H}`" @mousemove="onMove" @mouseleave="hover = null">
          <line v-for="t in yTicks1" :key="'g'+t.v" :x1="PAD.l" :x2="W-PAD.r"
                :y1="t.y" :y2="t.y" class="rc-grid" />
          <text v-for="t in yTicks1" :key="'l'+t.v" :x="PAD.l-8" :y="t.y+4"
                text-anchor="end" class="rc-ax">{{ t.v }}</text>

          <path v-for="(r, i) in runs" :key="i" :d="r.d" class="rc-line"
                :stroke-dasharray="r.final ? undefined : '5,4'" />

          <text v-for="t in xTicks" :key="t.label" :x="t.x" :y="H1-4"
                text-anchor="middle" class="rc-ax">{{ t.label }}</text>

          <template v-if="showRevisions">
            <line v-for="t in yTicks2" :key="'g2'+t.v" :x1="PAD.l" :x2="W-PAD.r"
                  :y1="t.y" :y2="t.y" class="rc-grid" />
            <rect v-for="(b, i) in bars" :key="i" :x="b.x" :y="b.y" :width="b.w"
                  :height="b.h" :class="b.up ? 'rc-up' : 'rc-down'" />
            <line :x1="PAD.l" :x2="W-PAD.r" :y1="zeroY" :y2="zeroY" class="rc-zero" />
            <text v-for="t in yTicks2" :key="'l2'+t.v" :x="PAD.l-8" :y="t.y+4"
                  text-anchor="end" class="rc-ax">{{ sign(t.v) }}</text>
            <text :x="PAD.l" :y="H1+PAD.t" class="rc-lab">revision (current − first print)</text>
          </template>

          <line v-if="tip" :x1="tip.x" :x2="tip.x" :y1="PAD.t" :y2="H-PAD.b" class="rc-cursor" />
        </svg>

        <div v-if="tip" class="rc-tip" :style="{ left: `clamp(0px, calc(${tip.left}% - 80px), calc(100% - 168px))` }">
          <b>{{ tip.period }}</b>
          <span>now <b>{{ fmt(tip.current) }}</b></span>
          <span>first print {{ fmt(tip.initial) }}</span>
          <span :class="tip.revision > 0 ? 'up' : tip.revision < 0 ? 'down' : ''">
            revision {{ sign(tip.revision) }}</span>
          <span>restated {{ tip.restated }}× · {{ tip.status }}</span>
        </div>
      </div>

      <p class="rc-key">
        <b>Solid</b> final · <b>Dashed</b> still provisional ·
        <span class="up">green</span> revised up ·
        <span class="down">red</span> revised down
      </p>
    </template>
  </div>
</template>

<style scoped>
/* VitePress theme vars, so dark mode works with no extra work. */
.rc { margin: 22px 0; }
.rc-head { font-size: 14px; margin-bottom: 8px; color: var(--vp-c-text-1); }
.rc-sub { display: block; font-size: 12px; color: var(--vp-c-text-3); margin-top: 2px; }
.rc-wrap { position: relative; }
svg { width: 100%; height: auto; display: block;
      border: 1px solid var(--vp-c-divider); border-radius: 6px; }
.rc-grid  { stroke: var(--vp-c-divider); stroke-width: 1; }
.rc-zero  { stroke: var(--vp-c-text-3); stroke-width: 1; }
.rc-line  { fill: none; stroke: var(--vp-c-brand-1); stroke-width: 1.6; }
.rc-cursor{ stroke: var(--vp-c-text-3); stroke-width: 1; stroke-dasharray: 3,3; }
.rc-ax    { font-size: 10px; fill: var(--vp-c-text-3); }
.rc-lab   { font-size: 11px; fill: var(--vp-c-text-2); }
.rc-up    { fill: #2e7d32; opacity: .75; }
.rc-down  { fill: #c0392b; opacity: .75; }
.rc-tip {
  position: absolute; top: 8px; width: 168px; pointer-events: none;
  background: var(--vp-c-bg-elv); border: 1px solid var(--vp-c-divider);
  border-radius: 6px; padding: 8px 10px; font-size: 12px; line-height: 1.55;
  box-shadow: 0 2px 10px rgb(0 0 0 / .12);
}
.rc-tip span { display: block; color: var(--vp-c-text-2); }
.rc-key { font-size: 12px; color: var(--vp-c-text-3); margin-top: 8px; }
.up { color: #2e7d32; } .down { color: #c0392b; }
.rc-err { color: var(--vp-c-danger-1); font-size: 13px; }
.rc-load { color: var(--vp-c-text-3); font-size: 13px; }
</style>

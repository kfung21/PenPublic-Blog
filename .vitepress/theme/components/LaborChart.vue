<script setup>
// Full-history line chart for the Unemployment dashboard. No chart library.
//
// Usage in a .md page (registered globally in theme/index.js):
//   <LaborChart series="UNRATE" title="Unemployment rate" />
//   <LaborChart series="U1RATE,U2RATE,UNRATE,U4RATE,U5RATE,U6RATE" title="U-1 to U-6" />
//
// One y axis per chart. Series that do not share a range belong in separate
// charts. Solid line = final, dashed = still open to revision.

import { ref, computed, onMounted } from 'vue'
import {
  loadLabor, loadSum, loadShare, RANGES, activeRange, RECESSIONS, SHORT,
  mi, fromMi, monthLabel, isLevel, fmtValue,
} from './laborData.js'

const props = defineProps({
  series: { type: String, default: '' },      // comma-separated ids, max 6
  // Derived lines, drawn before `series`:
  //   sum="A,B,C"   one line adding the series together
  //   share="A/B"   A as a percent of B
  sum:        { type: String, default: '' },
  sumLabel:   { type: String, default: 'Total' },
  share:      { type: String, default: '' },
  shareLabel: { type: String, default: 'Share' },
  title:  { type: String, default: '' },
  note:   { type: String, default: '' },
  zero:   { type: Boolean, default: false },  // force the y axis to start at 0
})

const ids = computed(() => props.series.split(',').map(s => s.trim()).filter(Boolean).slice(0, 6))
const sets = ref([])          // loaded series, in the order given
const error = ref(null)
const hidden = ref(new Set()) // ids toggled off in the legend
const hover = ref(null)       // absolute month index under the cursor

onMounted(async () => {
  try {
    const jobs = []
    if (props.sum) {
      jobs.push(loadSum(props.sum.split(',').map(x => x.trim()), props.sumLabel))
    }
    if (props.share) {
      const [num, den] = props.share.split('/').map(x => x.trim())
      jobs.push(loadShare(num, den, props.shareLabel))
    }
    const loaded = (await Promise.all([...jobs, ...ids.value.map(loadLabor)])).slice(0, 6)
    sets.value = loaded.map((d, k) => ({
      ...d,
      slot: k + 1,                       // color follows the series, not its rank
      name: SHORT[d.id] || d.title,
      // Absolute month of every point. Never assume the months are
      // contiguous: BLS published no household survey for Oct 2025, so
      // position must come from the period, not the array index.
      ms: d.periods.map(mi),
    })).map(s => ({
      ...s,
      m0: s.ms[0],
      m1: s.ms[s.ms.length - 1],
      at: new Map(s.ms.map((m, i) => [m, i])),
    }))
  } catch (e) {
    error.value = e.message
  }
})

const level = computed(() => sets.value.length > 0 && isLevel(sets.value[0]))
const shown = computed(() => sets.value.filter(s => !hidden.value.has(s.id)))

function toggle(id) {
  const next = new Set(hidden.value)
  if (next.has(id)) next.delete(id)
  else if (next.size < sets.value.length - 1) next.add(id)   // keep at least one
  hidden.value = next
}

// --- geometry -------------------------------------------------------------
const W = 900, H = 340
const PAD = { l: 50, r: 16, t: 26, b: 26 }   // top padding holds the recession names
// Room on the right for the "Now" label of every line.
const padR = computed(() => 82)
const plotW = computed(() => W - PAD.l - padR.value)
const plotH = H - PAD.t - PAD.b

// x window: from the earliest shown series (or the range cutoff) to the latest month
const xDom = computed(() => {
  const all = shown.value.length ? shown.value : sets.value
  const hi = Math.max(...all.map(s => s.m1))
  const first = Math.min(...all.map(s => s.m0))
  const span = RANGES.find(r => r.key === activeRange.value)?.months ?? Infinity
  return { lo: Math.max(first, span === Infinity ? first : hi - span), hi }
})
const sx = m => PAD.l + ((m - xDom.value.lo) / Math.max(xDom.value.hi - xDom.value.lo, 1)) * plotW.value

// A range is only offered if at least one series is longer than it.
const ranges = computed(() => {
  if (!sets.value.length) return []
  const longest = Math.max(...sets.value.map(s => s.m1 - s.m0 + 1))
  return RANGES.filter(r => r.months === Infinity || r.months < longest)
})

function nice(lo, hi, count = 5) {
  const raw = (hi - lo) / count || 1
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  return [1, 2, 2.5, 5, 10].map(s => s * mag).find(s => s >= raw) || mag
}

const yDom = computed(() => {
  let lo = Infinity, hi = -Infinity
  for (const s of shown.value) {
    for (let i = 0; i < s.current.length; i++) {
      const v = s.current[i]
      if (v == null || s.ms[i] < xDom.value.lo) continue
      if (v < lo) lo = v
      if (v > hi) hi = v
    }
  }
  if (!isFinite(lo)) return { lo: 0, hi: 1, step: 0.2 }
  // Rates that sit near the floor read better from zero. Series that sit far
  // from it (participation at 58 to 67) would be flattened, so they do not.
  if (props.zero || lo < hi * 0.4) lo = 0
  const step = nice(lo, hi)
  return { lo: Math.floor(lo / step) * step, hi: Math.ceil(hi / step) * step, step }
})
const sy = v => PAD.t + ((yDom.value.hi - v) / (yDom.value.hi - yDom.value.lo || 1)) * plotH

const yTicks = computed(() => {
  const { lo, hi, step } = yDom.value, out = []
  for (let v = lo; v <= hi + step / 1e6; v += step) out.push(+v.toFixed(6))
  const small = hi < 2000     // under 2 million: label in thousands
  return out.map(v => ({
    v, y: sy(v),
    label: !level.value ? `${v}%` : small ? `${v}K` : `${+(v / 1000).toFixed(1)}M`,
  }))
})

const xTicks = computed(() => {
  const { lo, hi } = xDom.value
  const years = (hi - lo) / 12
  const every = years > 60 ? 10 : years > 25 ? 5 : years > 12 ? 2 : 1
  const out = []
  for (let y = Math.ceil(lo / 12); y * 12 <= hi; y++) {
    if (y % every === 0) out.push({ x: sx(y * 12), label: String(y) })
  }
  return out
})

const bands = computed(() => {
  const { lo, hi } = xDom.value
  const out = RECESSIONS.map(([a, b, name]) => ({ a: mi(a), b: mi(b) + 1, name }))
    .filter(r => r.b > lo && r.a < hi)
    .map(r => {
      const x1 = sx(Math.max(r.a, lo)), x2 = sx(Math.min(r.b, hi))
      return { x: x1, w: Math.max(x2 - x1, 1), cx: (x1 + x2) / 2,
               name: r.name, half: r.name.length * 2.6 + 3, months: r.b - r.a, label: '' }
    })
  // Name the bands, longest recessions first, skipping any that would collide.
  const placed = []
  for (const r of [...out].filter(r => r.name).sort((p, q) => q.months - p.months)) {
    const clear = placed.every(q => Math.abs(q.cx - r.cx) > q.half + r.half + 4)
    if (clear && r.cx - r.half > PAD.l && r.cx + r.half < W - padR.value) {
      r.label = r.name
      placed.push(r)
    }
  }
  return out
})

// A horizontal line at each series' latest value, so earlier periods that
// sat at the same level are easy to spot.
const nowLines = computed(() => {
  const out = shown.value.map(s => {
    const v = s.current[s.current.length - 1]
    return { id: s.id, slot: s.slot, y: sy(v), ly: sy(v), label: fmtValue(v, level.value) }
  })
  // Labels sit in the right margin at their line's height. Where lines are
  // close together, spread the labels so they never overlap.
  const GAP = 13, top = PAD.t + 4, bottom = PAD.t + plotH - 2
  const byY = [...out].sort((p, q) => p.y - q.y)
  byY.forEach((r, i) => { r.ly = Math.max(r.y, i ? byY[i - 1].ly + GAP : top) })
  for (let i = byY.length - 1; i >= 0; i--) {
    const limit = i === byY.length - 1 ? bottom : byY[i + 1].ly - GAP
    if (byY[i].ly > limit) byY[i].ly = limit
  }
  return out
})

// Each line is split into solid (final) and dashed (provisional) runs. The
// boundary point belongs to both runs, otherwise the line breaks.
const lines = computed(() => shown.value.map(s => {
  const runs = []
  let cur = [], curFinal = null
  for (let i = 0; i < s.current.length; i++) {
    if (s.current[i] == null || s.ms[i] < xDom.value.lo) continue
    const f = s.status[i] === 2
    // A missing month breaks the line instead of being drawn across.
    if (cur.length && s.ms[i] !== s.ms[cur[cur.length - 1]] + 1) {
      runs.push({ final: curFinal, idx: cur })
      cur = [i]
    } else if (curFinal !== null && f !== curFinal) {
      cur.push(i)
      runs.push({ final: curFinal, idx: cur })
      cur = [i]
    } else {
      cur.push(i)
    }
    curFinal = f
  }
  if (cur.length) runs.push({ final: curFinal, idx: cur })
  return {
    id: s.id, slot: s.slot,
    runs: runs.map(r => ({
      final: r.final,
      d: r.idx.map((i, k) =>
        `${k ? 'L' : 'M'}${sx(s.ms[i]).toFixed(1)},${sy(s.current[i]).toFixed(1)}`).join(''),
    })),
  }
}))

// --- hover ----------------------------------------------------------------
function onMove(e) {
  if (!sets.value.length) return
  const box = e.currentTarget.getBoundingClientRect()
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - box.left
  const x = (cx / box.width) * W
  const { lo, hi } = xDom.value
  const m = Math.round(lo + ((x - PAD.l) / plotW.value) * (hi - lo))
  hover.value = Math.min(Math.max(m, lo), hi)
}

const tip = computed(() => {
  const m = hover.value
  if (m == null) return null
  const rows = shown.value.map(s => {
    const i = s.at.get(m)
    const v = i === undefined ? null : s.current[i]
    return {
      id: s.id, slot: s.slot, name: s.name, v,
      y: v == null ? null : sy(v),
      open: v != null && s.status[i] !== 2,
    }
  }).filter(r => r.v != null).sort((a, b) => b.v - a.v)
  const rec = RECESSIONS.find(([a, b]) => m >= mi(a) && m <= mi(b))
  return { x: sx(m), left: (sx(m) / W) * 100, period: monthLabel(fromMi(m)), rows,
           anyOpen: rows.some(r => r.open),
           recession: rec ? (rec[2] ? `Recession: ${rec[2]}` : 'Recession') : '' }
})

const legend = computed(() => sets.value.map(s => ({
  id: s.id, slot: s.slot, name: s.name, off: hidden.value.has(s.id),
  last: fmtValue(s.current[s.current.length - 1], level.value),
})))

const through = computed(() => {
  if (!sets.value.length) return ''
  const s = sets.value[0]
  return `${monthLabel(s.periods[0])} to ${monthLabel(s.periods[s.periods.length - 1])}`
})
const hasOpen = computed(() => shown.value.some(s => s.status.some(x => x !== 2)))

// What the dashes mean depends on the survey. Payroll numbers (CES) really are
// preliminary at first. Household survey numbers (CPS) are not: only their
// seasonal adjustment gets recalculated.
const dashNote = computed(() => {
  const open = shown.value.filter(s => s.status.some(x => x !== 2))
  if (!open.length) return ''
  if (open.some(s => s.source === 'JOLTS')) {
    return 'can still be revised. The latest month is preliminary.'
  }
  if (open.some(s => s.source === 'CES')) {
    return 'can still be revised. The latest two months are preliminary first estimates.'
  }
  return 'last five years. Not preliminary, but the seasonal adjustment is recalculated '
       + 'each January and can shift a month slightly.'
})
</script>

<template>
  <div class="lc">
    <p v-if="error" class="lc-msg lc-err">Could not load chart data: {{ error }}</p>
    <p v-else-if="!sets.length" class="lc-msg">Loading chart…</p>

    <template v-else>
      <div class="lc-head">
        <div>
          <div class="lc-title">{{ title || sets[0].title }}</div>
          <div class="lc-sub">{{ level ? 'Persons' : 'Percent' }} · monthly · {{ through }}</div>
        </div>
        <div class="lc-ranges" role="group" aria-label="Time range">
          <button v-for="r in ranges" :key="r.key" type="button"
                  :class="{ on: activeRange === r.key }" :aria-pressed="activeRange === r.key"
                  @click="activeRange = r.key">{{ r.label }}</button>
        </div>
      </div>

      <div v-if="sets.length > 1" class="lc-legend">
        <button v-for="l in legend" :key="l.id" type="button" :class="{ off: l.off }"
                :aria-pressed="!l.off" :title="l.off ? 'Show' : 'Hide'" @click="toggle(l.id)">
          <i :class="`s${l.slot}`"></i>{{ l.name }} <b>{{ l.last }}</b>
        </button>
      </div>

      <div class="lc-wrap">
        <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="title || sets[0].title"
             @mousemove="onMove" @mouseleave="hover = null"
             @touchstart.passive="onMove" @touchmove.passive="onMove">
          <template v-for="(b, i) in bands" :key="'b' + i">
            <rect :x="b.x" :y="PAD.t" :width="b.w" :height="plotH" class="lc-band" />
            <text v-if="b.label" :x="b.cx" :y="PAD.t - 8" text-anchor="middle"
                  class="lc-band-l">{{ b.label }}</text>
          </template>

          <template v-for="t in yTicks" :key="'y' + t.v">
            <line :x1="PAD.l" :x2="W - padR" :y1="t.y" :y2="t.y" class="lc-grid" />
            <text :x="PAD.l - 8" :y="t.y + 4" text-anchor="end" class="lc-ax">{{ t.label }}</text>
          </template>
          <text v-for="t in xTicks" :key="'x' + t.label" :x="t.x" :y="H - 8"
                text-anchor="middle" class="lc-ax">{{ t.label }}</text>

          <g v-for="n in nowLines" :key="'n' + n.id" :class="`lc-now s${n.slot}`">
            <line :x1="PAD.l" :x2="W - padR" :y1="n.y" :y2="n.y" />
          </g>
          <g v-for="n in nowLines" :key="'nl' + n.id">
            <circle :cx="W - padR + 8" :cy="n.ly" r="3" :class="`lc-dot-s s${n.slot}`" />
            <text :x="W - padR + 15" :y="n.ly + 4" class="lc-now-l">Now {{ n.label }}</text>
          </g>

          <g v-for="l in lines" :key="l.id" :class="`lc-line s${l.slot}`">
            <path v-for="(r, i) in l.runs" :key="i" :d="r.d"
                  :stroke-dasharray="r.final ? undefined : '5 4'" />
          </g>

          <template v-if="tip">
            <line :x1="tip.x" :x2="tip.x" :y1="PAD.t" :y2="PAD.t + plotH" class="lc-cursor" />
            <circle v-for="r in tip.rows" :key="r.id" :cx="tip.x" :cy="r.y" r="4"
                    :class="`lc-dot s${r.slot}`" />
          </template>
        </svg>

        <div v-if="tip && tip.rows.length" class="lc-tip"
             :style="{ left: `clamp(0px, calc(${tip.left}% + ${tip.left > 60 ? -236 : 16}px), calc(100% - 220px))` }">
          <div class="lc-tip-h">{{ tip.period }}</div>
          <div v-if="tip.recession" class="lc-tip-n lc-tip-rec">{{ tip.recession }}</div>
          <div v-for="r in tip.rows" :key="r.id" class="lc-tip-r">
            <i :class="`s${r.slot}`"></i><span>{{ r.name }}</span>
            <b>{{ fmtValue(r.v, level) }}{{ r.open ? '*' : '' }}</b>
          </div>
          <div v-if="tip.anyOpen" class="lc-tip-n">* still open to revision</div>
        </div>
      </div>

      <p class="lc-key">
        <span class="lc-swatch"></span>Recession (NBER) · <b>Dotted</b> = where it stands now
        <template v-if="hasOpen"> · <b>Dashed</b> = {{ dashNote }}</template>
        <template v-if="note"> · {{ note }}</template>
      </p>
    </template>
  </div>
</template>

<style scoped>
/* Series colors: one fixed slot per series, light and dark steps of the same hues. */
.lc { --s1: #2a78d6; --s2: #eb6834; --s3: #1baf7a; --s4: #eda100; --s5: #e87ba4; --s6: #008300;
      margin: 24px 0 32px; }
:global(.dark) .lc { --s1: #3987e5; --s2: #d95926; --s3: #199e70; --s4: #c98500; --s5: #d55181; --s6: #008300; }

.lc-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px;
           flex-wrap: wrap; margin-bottom: 8px; }
.lc-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 17px;
            color: var(--vp-c-text-1); line-height: 1.3; }
.lc-sub { font-size: 12px; color: var(--vp-c-text-3); margin-top: 2px; }

.lc-ranges { display: inline-flex; border: 1px solid var(--vp-c-divider); border-radius: 6px;
             overflow: hidden; }
.lc-ranges button { font-size: 12px; padding: 3px 10px; color: var(--vp-c-text-2);
                    border-left: 1px solid var(--vp-c-divider); }
.lc-ranges button:first-child { border-left: 0; }
.lc-ranges button:hover { color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }
.lc-ranges button.on { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 600; }

.lc-legend { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 6px; }
.lc-legend button { font-size: 12px; color: var(--vp-c-text-2); display: inline-flex;
                    align-items: center; gap: 6px; }
.lc-legend button b { color: var(--vp-c-text-1); font-weight: 600; }
.lc-legend button.off { opacity: .4; text-decoration: line-through; }
.lc-legend i, .lc-tip i { width: 12px; height: 3px; border-radius: 2px; flex: none; }

.lc-wrap { position: relative; }
svg { width: 100%; height: auto; display: block; touch-action: pan-y;
      border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); }
.lc-band   { fill: var(--vp-c-text-1); opacity: .1; }
.lc-band-l { font-size: 10px; fill: var(--vp-c-text-3); }
.lc-now line { stroke-width: 1; stroke-dasharray: 1 4; stroke-linecap: round; opacity: .9; }
.lc-now-l  { font-size: 11px; font-weight: 600; fill: var(--vp-c-text-1);
             font-variant-numeric: tabular-nums; }
.lc-tip-rec { margin: 0 0 2px; }
.lc-grid   { stroke: var(--vp-c-divider); stroke-width: 1; }
.lc-ax     { font-size: 11px; fill: var(--vp-c-text-3); font-variant-numeric: tabular-nums; }
.lc-cursor { stroke: var(--vp-c-text-3); stroke-width: 1; }
.lc-line path { fill: none; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.lc-dot { stroke: var(--vp-c-bg); stroke-width: 2; }

.lc-now.s1 line { stroke: var(--s1); } .lc-now.s2 line { stroke: var(--s2); } .lc-now.s3 line { stroke: var(--s3); }
.lc-now.s4 line { stroke: var(--s4); } .lc-now.s5 line { stroke: var(--s5); } .lc-now.s6 line { stroke: var(--s6); }
.lc-dot-s.s1 { fill: var(--s1); } .lc-dot-s.s2 { fill: var(--s2); } .lc-dot-s.s3 { fill: var(--s3); }
.lc-dot-s.s4 { fill: var(--s4); } .lc-dot-s.s5 { fill: var(--s5); } .lc-dot-s.s6 { fill: var(--s6); }
.lc-line.s1 path { stroke: var(--s1); } .lc-dot.s1 { fill: var(--s1); } i.s1 { background: var(--s1); }
.lc-line.s2 path { stroke: var(--s2); } .lc-dot.s2 { fill: var(--s2); } i.s2 { background: var(--s2); }
.lc-line.s3 path { stroke: var(--s3); } .lc-dot.s3 { fill: var(--s3); } i.s3 { background: var(--s3); }
.lc-line.s4 path { stroke: var(--s4); } .lc-dot.s4 { fill: var(--s4); } i.s4 { background: var(--s4); }
.lc-line.s5 path { stroke: var(--s5); } .lc-dot.s5 { fill: var(--s5); } i.s5 { background: var(--s5); }
.lc-line.s6 path { stroke: var(--s6); } .lc-dot.s6 { fill: var(--s6); } i.s6 { background: var(--s6); }

.lc-tip { position: absolute; top: 10px; width: 220px; pointer-events: none;
          background: var(--vp-c-bg-elv); border: 1px solid var(--vp-c-divider);
          border-radius: 6px; padding: 8px 10px; font-size: 12px; line-height: 1.5;
          box-shadow: 0 2px 10px rgb(0 0 0 / .12); }
.lc-tip-h { font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 2px; }
.lc-tip-r { display: flex; align-items: center; gap: 6px; color: var(--vp-c-text-2); }
.lc-tip-r span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lc-tip-r b { color: var(--vp-c-text-1); font-variant-numeric: tabular-nums; }
.lc-tip-n { color: var(--vp-c-text-3); margin-top: 2px; }

.lc-key { font-size: 12px; color: var(--vp-c-text-3); margin: 8px 0 0; line-height: 1.5; }
.lc-swatch { display: inline-block; width: 12px; height: 10px; margin-right: 5px;
             background: var(--vp-c-text-1); opacity: .18; vertical-align: -1px; }
.lc-msg { font-size: 13px; color: var(--vp-c-text-3); }
.lc-err { color: var(--vp-c-danger-1); }
</style>

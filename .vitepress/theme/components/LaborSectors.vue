<script setup>
// Jobs gained or lost by sector, from the employer survey (CES).
//
//   <LaborSectors />
//
// One bar per sector for the change over 1, 3 or 12 months. Sectors whose
// data file has not been pulled yet are skipped.

import { ref, computed, onMounted } from 'vue'
import { loadLabor, loadSum, SECTORS, mi, monthLabel, fmtValue, fmtChange } from './laborData.js'

const WINDOWS = [
  { key: 1, label: '1 month' },
  { key: 3, label: '3 months' },
  { key: 12, label: '12 months' },
]
const span = ref(1)
const sets = ref([])
const total = ref(null)
const ready = ref(false)

const tryLoad = id => loadLabor(id).catch(() => null)
const tryRow = s => (s.sum ? loadSum(s.sum, s.name) : loadLabor(s.id)).catch(() => null)

onMounted(async () => {
  const [tot, ...rest] = await Promise.all([tryLoad('PAYEMS'), ...SECTORS.map(tryRow)])
  total.value = tot
  sets.value = SECTORS.map((s, i) => rest[i] && { ...s, d: rest[i] }).filter(Boolean)
  ready.value = true
})

// Change over `back` months, looked up by date so a missing month can never
// shift the comparison.
function change(d, back) {
  const n = d.periods.length
  const last = mi(d.periods[n - 1])
  const i = d.periods.findIndex(p => mi(p) === last - back)
  return i < 0 ? null : +(d.current[n - 1] - d.current[i]).toFixed(1)
}

const lastOf = d => d.periods[d.periods.length - 1]
const period = computed(() => total.value ? lastOf(total.value) : sets.value[0] ? lastOf(sets.value[0].d) : '')

const rows = computed(() => sets.value.map(s => ({
  id: s.id, name: s.name, sub: !!s.sub, group: !!s.group, note: s.note,
  hasBar: !s.group || !!s.bar,
  v: change(s.d, span.value),
  level: s.d.current[s.d.current.length - 1],
  // detailed industries can publish a month behind the headline
  lag: lastOf(s.d) !== period.value ? monthLabel(lastOf(s.d)) : '',
})))

const maxAbs = computed(() =>
  Math.max(...rows.value.filter(r => r.hasBar).map(r => Math.abs(r.v ?? 0)), 1))
const width = v => `${(Math.abs(v ?? 0) / maxAbs.value) * 50}%`

const totalChange = computed(() => total.value ? change(total.value, span.value) : null)
const totalLevel = computed(() => total.value ? total.value.current[total.value.current.length - 1] : null)
const share = v => totalLevel.value ? `${(v / totalLevel.value * 100).toFixed(1)}%` : ''
</script>

<template>
  <div class="ls">
    <p v-if="!ready" class="ls-msg">Loading sectors…</p>
    <p v-else-if="!sets.length" class="ls-msg">
      No sector data yet. Run <code>python labor.py update</code> to pull it.
    </p>
    <template v-else>
      <div class="ls-head">
        <div>
          <div class="ls-title">Jobs gained or lost by sector</div>
          <div class="ls-sub">
            Change through {{ monthLabel(period) }}
            <template v-if="totalChange != null"> · all sectors
              <b>{{ fmtChange(totalChange, true) }}</b></template>
          </div>
        </div>
        <div class="ls-ranges" role="group" aria-label="Change over">
          <button v-for="w in WINDOWS" :key="w.key" type="button" :class="{ on: span === w.key }"
                  :aria-pressed="span === w.key" @click="span = w.key">{{ w.label }}</button>
        </div>
      </div>

      <div class="ls-grid" role="table" aria-label="Job change by sector">
        <div class="ls-row ls-hrow" role="row">
          <span role="columnheader">Sector</span>
          <span role="columnheader" class="ls-axis"><i>lost</i><i>gained</i></span>
          <span role="columnheader" class="num">Change</span>
          <span role="columnheader" class="num">Jobs now</span>
          <span role="columnheader" class="num">Share</span>
        </div>
        <div v-for="r in rows" :key="r.id" class="ls-row" :class="{ sub: r.sub, group: r.group }" role="row">
          <span role="cell" class="ls-name">{{ r.name }}
            <small v-if="r.note || r.lag">{{ [r.note, r.lag && `through ${r.lag}`].filter(Boolean).join(' · ') }}</small>
          </span>
          <span role="cell" :class="r.hasBar ? 'ls-track' : ''">
            <span v-if="r.hasBar && r.v" class="ls-bar" :class="r.v > 0 ? 'up' : 'down'"
                  :style="{ width: width(r.v) }"></span>
          </span>
          <span role="cell" class="num"><b>{{ fmtChange(r.v, true) }}</b></span>
          <span role="cell" class="num ls-level">{{ fmtValue(r.level, true) }}</span>
          <span role="cell" class="num ls-level">{{ share(r.level) }}</span>
        </div>
      </div>

      <p class="ls-key">
        The latest two months are preliminary and get revised. Private plus public equals
        all sectors.
      </p>
    </template>
  </div>
</template>

<style scoped>
.ls { --up: #2a78d6; --down: #e34948; margin: 24px 0 32px; }
:global(.dark) .ls { --up: #3987e5; --down: #e66767; }

.ls-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px;
           flex-wrap: wrap; margin-bottom: 10px; }
.ls-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 17px;
            color: var(--vp-c-text-1); line-height: 1.3; }
.ls-sub { font-size: 12px; color: var(--vp-c-text-3); margin-top: 2px; }
.ls-sub b { color: var(--vp-c-text-1); }

.ls-ranges { display: inline-flex; border: 1px solid var(--vp-c-divider); border-radius: 6px;
             overflow: hidden; }
.ls-ranges button { font-size: 12px; padding: 3px 10px; color: var(--vp-c-text-2);
                    border-left: 1px solid var(--vp-c-divider); }
.ls-ranges button:first-child { border-left: 0; }
.ls-ranges button:hover { color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }
.ls-ranges button.on { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 600; }

.ls-grid { border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 4px 12px 8px; }
.ls-row { display: grid; grid-template-columns: minmax(120px, 1.5fr) 1.8fr 60px 60px 48px;
          align-items: center; gap: 10px; padding: 5px 0; font-size: 13px;
          color: var(--vp-c-text-2); }
.ls-row:hover:not(.ls-hrow) { background: var(--vp-c-bg-soft); }
.ls-hrow { font-size: 11px; color: var(--vp-c-text-3); border-bottom: 1px solid var(--vp-c-divider); }
.ls-axis { display: flex; justify-content: space-between; }
.ls-axis i { font-style: normal; }
.ls-name { color: var(--vp-c-text-1); line-height: 1.3; }
.ls-row.sub .ls-name { padding-left: 14px; color: var(--vp-c-text-2); }
.ls-row.group { border-top: 1px solid var(--vp-c-divider); margin-top: 4px; padding-top: 8px; }
.ls-hrow + .ls-row.group { border-top: 0; margin-top: 0; }
.ls-row.group .ls-name { font-weight: 600; }
.ls-name small { display: block; font-size: 11px; font-weight: 400; color: var(--vp-c-text-3); }
.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.num b { color: var(--vp-c-text-1); font-weight: 600; }

/* Bars grow from a center zero line: losses left, gains right. */
.ls-track { position: relative; height: 14px;
            background: linear-gradient(var(--vp-c-text-3), var(--vp-c-text-3)) center / 1px 100% no-repeat; }
.ls-bar { position: absolute; top: 1px; bottom: 1px; min-width: 2px; }
.ls-bar.up   { left: 50%;  background: var(--up);   border-radius: 0 4px 4px 0; }
.ls-bar.down { right: 50%; background: var(--down); border-radius: 4px 0 0 4px; }

.ls-key { font-size: 12px; color: var(--vp-c-text-3); margin: 8px 0 0; line-height: 1.5; }
.ls-msg { font-size: 13px; color: var(--vp-c-text-3); }
@media (max-width: 560px) {
  .ls-row { grid-template-columns: minmax(96px, 1.3fr) 1.4fr 56px; }
  .ls-level, .ls-hrow span:nth-child(n+4) { display: none; }
}
</style>

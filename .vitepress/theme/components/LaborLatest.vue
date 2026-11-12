<script setup>
// "Latest numbers" table for the Unemployment dashboard.
//
//   <LaborLatest series="UNRATE,U6RATE,CIVPART,EMRATIO,PAYEMS,USGOVT" />
//
// One row per series: latest month, change from the month before, change
// from a year earlier, and the record high and low with their dates.

import { ref, computed, onMounted } from 'vue'
import { loadLabor, SHORT, mi, monthLabel, isLevel, fmtValue, fmtChange } from './laborData.js'

const props = defineProps({
  series: { type: String, required: true },
})

const rows = ref([])
const generated = ref('')
const error = ref(null)

onMounted(async () => {
  try {
    const ids = props.series.split(',').map(s => s.trim()).filter(Boolean)
    const [index, ...sets] = await Promise.all([loadLabor('index'), ...ids.map(loadLabor)])
    generated.value = index.generated
    rows.value = sets.map(d => {
      const c = d.current, n = c.length, level = isLevel(d)
      // Look the comparison months up by date. A month can be missing
      // (no household survey for Oct 2025), so n - 2 is not always last month.
      const at = new Map(d.periods.map((p, i) => [mi(p), i]))
      const last = mi(d.periods[n - 1])
      const diff = back => {
        const i = at.get(last - back)
        return i === undefined ? 'n/a' : fmtChange(+(c[n - 1] - c[i]).toFixed(4), level)
      }
      let hi = 0, lo = 0
      for (let i = 1; i < n; i++) {
        if (c[i] > c[hi]) hi = i
        if (c[i] < c[lo]) lo = i
      }
      return {
        id: d.id,
        name: SHORT[d.id] || d.title,
        period: d.periods[n - 1],
        value: fmtValue(c[n - 1], level),
        open: d.status[n - 1] !== 2,
        mom: diff(1),
        yoy: diff(12),
        high: `${fmtValue(c[hi], level)} (${monthLabel(d.periods[hi])})`,
        low: `${fmtValue(c[lo], level)} (${monthLabel(d.periods[lo])})`,
        since: d.periods[0].slice(0, 4),
      }
    })
  } catch (e) {
    error.value = e.message
  }
})

const through = computed(() => rows.value.length ? monthLabel(rows.value[0].period) : '')
</script>

<template>
  <div class="ll">
    <p v-if="error" class="ll-msg ll-err">Could not load the latest numbers: {{ error }}</p>
    <p v-else-if="!rows.length" class="ll-msg">Loading latest numbers…</p>
    <template v-else>
      <p class="ll-as-of">Data through <b>{{ through }}</b> · pulled {{ generated }}</p>
      <table>
        <thead>
          <tr>
            <th>Measure</th><th class="num">Latest</th><th class="num">1 month</th>
            <th class="num">1 year</th><th>Record high</th><th>Record low</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.name }}<span class="ll-since">since {{ r.since }}</span></td>
            <td class="num"><b>{{ r.value }}</b></td>
            <td class="num">{{ r.mom }}</td>
            <td class="num">{{ r.yoy }}</td>
            <td>{{ r.high }}</td>
            <td>{{ r.low }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
.ll { margin: 16px 0 28px; }
.ll-as-of { font-size: 13px; color: var(--vp-c-text-2); margin: 0 0 8px; }
.ll table { display: table; width: 100%; margin: 0; font-size: 13.5px; }
.ll th, .ll td { padding: 7px 10px; }
.ll .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ll-since { display: block; font-size: 11px; color: var(--vp-c-text-3); }
.ll-msg { font-size: 13px; color: var(--vp-c-text-3); }
.ll-err { color: var(--vp-c-danger-1); }
@media (max-width: 640px) {
  .ll table { display: block; overflow-x: auto; }
}
</style>

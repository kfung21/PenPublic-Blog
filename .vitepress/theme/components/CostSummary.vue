<script setup>
// The Cost of Living page in four sentences, rebuilt from the data on every
// load so the wording never goes stale.
//
//   <CostSummary />

import { ref, onMounted } from 'vue'
import { loadLabor, loadPayment, fmtUnit, mi, monthLabel } from './laborData.js'

const BASE = '2020-01'
const lines = ref([])
const asOf = ref('')
const error = ref(null)

const pct = v => `${Math.abs(v).toFixed(1)}%`
const pts = v => `${Math.abs(v).toFixed(1)} points`

onMounted(async () => {
  try {
    const ids = ['CES0500000003', 'CPIAUCSL', 'CPILFESL', 'CUSR0000SEHA', 'CUSR0000SAF11', 'CUSR0000SETB01']
    const sets = await Promise.all(ids.map(loadLabor))
    const maps = sets.map(d => new Map(d.periods.map((p, i) => [p, d.current[i]])))

    // Latest month that every series has, along with its year-ago month.
    // Prices publish later than pay, and a month can be missing entirely.
    const prior = p => {
      const m = mi(p) - 12
      return `${Math.floor(m / 12)}-${String(m % 12 + 1).padStart(2, '0')}`
    }
    const usable = p => maps.every(m => m.has(p) && m.has(prior(p)) && m.has(BASE))
    const last = [...sets[1].periods].reverse().find(usable)
    if (!last) throw new Error('no month with every series')
    asOf.value = monthLabel(last)

    const since = k => (maps[k].get(last) / maps[k].get(BASE) - 1) * 100
    const yoy = k => (maps[k].get(last) / maps[k].get(prior(last)) - 1) * 100
    const [pay, prices, , rent, food, gas] = ids.map((_, k) => since(k))
    const payYoy = yoy(0), cpiYoy = yoy(1), coreYoy = yoy(2)
    const real = ((1 + payYoy / 100) / (1 + cpiYoy / 100) - 1) * 100
    const gap = pay - prices

    const out = []
    out.push({
      head: Math.abs(gap) < 1 ? 'Since 2020, pay and prices have risen about the same.'
        : gap > 0 ? 'Since 2020, pay has stayed slightly ahead of prices.'
        : 'Since 2020, prices have outrun pay.',
      body: `Hourly pay is up ${pct(pay)} since January 2020 and prices are up ${pct(prices)}. `
        + (gap > 0
          ? `All those raises left the average paycheck buying only about ${pct((((1 + pay / 100) / (1 + prices / 100)) - 1) * 100)} more.`
          : `The average paycheck buys about ${pct((((1 + pay / 100) / (1 + prices / 100)) - 1) * 100)} less than it did then.`),
    })
    out.push({
      head: real < -0.05 ? 'Right now, paychecks are losing ground.'
        : real > 0.05 ? 'Right now, paychecks are gaining ground.'
        : 'Right now, pay is only matching inflation.',
      body: `Over the past year pay rose ${pct(payYoy)} and prices rose ${pct(cpiYoy)}. `
        + `After inflation, an hour of work buys ${pct(real)} ${real < 0 ? 'less' : 'more'} than a year ago.`,
    })
    const spread = cpiYoy - coreYoy
    out.push({
      head: spread > 0.3 ? 'Food and energy are driving inflation.'
        : spread < -0.3 ? 'Food and energy are holding inflation down.'
        : 'Inflation is broad, not just food and energy.',
      body: `Inflation is ${pct(cpiYoy)}. Leaving out food and energy it is ${pct(coreYoy)}`
        + (Math.abs(spread) > 0.3 ? `, a gap of ${pts(spread)}.` : '.'),
    })
    const items = [['Gasoline', gas], ['Rent', rent], ['Groceries', food]]
    const ahead = items.filter(([, v]) => v > pay + 1).map(([n]) => n.toLowerCase())
    out.push({
      head: ahead.length ? `${ahead.join(' and ').replace(/^./, c => c.toUpperCase())} ${ahead.length > 1 ? 'have' : 'has'} risen faster than pay.`
        : 'The basics have risen about as fast as pay.',
      body: `Since January 2020: ${items.map(([n, v]) => `${n.toLowerCase()} ${v >= 0 ? 'up' : 'down'} ${pct(v)}`).join(', ')}, against pay up ${pct(pay)}.`,
    })
    // Housing, if the home price and mortgage rate have been pulled.
    try {
      const pay30 = await loadPayment('MSPUS', 'MORTGAGE30US', 'payment')
      const b = pay30.periods.findIndex(p => p >= BASE), n = pay30.current.length - 1
      if (b >= 0 && n > b) {
        const then = pay30.current[b], now = pay30.current[n]
        const chg = (now / then - 1) * 100
        out.push({
          head: chg > pay + 5 ? 'Buying a home has gotten much harder.'
            : chg < pay - 5 ? 'Buying a home has gotten easier relative to pay.'
            : 'The cost of buying a home has tracked pay.',
          body: `The monthly payment on a median-priced new home is about ${fmtUnit(now, 'dollars')}, `
            + `${chg >= 0 ? 'up' : 'down'} ${pct(chg)} from ${fmtUnit(then, 'dollars')} in early 2020. Pay is up ${pct(pay)}.`,
        })
      }
    } catch { /* housing series not pulled yet */ }
    lines.value = out
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <div class="cs">
    <p v-if="error" class="cs-msg">Could not build the summary: {{ error }}</p>
    <p v-else-if="!lines.length" class="cs-msg">Loading summary…</p>
    <template v-else>
      <ol>
        <li v-for="(l, i) in lines" :key="i"><b>{{ l.head }}</b> {{ l.body }}</li>
      </ol>
      <p class="cs-asof">National averages through {{ asOf }}, the latest month with both pay and prices.
        Updates with each data pull.</p>
    </template>
  </div>
</template>

<style scoped>
.cs { margin: 16px 0 8px; padding: 14px 18px; border: 1px solid var(--vp-c-divider);
      border-left: 3px solid var(--vp-c-brand-1); border-radius: 6px; background: var(--vp-c-bg-soft); }
.cs ol { margin: 0; padding-left: 20px; }
.cs li { margin: 6px 0; line-height: 1.6; }
.cs-asof { font-size: 12px; color: var(--vp-c-text-3); margin: 8px 0 0; }
.cs-msg { font-size: 13px; color: var(--vp-c-text-3); margin: 0; }
</style>

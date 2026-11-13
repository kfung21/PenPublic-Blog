// Shared pieces for the Unemployment dashboard components.
//
// Data lives in Unemployment/data/*.json, written by labor.py:
//   python labor.py export path\to\blog\Unemployment\data
// (or set LABOR_BLOG_DATA in .env and `python labor.py update` does it.)
//
// The files are bundled at build time, one lazy chunk per series, the same
// way RegionMap loads its state files. No public/ folder, no runtime fetch.

import { ref } from 'vue'

const FILES = import.meta.glob('../../../Unemployment/data/*.json')
const cache = new Map()

export function loadLabor(name) {
  if (!cache.has(name)) {
    const loader = FILES[`../../../Unemployment/data/${name}.json`]
    cache.set(name, loader
      ? loader().then(m => m.default)
      : Promise.reject(new Error(`no data file for ${name}`)))
  }
  return cache.get(name)
}

// One time range for every chart on the page. Changing it on any chart
// changes all of them, so the charts always show the same window.
export const RANGES = [
  { key: 'max', label: 'All', months: Infinity },
  { key: '50y', label: '50Y', months: 600 },
  { key: '20y', label: '20Y', months: 240 },
  { key: '10y', label: '10Y', months: 120 },
  { key: '5y',  label: '5Y',  months: 60 },
]
export const activeRange = ref('max')

// NBER recession months, peak month to trough month. The third item is the
// common name, shown above the band for the major ones and in the hover box.
// https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions
export const RECESSIONS = [
  ['1945-02', '1945-10', ''],
  ['1948-11', '1949-10', ''],
  ['1953-07', '1954-05', ''],
  ['1957-08', '1958-04', ''],
  ['1960-04', '1961-02', ''],
  ['1969-12', '1970-11', ''],
  ['1973-11', '1975-03', 'Oil crisis'],
  ['1980-01', '1980-07', ''],
  ['1981-07', '1982-11', "Early '80s"],
  ['1990-07', '1991-03', "Early '90s"],
  ['2001-03', '2001-11', 'Dot-com'],
  ['2007-12', '2009-06', 'Great Recession'],
  ['2020-02', '2020-04', 'COVID'],
]

// 'YYYY-MM' <-> absolute month index, so series with different start dates
// line up on one x axis.
export const mi = p => +p.slice(0, 4) * 12 + (+p.slice(5, 7) - 1)
export const fromMi = i => `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const monthLabel = p => `${MONTHS[+p.slice(5, 7) - 1]} ${p.slice(0, 4)}`

// Rates are percents. Everything else is a level in thousands of persons.
const RATES = new Set(['UNRATE', 'UNRATENSA', 'U1RATE', 'U2RATE', 'U4RATE',
                       'U5RATE', 'U6RATE', 'CIVPART', 'EMRATIO',
                       'JTSHIR', 'JTSLDR', 'JTSQUR', 'JTSJOR'])
export const unitOf = d => d.unit || (RATES.has(d.id) ? 'percent' : 'thousands')
export const isLevel = d => unitOf(d) === 'thousands'

// Format a value by its unit: percent, thousands (of persons), dollars, index.
export function fmtUnit(v, unit) {
  if (v == null) return 'n/a'
  if (unit === 'dollars') {
    const a = Math.abs(v)
    if (a >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
    if (a >= 100000) return `$${Math.round(v / 1000)}K`
    if (a >= 100) return `$${Math.round(v).toLocaleString('en-US')}`
    return `$${v.toFixed(2)}`
  }
  if (unit === 'index') return v.toFixed(1)
  if (unit === 'years') return `${v.toFixed(1)} yrs`
  return fmtValue(v, unit === 'thousands')
}

// --- derived series --------------------------------------------------------
// Built in the browser from the pulled files, matched month by month. Only
// months present in every input are kept, so a series that publishes a month
// late simply shortens the result instead of skewing it.

function combine(sets, id, title, unit, fn) {
  const maps = sets.map(d => new Map(d.periods.map((p, i) => [p, i])))
  const periods = sets[0].periods.filter(p => maps.every(m => m.has(p)))
  const pick = key => periods.map(p => fn(sets.map((d, k) => d[key][maps[k].get(p)])))
  return {
    id, title, unit, source: sets[0].source, model: sets[0].model,
    months: periods.length, periods,
    current: pick('current'), initial: pick('initial'),
    // provisional if any input is
    status: periods.map(p => Math.min(...sets.map((d, k) => d.status[maps[k].get(p)]))),
  }
}

export async function loadSum(ids, title) {
  const sets = await Promise.all(ids.map(loadLabor))
  return combine(sets, `SUM:${ids.join('+')}`, title, 'thousands',
    v => +v.reduce((a, b) => a + b, 0).toFixed(1))
}

export async function loadShare(num, den, title) {
  const sets = await Promise.all([loadLabor(num), loadLabor(den)])
  return combine(sets, `SHARE:${num}/${den}`, title, 'percent',
    ([a, b]) => +(a / b * 100).toFixed(2))
}

export async function loadRatio(num, den, title) {
  const sets = await Promise.all([loadLabor(num), loadLabor(den)])
  return combine(sets, `RATIO:${num}/${den}`, title, 'index', ([a, b]) => a / b)
}

// Monthly principal-and-interest payment on a home bought at `priceId`'s
// price with `down` paid up front and the rest borrowed for 30 years at
// `rateId`'s rate for that month. Taxes and insurance are not included.
export async function loadPayment(priceId, rateId, title, down = 0.2) {
  const [price, rate] = await Promise.all([loadLabor(priceId), loadLabor(rateId)])
  // One point per month of the rate series, so the latest point reflects the
  // latest rate. Prices come out quarterly: each month uses the most recent
  // price, as long as it is no more than five months old.
  const priceAt = new Map(price.periods.map((p, i) => [mi(p), i]))
  const periods = [], vals = [], status = []
  rate.periods.forEach((p, i) => {
    const m = mi(p), r = rate.current[i]
    let k
    for (let back = 0; back <= 5 && k === undefined; back++) k = priceAt.get(m - back)
    if (k === undefined || r == null || price.current[k] == null) return
    const monthly = r / 1200, loan = price.current[k] * (1 - down)
    periods.push(p)
    vals.push(Math.round(loan * monthly / (1 - Math.pow(1 + monthly, -360))))
    status.push(Math.min(price.status[k], rate.status[i]))
  })
  return {
    id: `PAYMENT:${priceId}@${rateId}`, title, unit: 'dollars',
    source: price.source, model: price.model, months: periods.length,
    periods, current: vals, initial: vals, status,
  }
}

// A series multiplied by a constant: weekly pay x 52 = pay per year.
export async function loadScaled(id, factor, title) {
  const d = await loadLabor(id)
  const f = v => v == null ? null : Math.round(v * factor)
  return { ...d, id: `${id}x${factor}`, title, current: d.current.map(f), initial: d.initial.map(f) }
}

// Latest value of a slower series (quarterly, annual) at or before month m,
// no older than `maxAge` months.
function carried(d, maxAge) {
  const at = new Map(d.periods.map((p, i) => [mi(p), i]))
  return m => {
    for (let back = 0; back <= maxAge; back++) {
      const i = at.get(m - back)
      if (i !== undefined && d.current[i] != null) return d.current[i]
    }
    return null
  }
}

// How many years of income a home costs: price / annual income, at each
// date the price is published. `perYear` turns weekly pay into yearly (52).
export async function loadYearsOfIncome(priceId, incomeId, title, perYear = 1, maxAge = 23) {
  const [price, income] = await Promise.all([loadLabor(priceId), loadLabor(incomeId)])
  const inc = carried(income, maxAge)
  const keep = price.periods.map((p, i) => i).filter(i => inc(mi(price.periods[i])) != null)
  const vals = keep.map(i => +(price.current[i] / (inc(mi(price.periods[i])) * perYear)).toFixed(2))
  return {
    id: `YEARS:${priceId}/${incomeId}`, title, unit: 'years', source: price.source,
    model: price.model, months: keep.length, periods: keep.map(i => price.periods[i]),
    current: vals, initial: vals, status: keep.map(i => price.status[i]),
  }
}

// The monthly mortgage payment as a percent of a typical worker's monthly
// pay (weekly pay x 52 / 12).
export async function loadBurden(priceId, rateId, weeklyPayId, title) {
  const [pay, weekly] = await Promise.all([
    loadPayment(priceId, rateId, title), loadLabor(weeklyPayId)])
  const wk = carried(weekly, 8)
  const keep = pay.periods.map((p, i) => i).filter(i => wk(mi(pay.periods[i])) != null)
  const vals = keep.map(i => +(pay.current[i] / (wk(mi(pay.periods[i])) * 52 / 12) * 100).toFixed(1))
  return { ...pay, id: `BURDEN:${pay.id}/${weeklyPayId}`, unit: 'percent', months: keep.length,
           periods: keep.map(i => pay.periods[i]), current: vals, initial: vals,
           status: keep.map(i => pay.status[i]) }
}

// Pay in dollars next to what pay would need to be to buy what it bought in
// the base month. Returns two series: actual pay, and base-month pay grown
// by prices. `scale` turns weekly pay into yearly (52).
export async function loadKeepUp(payId, cpiId, base, scale = 1) {
  const [pay, cpi] = await Promise.all([loadLabor(payId), loadLabor(cpiId)])
  const price = carried(cpi, 2)
  const b = pay.periods.findIndex(p => p >= base && price(mi(p)) != null)
  if (b < 0) throw new Error(`no ${payId} data from ${base}`)
  const cpi0 = price(mi(pay.periods[b])), pay0 = pay.current[b] * scale
  const keep = pay.periods.map((p, i) => i).filter(i => i >= b && price(mi(pay.periods[i])) != null)
  const shell = (id, title, vals) => ({
    id, title, unit: 'dollars', source: pay.source, model: pay.model, months: keep.length,
    periods: keep.map(i => pay.periods[i]), current: vals, initial: vals,
    status: keep.map(i => pay.status[i]),
  })
  const round = v => scale > 1 ? Math.round(v) : +v.toFixed(2)
  return [
    shell(`ACTUAL:${payId}`, 'Actual pay', keep.map(i => round(pay.current[i] * scale))),
    shell(`NEEDED:${payId}`, 'Pay needed to keep up with prices',
      keep.map(i => round(pay0 * price(mi(pay.periods[i])) / cpi0))),
  ]
}

// --- transforms ------------------------------------------------------------
// Prices and wages are index numbers and dollar amounts that only ever climb,
// so the charts show how fast they are changing instead of the raw level.

function remap(d, keep, fn, tag) {
  const idx = d.periods.map((p, i) => i).filter(keep)
  return {
    ...d, id: `${d.id}|${tag}`, unit: 'percent', months: idx.length,
    periods: idx.map(i => d.periods[i]),
    current: idx.map(i => fn(i)),
    initial: idx.map(i => fn(i)),
    status: idx.map(i => d.status[i]),
  }
}

// Percent change from the same month a year earlier. A month whose
// year-ago value was never published is left out.
export function yearOverYear(d) {
  const at = new Map(d.periods.map((p, i) => [mi(p), i]))
  const prev = i => at.get(mi(d.periods[i]) - 12)
  return remap(d, i => prev(i) !== undefined,
    i => +((d.current[i] / d.current[prev(i)] - 1) * 100).toFixed(2), 'yoy')
}

// Percent change since a base month ('YYYY-MM'). Earlier months are dropped.
export function changeSince(d, base) {
  const b = d.periods.findIndex(p => p >= base)
  if (b < 0) return remap(d, () => false, () => 0, `since${base}`)
  return remap(d, i => i >= b,
    i => +((d.current[i] / d.current[b] - 1) * 100).toFixed(2), `since${base}`)
}

// Tech proxy: the three payroll industries that are mostly IT services,
// cloud and web companies. Software publishers belongs here too, but FRED has
// no national series under the id we tried (CES5051320001), so it is left out. It counts every job at those employers
// and misses tech workers employed anywhere else.
export const TECH = ['CES6054150001', 'CES5051800001', 'CES5051900001']
export const TECH_TITLE = 'Tech industries (proxy)'

export function fmtValue(v, level) {
  if (v == null) return 'n/a'
  if (!level) return `${v.toFixed(1)}%`
  return Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${Math.round(v)}K`
}

export function fmtChange(v, level) {
  if (v == null) return 'n/a'
  const s = v > 0 ? '+' : v < 0 ? '−' : ''
  const a = Math.abs(v)
  if (!level) return `${s}${a.toFixed(1)} pts`
  if (a < 0.5) return '0K'
  return a >= 1000 ? `${s}${(a / 1000).toFixed(2)}M` : `${s}${Math.round(a)}K`
}

// Short display names. Anything not listed falls back to the file's title.
export const SHORT = {
  UNRATE: 'U-3 (official rate)',
  UNRATENSA: 'U-3, not seasonally adjusted',
  U1RATE: 'U-1', U2RATE: 'U-2', U4RATE: 'U-4', U5RATE: 'U-5', U6RATE: 'U-6',
  CIVPART: 'Labor force participation',
  EMRATIO: 'Employment to population',
  CLF16OV: 'Labor force',
  CE16OV: 'Employed',
  UNEMPLOY: 'Unemployed',
  LNS15000000: 'Not in labor force',
  NILFWJN: 'Not in labor force, want a job',
  PAYEMS: 'Nonfarm payroll jobs',
  USGOVT: 'Government payroll jobs',
  CES9091000001: 'Federal', CES9092000001: 'State', CES9093000001: 'Local',
  USPRIV: 'Private sector',
  CPIAUCSL: 'Prices (CPI, all items)', CPILFESL: 'Prices without food and energy',
  CUSR0000SAH1: 'Housing (shelter)', CUSR0000SEHA: 'Rent', CUSR0000SAF11: 'Groceries',
  CUSR0000SETB01: 'Gasoline',
  MSPUS: 'Median new home price',
  MEHOINUSA646N: 'Household income', LES1252881500Q: 'Full-time worker pay', MORTGAGE30US: '30-year mortgage rate', FEDFUNDS: 'Federal funds rate',
  CES0500000003: 'Hourly pay', AHETPI: 'Hourly pay, non-managers',
  JTSJOL: 'Job openings', LNU00000060: 'Ages 25 to 54', LNU00000036: 'Ages 20 to 24',
  JTSHIR: 'Hires', JTSLDR: 'Layoffs and firings', JTSQUR: 'Quits', JTSJOR: 'Job openings',
  CES6054150001: 'Computer systems design and IT services',
  CES5051800001: 'Cloud, data processing, web hosting',
  CES5051900001: 'Web search and other information services',
}

// Rows for the sector table. `group` rows are totals and get no bar; the
// `sub` rows under each one are its parts. `sum` rows are built from several
// series and overlap the sectors above them.
export const SECTORS = [
  { id: 'USPRIV',  name: 'Private sector', group: true },
  { id: 'USMINE',  name: 'Mining and logging', sub: true },
  { id: 'USCONS',  name: 'Construction', sub: true },
  { id: 'MANEMP',  name: 'Manufacturing', sub: true },
  { id: 'USTPU',   name: 'Trade, transportation, utilities', sub: true },
  { id: 'USINFO',  name: 'Information', sub: true },
  { id: 'USFIRE',  name: 'Financial activities', sub: true },
  { id: 'USPBS',   name: 'Professional and business services', sub: true },
  { id: 'USEHS',   name: 'Private education and health', sub: true },
  { id: 'USLAH',   name: 'Leisure and hospitality', sub: true },
  { id: 'USSERV',  name: 'Other services', sub: true },
  { id: 'USGOVT',  name: 'Public sector (government)', group: true },
  { id: 'CES9091000001', name: 'Federal', sub: true },
  { id: 'CES9092000001', name: 'State',   sub: true },
  { id: 'CES9093000001', name: 'Local',   sub: true },
  { id: 'TECH', sum: TECH, name: TECH_TITLE, group: true, bar: true,
    note: 'counted inside the private sectors above' },
]

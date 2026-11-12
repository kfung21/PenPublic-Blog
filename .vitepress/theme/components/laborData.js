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

// NBER recession months, peak month to trough month.
// https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions
export const RECESSIONS = [
  ['1945-02', '1945-10'], ['1948-11', '1949-10'], ['1953-07', '1954-05'],
  ['1957-08', '1958-04'], ['1960-04', '1961-02'], ['1969-12', '1970-11'],
  ['1973-11', '1975-03'], ['1980-01', '1980-07'], ['1981-07', '1982-11'],
  ['1990-07', '1991-03'], ['2001-03', '2001-11'], ['2007-12', '2009-06'],
  ['2020-02', '2020-04'],
]

// 'YYYY-MM' <-> absolute month index, so series with different start dates
// line up on one x axis.
export const mi = p => +p.slice(0, 4) * 12 + (+p.slice(5, 7) - 1)
export const fromMi = i => `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const monthLabel = p => `${MONTHS[+p.slice(5, 7) - 1]} ${p.slice(0, 4)}`

// Rates are small numbers (2.5 to 67.3). Levels are thousands of persons.
export const isLevel = d => Math.max(...d.current) > 1000

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
}

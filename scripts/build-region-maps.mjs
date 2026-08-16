// build-region-maps.mjs
// Converts Regions_XX.json + US county GeoJSON into per-state map data
// consumed by .vitepress/theme/components/RegionMap.vue
//
// Usage:  node scripts/build-region-maps.mjs
// Input:  regions-src/Regions_XX.json
//         regions-src/geojson-counties-fips.json  (auto-downloaded if missing)
// Output: public/region-maps/XX.json

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'regions-src')
const OUT = path.join(ROOT, 'public', 'region-maps')
const COUNTIES_URL = 'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json'
const COUNTIES_FILE = path.join(SRC, 'geojson-counties-fips.json')

const STATE_FIPS = {
  WA: ['53'], AZ: ['04'], CA: ['06'], CO: ['08'],
  DC: ['11', '51', '24'],           // DC regions span DC + VA + MD
  FL: ['12'], GA: ['13'], HI: ['15'], IL: ['17'], MI: ['26'],
  NC: ['37'], NV: ['32'], NY: ['36'], OH: ['39'], PA: ['42'], TX: ['48'],
}

const WIDTH = 900

const norm = s => s.toLowerCase().replace(/[^a-z]/g, '')

async function loadCounties() {
  if (!fs.existsSync(COUNTIES_FILE)) {
    console.log('Downloading county GeoJSON…')
    const res = await fetch(COUNTIES_URL)
    fs.writeFileSync(COUNTIES_FILE, Buffer.from(await res.arrayBuffer()))
  }
  return JSON.parse(fs.readFileSync(COUNTIES_FILE, 'utf-8')).features
}

// Collect every lon/lat ring of a feature
function rings(geom) {
  if (geom.type === 'Polygon') return geom.coordinates
  if (geom.type === 'MultiPolygon') return geom.coordinates.flat()
  return []
}

function buildState(st, features, regionsDef) {
  const fips = STATE_FIPS[st]
  const stateFeats = features.filter(f => fips.includes(f.properties.STATE))

  // name -> features (may collide: Fairfax County vs Fairfax city, etc.)
  const byName = new Map()
  for (const f of stateFeats) {
    const k = norm(f.properties.NAME)
    if (!byName.has(k)) byName.set(k, [])
    byName.get(k).push(f)
  }

  // Resolve a county name from a region file to one feature
  function resolve(name) {
    let k = norm(name)
    let wantCity = false
    if (!byName.has(k) && k.endsWith('city') && byName.has(k.slice(0, -4))) {
      k = k.slice(0, -4)          // "Fairfax City" -> "Fairfax" + prefer city
      wantCity = true
    }
    const cands = byName.get(k)
    if (!cands) throw new Error(`${st}: no county match for "${name}"`)
    if (cands.length === 1) return cands[0]
    const city = cands.find(f => f.properties.LSAD !== 'County')
    const county = cands.find(f => f.properties.LSAD === 'County')
    if (wantCity) return city || cands[0]
    // Bare name that exists as both: prefer County unless only the city
    // variant makes sense (VA independent cities listed by bare name)
    return county && !isCityOnlyName(st, k) ? county : (city || county)
  }
  // In the DC file, these bare names refer to independent cities even though
  // a same-named county exists elsewhere in VA
  const CITY_ONLY = { dc: new Set(['richmond']) } // none currently needed; kept for safety
  const isCityOnlyName = (state, k) => CITY_ONLY[state.toLowerCase()]?.has(k) ?? false

  // countyKey (GEO_ID) -> region indices
  const regionNames = regionsDef.map(r => r.Region)
  const countyMap = new Map() // GEO_ID -> { feature, regions: [i] }
  regionsDef.forEach((r, i) => {
    for (const cName of r.Counties) {
      const f = resolve(cName)
      const id = f.properties.GEO_ID
      if (!countyMap.has(id)) countyMap.set(id, { feature: f, regions: [] })
      countyMap.get(id).regions.push(i)
    }
  })

  const used = [...countyMap.values()]

  // ---- projection: plate carrée with cos(midLat) x-correction ----
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
  for (const { feature } of used) {
    for (const ring of rings(feature.geometry)) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }
  const midLat = (minLat + maxLat) / 2
  const kx = Math.cos((midLat * Math.PI) / 180)
  const spanX = (maxLon - minLon) * kx
  const spanY = maxLat - minLat
  const scale = WIDTH / spanX
  const height = Math.round(spanY * scale)

  const px = lon => ((lon - minLon) * kx * scale)
  const py = lat => ((maxLat - lat) * scale)
  const r1 = n => Math.round(n * 10) / 10

  function toPath(geom) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates
    let d = ''
    for (const poly of polys) {
      for (const ring of poly) {
        // drop consecutive points that round to the same pixel
        let last = null
        const pts = []
        for (const [lon, lat] of ring) {
          const x = r1(px(lon)), y = r1(py(lat))
          if (!last || last[0] !== x || last[1] !== y) pts.push([x, y])
          last = [x, y]
        }
        if (pts.length < 3) continue
        d += 'M' + pts.map(p => `${p[0]} ${p[1]}`).join('L') + 'Z'
      }
    }
    return d
  }

  const counties = used
    .map(({ feature, regions }) => ({
      name: feature.properties.NAME +
        (feature.properties.LSAD !== 'County' && feature.properties.STATE === '51' ? ' (city)' : ''),
      regions,
      d: toPath(feature.geometry),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    state: st,
    width: WIDTH,
    height,
    regions: regionNames,
    counties,
  }
}

const features = await loadCounties()
fs.mkdirSync(OUT, { recursive: true })

for (const st of Object.keys(STATE_FIPS)) {
  const srcFile = path.join(SRC, `Regions_${st}.json`)
  if (!fs.existsSync(srcFile)) { console.warn(`skip ${st} (no Regions_${st}.json)`); continue }
  const regionsDef = JSON.parse(fs.readFileSync(srcFile, 'utf-8'))
  const data = buildState(st, features, regionsDef)
  const outFile = path.join(OUT, `${st}.json`)
  fs.writeFileSync(outFile, JSON.stringify(data))
  const kb = (fs.statSync(outFile).size / 1024).toFixed(0)
  console.log(`${st}: ${data.regions.length} regions, ${data.counties.length} counties, ${kb} KB`)
}
console.log('Done → public/region-maps/')

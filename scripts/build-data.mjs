import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_IN = join(root, 'data')
const DATA_OUT = join(root, 'src', 'data')
const CATEGORY_IMAGES = join(root, 'public', 'images', 'categories')

mkdirSync(DATA_OUT, { recursive: true })

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++ } else { quoted = false }
      } else cell += c
      continue
    }
    if (c === '"') { quoted = true; continue }
    if (c === ',') { row.push(cell); cell = ''; continue }
    if (c === '\r') continue
    if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; continue }
    cell += c
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row) }

  const [header, ...body] = rows
  return body
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ''])))
}

const table = (name) =>
  parseCsv(readFileSync(join(DATA_IN, `${name}.csv`), 'utf8').replace(/^﻿/, ''))

const dedash = (v) => v.replace(/[^\S\n]+[—–][^\S\n]+/g, ', ')

function clean(value) {
  if (value == null) return null
  let v = dedash(String(value).replace(/[\t ]+/g, ' ').replace(/\s*\n\s*/g, ' ').trim())
  if (v.startsWith("'")) v = v.slice(1).trim()
  return v === '' ? null : v
}

function cleanText(value) {
  if (value == null) return null
  const v = String(value)
    .replace(/\r\n/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return v === '' ? null : dedash(v)
}

const bool = (value) => clean(value) === 'true'

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[”“"″]/g, ' inch ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseFrequency(value) {
  const v = clean(value)
  if (!v) return null
  const kilo = v.match(/^(\d+)k(\d*)$/i)
  if (kilo) return Number(`${kilo[1]}.${kilo[2] || '0'}`) * 1000
  const plain = Number(v.replace(/[^\d.]/g, ''))
  return Number.isFinite(plain) && v.match(/\d/) ? plain : null
}

const DOCUMENT_TITLE_FIXES = {
  'DFX Elevation': 'DXF Elevation',
  'WALL MOUNT': 'Wall Mount',
  YOKE: 'Yoke',
  'EASE DATA': 'Ease Data',
  'Detail Drawing': 'Detailed Drawing',
}
function documentTitle(value) {
  const v = clean(value)
  if (!v) return 'Download'
  return DOCUMENT_TITLE_FIXES[v] ?? v
}

const CATEGORY_ORDER = [
  'Vero', 'Vero VX', 'Evolution', 'Resolution', 'Horn Loaded Bass',
  'Bass Reflex', 'Compact', 'Compact Bass', 'Monitor', 'Dance Stack',
  'Public Address',
]
const categoryRank = (title) => {
  const i = CATEGORY_ORDER.indexOf(title)
  return i === -1 ? CATEGORY_ORDER.length : i
}

const categoryImages = existsSync(CATEGORY_IMAGES) ? readdirSync(CATEGORY_IMAGES) : []
function categoryImage(slug) {
  const file = categoryImages.find((f) => f.replace(/\.[^.]+$/, '') === slug)
  if (!file) throw new Error(`No hero image in public/images/categories for "${slug}"`)
  return `/images/categories/${file}`
}

const rawCategories = table('Categories')
const rawProducts = table('Products')

const categoryById = new Map()
for (const row of rawCategories) {
  const title = clean(row.Title)
  const slug = slugify(title)
  categoryById.set(row.ID, {
    slug,
    title,
    description: cleanText(row.Description),
    image: categoryImage(slug),
    visible: bool(row.visible),
  })
}

const categoryBySlug = new Map([...categoryById.values()].map((c) => [c.slug, c]))
const resolveCategory = (row) =>
  categoryById.get(row.Category) ?? categoryBySlug.get(slugify(clean(row.categoryName) ?? ''))

const index = (rows, key) => {
  const map = new Map()
  for (const row of rows) {
    const id = row[key]
    if (!id) continue
    if (!map.has(id)) map.set(id, [])
    map.get(id).push(row)
  }
  return map
}

const first = (map, id) => map.get(id)?.[0]

const overviews = index(table('Overviews'), 'product')
const specs = index(table('Specifications'), 'Product')
const extraSpecs = index(table('AdditionalSpecifications'), 'Product')
const drawings = index(table('Drawings'), 'product')
const downloads = index(table('Downloads'), 'Product')
const featureGroups = index(table('PerformanceFeatures'), 'product')

const bulletsByGroup = index(table('Performances'), 'performanceFeature')

const products = rawProducts.map((row) => {
  const id = row.ID
  const code = clean(row.Code)
  const category = resolveCategory(row)
  if (!category) throw new Error(`Product ${code} has no resolvable category`)

  const overview = first(overviews, id)
  const spec = first(specs, id)
  const extra = first(extraSpecs, id)
  const drawing = first(drawings, id)
  const group = first(featureGroups, id)

  const features = (bulletsByGroup.get(group?.ID) ?? [])
    .sort((a, b) => Number(a.index || 0) - Number(b.index || 0))
    .map((b) => clean(b.Title))
    .filter(Boolean)

  const slug = slugify(code)
  const remoteImage = clean(row['Main Image'])

  return {
    slug,
    code,
    tagline: clean(row.Name),
    categorySlug: category.slug,
    categoryTitle: category.title,
    visible: bool(row.visible),
    homepage: bool(row.homepage),
    image: `/images/products/${slug}.jpg`,
    remoteImage,
    summary: cleanText(overview?.description),
    description: cleanText(overview?.longDescription),
    headline: clean(group?.description),
    features,
    specs: spec
      ? {
          driver: clean(spec.Driver),
          operatingBand: clean(spec['Operating Band']),
          sensitivity: clean(spec['Sensitivity 1m']),
          power: clean(spec.Power),
          impedance: clean(spec['Nominal Impedance']),
          bandwidth: clean(extra?.['Bandwidth (-3db)']),
          weight: clean(extra?.Weight),
          dispersion: clean(extra?.['Nominal Dispersion']),
          connectors: clean(extra?.Connectors),
        }
      : null,
    drawing: clean(drawing?.technicalDrawing),
    comparisonChart: clean(drawing?.comparisonChart),
    documents: (downloads.get(id) ?? [])
      .map((d) => ({ title: documentTitle(d.Title), url: clean(d.file) }))
      .filter((d) => d.url)
      .sort((a, b) => a.title.localeCompare(b.title)),
  }
})

const richness = (p) =>
  Object.values(p).filter((v) => v != null && v !== '').length +
  p.features.length +
  p.documents.length +
  Object.values(p.specs ?? {}).filter(Boolean).length

function mergeDuplicates(group) {
  const [base, ...rest] = group.slice().sort((a, b) => richness(b) - richness(a))
  const documents = [...base.documents]
  for (const other of rest) {
    for (const doc of other.documents) {
      if (!documents.some((d) => d.url === doc.url)) documents.push(doc)
    }
  }
  return {
    ...base,
    documents: documents.sort((a, b) => a.title.localeCompare(b.title)),
    features: [...new Set(group.flatMap((p) => p.features))],
  }
}

function reconcile(rows) {
  const groups = new Map()
  for (const p of rows) {
    const key = `${p.slug}::${p.remoteImage ?? ''}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }
  return [...groups.values()].map((g) => (g.length === 1 ? g[0] : mergeDuplicates(g)))
}

const merged = reconcile(products)
const mergedCount = products.length - merged.length

const slugCounts = merged.reduce((acc, p) => acc.set(p.slug, (acc.get(p.slug) ?? 0) + 1), new Map())
for (const p of merged) {
  if (slugCounts.get(p.slug) > 1) p.image = `/images/products/${p.slug}-${p.categorySlug}.jpg`
}

products.length = 0
products.push(...merged)

const productKey = (p) => `${p.categorySlug}/${p.slug}`
const productBySlug = new Map(products.map((p) => [p.slug, p]))
const productById = new Map(rawProducts.map((row) => [row.ID, slugify(clean(row.Code))]))

const duplicateRoutes = products.length - new Set(products.map(productKey)).size
if (duplicateRoutes) throw new Error(`${duplicateRoutes} products share a category/slug route`)

const categories = [...categoryById.values()]
  .map((c) => ({
    ...c,
    productCount: products.filter((p) => p.categorySlug === c.slug && p.visible).length,
  }))
  .sort((a, b) => categoryRank(a.title) - categoryRank(b.title))

const settingsByCrossover = index(table('CrossoverSettings'), 'crossover')

const crossovers = table('Crossovers')
  .map((row) => {
    const title = clean(row.Title)
    const category = categoryById.get(row.Category)
    const rows = (settingsByCrossover.get(row.ID) ?? [])
      .map((r) => ({
        component: clean(r.Component),
        polarity: clean(r.Polarity),
        delay: clean(r.Delay),
        hpf: clean(r.HPF),
        hpt: clean(r.HPT),
        lpf: clean(r.LPF),
        lpt: clean(r.LPT),
        gain: clean(r.Gain),
      }))

      .sort((a, b) => (parseFrequency(a.hpf) ?? Infinity) - (parseFrequency(b.hpf) ?? Infinity))

    return {
      slug: slugify(title),
      title,
      categorySlug: category?.slug ?? null,
      categoryTitle: category?.title ?? null,
      rows,
    }
  })
  .sort((a, b) =>
    categoryRank(a.categoryTitle) - categoryRank(b.categoryTitle) ||
    a.title.localeCompare(b.title, 'en', { numeric: true }),
  )

const crossoverTitleCounts = crossovers.reduce(
  (acc, c) => acc.set(c.title, (acc.get(c.title) ?? 0) + 1), new Map(),
)
for (const c of crossovers) {
  if (crossoverTitleCounts.get(c.title) > 1 && c.rows[0]?.component) {
    const driver = c.rows[0].component
    c.title = `${c.title} (${driver})`
    c.slug = slugify(c.title)
  }
}

const duplicateCrossovers = crossovers.length - new Set(crossovers.map((c) => c.slug)).size
if (duplicateCrossovers) throw new Error(`${duplicateCrossovers} crossovers share a slug`)

const archives = table('GroupDownloads')
  .map((row) => {
    const code = clean(row.code)

    const file = decodeURIComponent(String(row.file).split('/').pop() ?? '')
    const category = categoryBySlug.get(slugify(clean(row.category) ?? ''))
    const productSlug = productById.get(row.product) ?? slugify(code)
    return {
      code,
      file,
      productSlug: productBySlug.has(productSlug) ? productSlug : null,
      categorySlug: category?.slug ?? null,
      categoryTitle: category?.title ?? null,
    }
  })
  .sort((a, b) =>
    categoryRank(a.categoryTitle) - categoryRank(b.categoryTitle) ||
    a.code.localeCompare(b.code, 'en', { numeric: true }),
  )

const SERVICE_ORDER = [
  'EQUIPMENT SALES', 'EQUIPMENT RENTAL', 'EQUIPMENT MAINTENANCE',
  'SOUND SYSTEM DESIGN & SETUP', 'SOUND SYSTEM CONSULTANCY', 'ROOM ACOUSTIC DESIGN',
]
const services = table('Services')
  .map((row) => ({ title: clean(row.Title), description: cleanText(row.Description) }))
  .sort((a, b) => SERVICE_ORDER.indexOf(a.title) - SERVICE_ORDER.indexOf(b.title))

const HOMEPAGE_ORDER = ['evo-6e', 'psm318', 'res-2']
const featured = products
  .filter((p) => p.homepage)
  .sort((a, b) => HOMEPAGE_ORDER.indexOf(a.slug) - HOMEPAGE_ORDER.indexOf(b.slug))

const write = (name, value) => {
  writeFileSync(join(DATA_OUT, name), `${JSON.stringify(value, null, 2)}\n`)
  const count = Array.isArray(value) ? value.length : Object.keys(value).length
  console.log(`  src/data/${name.padEnd(20)} ${String(count).padStart(4)} records`)
}

console.log('Building site data from data/*.csv')
write('categories.json', categories)
write('products.json', products)
write('crossovers.json', crossovers)
write('archives.json', archives)
write('services.json', services)
write('featured.json', featured.map((p) => p.slug))

const siteUrl = (process.env.SITE_URL ?? 'https://prosoundoffice.com').replace(/\/$/, '')

const routes = [
  '/',
  '/products',
  '/downloads',
  '/crossovers',
  '/support',
  ...categories.filter((c) => c.visible).map((c) => `/products/${c.slug}`),
  ...products.filter((p) => p.visible).map((p) => `/products/${p.categorySlug}/${p.slug}`),
  ...crossovers.map((c) => `/crossovers/${c.slug}`),
]

writeFileSync(
  join(root, 'public', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((r) => `  <url><loc>${siteUrl}${r}</loc></url>`).join('\n') +
    `\n</urlset>\n`,
)
console.log(`  public/sitemap.xml       ${String(routes.length).padStart(4)} routes`)

const warn = []
const missingImage = products.filter((p) => !p.remoteImage).map((p) => p.code)
if (missingImage.length) warn.push(`no source image: ${missingImage.join(', ')}`)

const emptyCrossovers = crossovers.filter((c) => !c.rows.length).map((c) => c.title)
if (emptyCrossovers.length) warn.push(`crossovers with no rows: ${emptyCrossovers.join(', ')}`)

const orphanArchives = archives.filter((a) => !a.productSlug).map((a) => a.code)
if (orphanArchives.length) warn.push(`archives not matched to a product: ${orphanArchives.join(', ')}`)

const noSpec = products.filter((p) => p.visible && !p.specs).map((p) => p.code)
if (noSpec.length) warn.push(`listed products with no specification: ${noSpec.join(', ')}`)

console.log(
  `\n${categories.length} categories (${categories.filter((c) => c.visible).length} listed) · ` +
  `${products.length} products (${products.filter((p) => p.visible).length} listed) · ` +
  `${crossovers.length} crossovers · ${archives.length} archives`,
)
if (warn.length) console.log(`\nNotes:\n${warn.map((w) => `  - ${w}`).join('\n')}`)

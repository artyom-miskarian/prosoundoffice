import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public', 'images', 'products')
const CONCURRENCY = 6
const RETRIES = 3
const force = process.argv.includes('--force')

const products = JSON.parse(
  await import('node:fs').then((fs) =>
    fs.promises.readFile(join(root, 'src', 'data', 'products.json'), 'utf8'),
  ),
)

mkdirSync(OUT, { recursive: true })

function sized(url) {
  const u = new URL(url)
  u.search = ''
  u.searchParams.set('fm', 'jpg')
  u.searchParams.set('q', '82')
  u.searchParams.set('w', '1000')
  return u.toString()
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function download(product) {
  const target = join(OUT, basename(product.image))

  if (!product.remoteImage) return { slug: product.slug, status: 'no-source' }
  if (!force && existsSync(target) && statSync(target).size > 0) {
    return { slug: product.slug, status: 'skipped' }
  }

  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(sized(product.remoteImage))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const body = Buffer.from(await res.arrayBuffer())
      if (body.length < 1024) throw new Error(`suspiciously small (${body.length} B)`)
      writeFileSync(target, body)
      return { slug: product.slug, status: 'downloaded', bytes: body.length }
    } catch (error) {
      if (attempt === RETRIES) {
        return { slug: product.slug, status: 'failed', error: error.message }
      }
      await sleep(attempt * 500)
    }
  }
}

async function pool(items, worker, size) {
  const results = []
  let cursor = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (cursor < items.length) results.push(await worker(items[cursor++]))
    }),
  )
  return results
}

console.log(`Mirroring ${products.length} product images into public/images/products/`)
const results = await pool(products, download, CONCURRENCY)

const by = (status) => results.filter((r) => r.status === status)
const downloaded = by('downloaded')
const bytes = downloaded.reduce((sum, r) => sum + r.bytes, 0)

console.log(
  `\n${downloaded.length} downloaded (${(bytes / 1e6).toFixed(1)} MB) · ` +
  `${by('skipped').length} already present · ${by('failed').length} failed`,
)

for (const r of [...by('failed'), ...by('no-source')]) {
  console.log(`  ${r.status}: ${r.slug}${r.error ? ` — ${r.error}` : ''}`)
}

if (by('failed').length) {
  console.log('\nFailed images fall back to the remote URL at runtime. Re-run to retry.')
  process.exitCode = 1
}

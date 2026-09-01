import { readdirSync, statSync, unlinkSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const IMAGES = join(root, 'public', 'images')

const QUALITY = 78

const QUALITIES = { 'sound-sphere': 50 }

const WIDTHS = {
  categories: 1600,
  brand: null,
}

const BRAND_WIDTHS = {
  'sound-sphere': 1128,
  'banner': 1913,
  'tony-andrews': 960,
  'funktion-one': 1000,
}

const DEAD = [
  'brand/wireframe.png',
  'brand/logo.svg',
  'brand/download.svg',
]

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

let before = 0
let after = 0

for (const group of ['categories', 'brand']) {
  const dir = join(IMAGES, group)
  for (const file of readdirSync(dir).sort()) {
    const ext = extname(file).toLowerCase()
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue

    const from = join(dir, file)
    const name = basename(file, ext)
    if (DEAD.some((d) => d.endsWith(`${group === 'brand' ? 'brand/' : ''}${file}`))) continue

    const to = join(dir, `${name}.webp`)
    const width = group === 'brand' ? BRAND_WIDTHS[name] ?? 1600 : WIDTHS[group]

    const sizeBefore = statSync(from).size
    const image = sharp(from)
    const meta = await image.metadata()

    await image
      .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
      .webp({ quality: QUALITIES[name] ?? QUALITY })
      .toFile(to)

    const sizeAfter = statSync(to).size
    before += sizeBefore
    after += sizeAfter
    console.log(
      `  ${group}/${file.padEnd(22)} ${kb(sizeBefore).padStart(8)} -> ${kb(sizeAfter).padStart(8)}` +
      `  (${meta.width}px -> ${Math.min(width, meta.width)}px)`,
    )
    unlinkSync(from)
  }
}

for (const rel of DEAD) {
  const file = join(IMAGES, rel)
  if (existsSync(file)) {
    before += statSync(file).size
    unlinkSync(file)
    console.log(`  removed ${rel} (unreferenced)`)
  }
}

const OG_DIR = join(root, 'public', 'og')
mkdirSync(OG_DIR, { recursive: true })

const source = join(IMAGES, 'categories', 'evolution.webp')
const wordmark = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <text x="72" y="500" font-family="Archivo, Helvetica, Arial, sans-serif"
           font-size="64" font-weight="700" letter-spacing="2" fill="#ffffff">PRO SOUND OFFICE</text>
     <text x="72" y="556" font-family="Archivo, Helvetica, Arial, sans-serif"
           font-size="30" font-weight="500" letter-spacing="4" fill="#b0b0b0">OFFICIAL FUNKTION-ONE DISTRIBUTOR · ARMENIA</text>
   </svg>`,
)

await sharp(source)
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
  .modulate({ brightness: 0.55 })
  .composite([{ input: wordmark, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(OG_DIR, 'default.jpg'))

const ogSize = statSync(join(OG_DIR, 'default.jpg')).size
after += ogSize
console.log(`  og/default.jpg           ${' '.repeat(8)}    ${kb(ogSize).padStart(8)}  (1200x630, generated)`)

console.log(`\n${kb(before)} -> ${kb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`)

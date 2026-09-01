import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(root, 'dist')

const routes = JSON.parse(readFileSync(join(root, 'src', 'data', 'routes.json'), 'utf8'))
const { render } = await import(pathToFileURL(join(root, 'dist-server', 'entry-server.js')))

const TEMPLATE_SNAPSHOT = join(root, 'dist-server', 'template.html')

if (!existsSync(TEMPLATE_SNAPSHOT)) {
  copyFileSync(join(DIST, 'index.html'), TEMPLATE_SNAPSHOT)
}

const template = readFileSync(TEMPLATE_SNAPSHOT, 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    'dist-server/template.html has no empty <div id="root"></div>. ' +
    'Delete dist-server/ and re-run the full build.',
  )
}

const HEAD_TAG = /^\s*(<title>[\s\S]*?<\/title>|<meta\b[^>]*?\/?>|<link\b[^>]*?\/?>)/

function splitHead(html) {
  let head = ''
  let body = html
  for (;;) {
    const match = body.match(HEAD_TAG)
    if (!match) return { head, body }
    head += match[1]
    body = body.slice(match[0].length)
  }
}

function buildPage(head, body) {
  return template
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

function outputPath(routePath) {
  return routePath === '/'
    ? join(DIST, 'index.html')
    : join(DIST, routePath.slice(1), 'index.html')
}

let written = 0
const failures = []

for (const route of routes) {
  const html = await render(route.path)
  const { head, body } = splitHead(html)

  if (body.includes('Page not found')) {
    failures.push(`${route.path} rendered the 404 component`)
    continue
  }
  if (!head.includes('<title>')) failures.push(`${route.path} produced no <title>`)

  const file = outputPath(route.path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, buildPage(head, body))
  written += 1
}

const notFound = await render('/__not-found__')
const { head: nfHead, body: nfBody } = splitHead(notFound)
if (!nfBody.includes('Page not found')) {
  failures.push('the catch-all route did not render the 404 component')
}
writeFileSync(join(DIST, '404.html'), buildPage(nfHead, nfBody))

if (failures.length) {
  console.error(`\nPrerender failed:\n${failures.map((f) => `  - ${f}`).join('\n')}`)
  process.exit(1)
}

console.log(`Prerendered ${written} routes + 404.html`)

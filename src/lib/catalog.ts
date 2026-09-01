import categoriesJson from '../data/categories.json'
import productsJson from '../data/products.json'
import crossoversJson from '../data/crossovers.json'
import archivesJson from '../data/archives.json'
import servicesJson from '../data/services.json'
import featuredJson from '../data/featured.json'
import type { Archive, Category, Crossover, Product, Service } from './types'

export const categories = categoriesJson as Category[]
export const products = productsJson as Product[]
export const crossovers = crossoversJson as Crossover[]
export const archives = archivesJson as Archive[]
export const services = servicesJson as Service[]

export const listedCategories = categories.filter((c) => c.visible)

export const featuredProducts = (featuredJson as string[])
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is Product => Boolean(p))

export const findCategory = (slug?: string) =>
  categories.find((c) => c.slug === slug)

export const findProduct = (categorySlug?: string, slug?: string) =>
  products.find((p) => p.categorySlug === categorySlug && p.slug === slug)

const byCode = (a: Product, b: Product) =>
  a.code.localeCompare(b.code, 'en', { numeric: true })

export const productsInCategory = (categorySlug: string) =>
  products.filter((p) => p.categorySlug === categorySlug && p.visible).sort(byCode)

export const allInCategory = (categorySlug: string) =>
  products.filter((p) => p.categorySlug === categorySlug).sort(byCode)

const slugCounts = products.reduce(
  (acc, p) => acc.set(p.slug, (acc.get(p.slug) ?? 0) + 1),
  new Map<string, number>(),
)

export const isAmbiguousCode = (product: Product) =>
  (slugCounts.get(product.slug) ?? 0) > 1

export function canonicalProductPath(product: Product) {
  const same = products.filter((p) => p.slug === product.slug)
  if (same.length < 2) return `/products/${product.categorySlug}/${product.slug}`

  const preferred =
    same.find((p) => categories.find((c) => c.slug === p.categorySlug)?.visible) ?? same[0]
  return `/products/${preferred.categorySlug}/${preferred.slug}`
}

export const findCrossover = (slug?: string) =>
  crossovers.find((c) => c.slug === slug)

export function groupByCategory<T extends { categoryTitle: string | null }>(rows: T[]) {
  const groups: { title: string; rows: T[] }[] = []
  for (const row of rows) {
    const title = row.categoryTitle ?? 'Other'
    const last = groups.at(-1)
    if (last?.title === title) last.rows.push(row)
    else groups.push({ title, rows: [row] })
  }
  return groups
}

export const hasDetail = (product: Product) =>
  Boolean(product.description || product.features.length || product.specs)

import { address, contact, partner, site } from '../config'
import { SITE_URL, absoluteUrl, postalAddress } from './seo'
import type { Category, Crossover, Product } from './types'

type Node = Record<string, unknown>

const BUSINESS_ID = `${SITE_URL}/#business`
const WEBSITE_ID = `${SITE_URL}/#website`

export const business = (): Node => ({
  '@type': 'LocalBusiness',
  '@id': BUSINESS_ID,
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: SITE_URL,
  logo: absoluteUrl('/favicon.png'),
  image: absoluteUrl('/og/default.jpg'),
  telephone: contact.phone,
  email: contact.email,
  address: postalAddress,
  areaServed: { '@type': 'Country', name: 'Armenia' },
  sameAs: [contact.instagramUrl],
  brand: { '@type': 'Brand', name: partner.name, alternateName: partner.alsoWrittenAs },
  knowsAbout: [
    partner.name,
    ...partner.alsoWrittenAs,
    'Professional audio',
    'Sound system design',
    'Room acoustics',
  ],
  ...(address.openingHours ? { openingHours: address.openingHours } : {}),
  ...(address.mapUrl ? { hasMap: address.mapUrl } : {}),
})

export const website = (): Node => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: site.name,
  inLanguage: 'en',
  publisher: { '@id': BUSINESS_ID },
})

export const breadcrumbs = (trail: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
})

const SPEC_LABELS: Record<string, string> = {
  driver: 'Drivers',
  operatingBand: 'Operating band',
  bandwidth: 'Bandwidth',
  sensitivity: 'Sensitivity',
  power: 'Power',
  impedance: 'Impedance',
  dispersion: 'Dispersion',
  connectors: 'Connectors',
  weight: 'Weight',
}

export const product = (item: Product, path: string): Node => ({
  '@type': 'Product',
  name: `${partner.name} ${item.code}`,
  sku: item.code,
  mpn: item.code,
  url: absoluteUrl(path),
  image: absoluteUrl(item.image),
  brand: { '@type': 'Brand', name: partner.name, alternateName: partner.alsoWrittenAs },
  category: item.categoryTitle ?? undefined,
  description: item.summary ?? item.description ?? item.tagline ?? undefined,
  ...(item.specs
    ? {
        additionalProperty: Object.entries(item.specs)
          .filter(([, value]) => Boolean(value))
          .map(([key, value]) => ({
            '@type': 'PropertyValue',
            name: SPEC_LABELS[key] ?? key,
            value,
          })),
      }
    : {}),
})

export const collection = (name: string, path: string, items: { path: string }[]): Node => ({
  '@type': 'CollectionPage',
  name,
  url: absoluteUrl(path),
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(item.path),
    })),
  },
})

export const categoryPage = (item: Category, path: string, products: Product[]): Node =>
  collection(
    `${partner.name} ${item.title}`,
    path,
    products.map((p) => ({ path: `/products/${p.categorySlug}/${p.slug}` })),
  )

export const crossoverPage = (item: Crossover, path: string): Node => ({
  '@type': 'TechArticle',
  headline: `${item.title} crossover settings`,
  url: absoluteUrl(path),
  about: { '@type': 'Brand', name: partner.name, alternateName: partner.alsoWrittenAs },
  publisher: { '@id': BUSINESS_ID },
  isPartOf: { '@id': WEBSITE_ID },
})

export const contactPage = (path: string): Node => ({
  '@type': 'ContactPage',
  name: 'Support',
  url: absoluteUrl(path),
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': BUSINESS_ID },
})

export const graph = (...nodes: Node[]) => ({
  '@context': 'https://schema.org',
  '@graph': [business(), website(), ...nodes],
})

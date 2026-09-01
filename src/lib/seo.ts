import { address, contact, partner, site } from '../config'

export const SITE_URL = 'https://prosoundoffice.com'

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

export const OG_IMAGE = '/og/default.jpg'

export function truncate(text: string, max = 155) {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat

  const cut = flat.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-—]$/, '')}…`
}

export const pageTitle = (title?: string) =>
  title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`

export const home = {
  title: `${partner.name} Armenia — Official Distributor`,
  description:
    `Official ${partner.name} distributor in Armenia. ${site.legalName} supplies, installs ` +
    'and services professional loudspeakers and sound systems from Yerevan.',
} as const

export const titles = {
  products: `${partner.name} Loudspeakers & Sound Systems`,
  range: `The Complete ${partner.name} Range — All Models`,
  crossovers: `${partner.name} Crossover Settings & DSP Presets`,
  downloads: `${partner.name} Manuals, Spec Sheets & CAD Downloads`,
  support: `Support & Contact — ${partner.name} Armenia`,
} as const

const TITLE_BUDGET = 70

export function fitTitle(head: string, ...optional: (string | null | undefined)[]) {
  const suffix = ` | ${site.name}`.length
  let parts = optional.filter((part): part is string => Boolean(part))

  for (;;) {
    const candidate = [head, ...parts].join(' — ')
    if (parts.length === 0 || candidate.length + suffix <= TITLE_BUDGET) return candidate
    parts = parts.slice(0, -1)
  }
}

export const categoryTitle = (title: string) =>
  `${partner.name} ${title} Series Loudspeakers`

export const productTitle = (
  code: string,
  tagline: string | null,
  qualifier?: string,
) => {
  const head = `${partner.name} ${code}`
  const budgeted = fitTitle(head, tagline)
  if (!qualifier) return budgeted
  return budgeted === head ? fitTitle(head, qualifier) : budgeted
}

export const crossoverTitle = (title: string) =>
  fitTitle(`${title} Crossover Settings`, partner.name)

export const productDescription = (summary: string, code: string) =>
  summary.includes(partner.name) || !summary.startsWith(code)
    ? summary
    : `${partner.name} ${summary}`

export const postalAddress = {
  '@type': 'PostalAddress',
  ...(address.street ? { streetAddress: address.street } : {}),
  addressLocality: address.city,
  addressRegion: address.region,
  ...(address.postalCode ? { postalCode: address.postalCode } : {}),
  addressCountry: address.country,
} as const

export const contactPoints = {
  telephone: contact.phone,
  email: contact.email,
} as const

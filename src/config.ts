export const site = {
  name: 'Pro Sound Office',
  legalName: 'Pro Sound Office LLC',
  tagline: 'Professional Sound Systems | Armenia',
  description:
    'An independent Yerevan-based company specializing in sound engineering and audio equipment distribution.',
} as const

export const contact = {
  phone: '+374 44 124124',
  phoneHref: '+37444124124',
  email: 'info@prosoundoffice.com',
  instagram: '@prosoundyvn',
  instagramUrl: 'https://www.instagram.com/prosoundyvn/',
  location: 'Yerevan, Armenia',
} as const

export const partner = {
  name: 'Funktion-One',
  url: 'https://funktion-one.com',
} as const

export const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY ?? ''

export const downloadsBaseUrl = (
  import.meta.env.VITE_DOWNLOADS_BASE_URL ?? ''
).replace(/\/$/, '')

export const archiveUrl = (file: string) =>
  downloadsBaseUrl ? `${downloadsBaseUrl}/${encodeURIComponent(file)}` : ''

export const nav = [
  { label: 'Products', to: '/products' },
  { label: 'Downloads', to: '/downloads' },
  { label: 'Crossovers', to: '/crossovers' },
  { label: 'Support', to: '/support' },
] as const

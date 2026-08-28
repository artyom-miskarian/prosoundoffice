export interface Category {
  slug: string
  title: string
  description: string | null
  image: string
  visible: boolean
  productCount: number
}

export interface Specs {
  driver: string | null
  operatingBand: string | null
  sensitivity: string | null
  power: string | null
  impedance: string | null
  bandwidth: string | null
  weight: string | null
  dispersion: string | null
  connectors: string | null
}

export interface ProductDocument {
  title: string
  url: string
}

export interface Product {
  slug: string
  code: string
  tagline: string | null
  categorySlug: string
  categoryTitle: string
  visible: boolean
  homepage: boolean
  image: string
  remoteImage: string | null
  summary: string | null
  description: string | null
  headline: string | null
  features: string[]
  specs: Specs | null
  drawing: string | null
  comparisonChart: string | null
  documents: ProductDocument[]
}

export interface CrossoverRow {
  component: string | null
  polarity: string | null
  delay: string | null
  hpf: string | null
  hpt: string | null
  lpf: string | null
  lpt: string | null
  gain: string | null
}

export interface Crossover {
  slug: string
  title: string
  categorySlug: string | null
  categoryTitle: string | null
  rows: CrossoverRow[]
}

export interface Archive {
  code: string
  file: string
  productSlug: string | null
  categorySlug: string | null
  categoryTitle: string | null
}

export interface Service {
  title: string
  description: string | null
}

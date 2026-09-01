import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import CategoryCard from '../components/CategoryCard'
import Button from '../components/Button'
import Seo from '../components/Seo'
import { listedCategories, products } from '../lib/catalog'
import { partner, site } from '../config'
import { titles } from '../lib/seo'
import { collection, graph } from '../lib/jsonLd'

const INTRO =
  `${site.name} is the exclusive ${partner.name} distributor in Armenia. Every range ` +
  'below is stocked and supported locally, with technical documentation, crossover ' +
  'settings and installation support from our engineers in Yerevan.'

const SPELLING =
  `${partner.name} is often written Function One or Function 1. It is the same British ` +
  'manufacturer, founded by Tony Andrews, and this is its official Armenian distributor.'

const DESCRIPTION =
  'Funktion-One loudspeakers and sound systems in Armenia: Evolution, Resolution, ' +
  'Horn Loaded Bass, Compact and Monitor ranges, stocked and supported from Yerevan.'

export default function Products() {
  return (
    <>
      <Seo
        title={titles.products}
        description={DESCRIPTION}
        path="/products"
        image="/images/categories/evolution.webp"
        jsonLd={graph(
          collection(titles.products, '/products', listedCategories.map((c) => ({
            path: `/products/${c.slug}`,
          }))),
        )}
      />

      <PageHeader
        title="Products"
        intro={
          <>
            <p>{INTRO}</p>
            <p className="mt-3 text-faint">{SPELLING}</p>
          </>
        }
      />

      <Container className="py-section">
        <div className="mb-10 flex items-center gap-5">
          <h2 className="caps text-xs text-bright">{partner.name}</h2>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listedCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        <div className="mt-14 border border-line bg-card p-8 sm:p-10">
          <h2 className="caps text-lg">Looking for something else?</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed">
            The ranges above are what we stock. {partner.name} builds {products.length}{' '}
            enclosures in total (Vero, Vero VX, Bass Reflex, Dance Stack and Public
            Address included), and we can source any of them. Full specifications and
            documentation for every model are on the site.
          </p>
          <Button to="/products/range" variant="outline" className="mt-8">
            The complete {partner.name} range
          </Button>
        </div>
      </Container>
    </>
  )
}

import { useParams } from 'react-router-dom'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import NotFound from './NotFound'
import Seo from '../components/Seo'
import { findCategory, productsInCategory } from '../lib/catalog'
import { partner } from '../config'
import { categoryTitle } from '../lib/seo'
import { breadcrumbs, categoryPage, graph } from '../lib/jsonLd'

export default function Category() {
  const { categorySlug } = useParams()
  const category = findCategory(categorySlug)

  if (!category) return <NotFound />

  const products = productsInCategory(category.slug)
  const path = `/products/${category.slug}`

  return (
    <>
      <Seo
        title={categoryTitle(category.title)}
        description={
          category.description ??
          `${partner.name} ${category.title} loudspeakers, distributed in Armenia by Pro Sound Office.`
        }
        path={path}
        image={category.image}
        noindex={!category.visible}
        jsonLd={graph(
          categoryPage(category, path, products),
          breadcrumbs([
            { name: 'Products', path: '/products' },
            { name: category.title, path },
          ]),
        )}
      />

      <div className="relative border-b border-line">
        <img
          src={category.image}
          alt={`${partner.name} ${category.title} series loudspeakers`}
          className="h-56 w-full object-cover sm:h-72 lg:h-80"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent"
          aria-hidden="true"
        />
      </div>

      <PageHeader
        title={category.title}
        crumbs={[{ label: 'Products', to: '/products' }]}
        intro={category.description && <p>{category.description}</p>}
      />

      <Container className="py-section">
        {products.length > 0 ? (
          <>
            <div className="mb-10 flex items-center gap-5">
              <h2 className="caps text-xs text-bright">
                {products.length} {products.length === 1 ? 'Model' : 'Models'}
              </h2>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="border border-line bg-card p-10 text-center">
            <h2 className="caps text-lg">Nothing listed yet</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed">
              We don&apos;t currently stock models from this range. Get in touch and
              we&apos;ll source what you need.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/products/range" variant="outline">
                See this range
              </Button>
              <Button to="/support" variant="outline">
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  )
}

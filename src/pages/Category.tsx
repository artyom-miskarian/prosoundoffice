import { useParams } from 'react-router-dom'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import NotFound from './NotFound'
import { findCategory, productsInCategory } from '../lib/catalog'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Category() {
  const { categorySlug } = useParams()
  const category = findCategory(categorySlug)

  useDocumentTitle(category?.title ?? 'Not found', category?.description ?? undefined)

  if (!category) return <NotFound />

  const products = productsInCategory(category.slug)

  return (
    <>
      <div className="relative border-b border-line">
        <img
          src={category.image}
          alt={category.title}
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
            <Button to="/support" variant="outline" className="mt-8">
              Contact Us
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}

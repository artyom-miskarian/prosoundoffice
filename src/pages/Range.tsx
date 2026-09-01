import { Link } from 'react-router-dom'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import ProductImage from '../components/ProductImage'
import Seo from '../components/Seo'
import { allInCategory, categories, products } from '../lib/catalog'
import { partner } from '../config'
import { titles } from '../lib/seo'
import { breadcrumbs, collection, graph } from '../lib/jsonLd'

const INTRO =
  `Every enclosure ${partner.name} builds, across all ${categories.length} ranges, with ` +
  'full specifications, technical drawings and the manufacturer document set for each. ' +
  'Ranges we hold in stock are marked; anything else we can source.'

export default function Range() {
  const groups = categories
    .map((category) => ({ category, models: allInCategory(category.slug) }))
    .filter((group) => group.models.length > 0)

  return (
    <>
      <Seo
        title={titles.range}
        description={
          `All ${products.length} ${partner.name} loudspeakers and subwoofers across ` +
          `${categories.length} ranges — Vero, Evolution, Resolution, Horn Loaded Bass, ` +
          'Compact and more, with specifications and documentation.'
        }
        path="/products/range"
        jsonLd={graph(
          collection(
            titles.range,
            '/products/range',
            products.map((p) => ({ path: `/products/${p.categorySlug}/${p.slug}` })),
          ),
          breadcrumbs([
            { name: 'Products', path: '/products' },
            { name: 'Complete Range', path: '/products/range' },
          ]),
        )}
      />

      <PageHeader
        title={`The Complete ${partner.name} Range`}
        crumbs={[{ label: 'Products', to: '/products' }, { label: 'Complete Range' }]}
        intro={<p>{INTRO}</p>}
      />

      <Container className="py-section">
        {groups.map(({ category, models }) => (
          <section key={category.slug} className="mt-16 first:mt-0">
            <div className="mb-8 flex flex-wrap items-center gap-5">
              <h2 className="caps text-sm text-bright">
                {category.visible ? (
                  <Link
                    to={`/products/${category.slug}`}
                    className="transition-colors hover:text-muted"
                  >
                    {category.title}
                  </Link>
                ) : (
                  category.title
                )}
              </h2>
              <span className="caps text-[11px] text-faint">
                {models.length} {models.length === 1 ? 'model' : 'models'}
                {category.visible ? ' · in stock' : ' · to order'}
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>

            {category.description && (
              <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted">
                {category.description}
              </p>
            )}

            <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {models.map((product) => (
                <li key={`${product.categorySlug}-${product.slug}`} className="bg-card">
                  <Link
                    to={`/products/${product.categorySlug}/${product.slug}`}
                    className="group flex h-full items-center gap-5 p-5 transition-colors hover:bg-line/40"
                  >
                    <div className="h-16 w-16 shrink-0 bg-white p-1.5">
                      <ProductImage
                        product={product}
                        sizes="64px"
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="caps text-sm transition-colors group-hover:text-bright">
                        {product.code}
                      </h3>
                      {product.tagline && (
                        <p className="mt-1.5 text-xs leading-relaxed text-faint">
                          {product.tagline}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  )
}

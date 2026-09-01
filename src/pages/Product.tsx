import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import ProductImage from '../components/ProductImage'
import SpecTable from '../components/SpecTable'
import Button from '../components/Button'
import { RowList, Row, DownloadIcon } from '../components/RowList'
import NotFound from './NotFound'
import {
  archives,
  canonicalProductPath,
  findCategory,
  findProduct,
  isAmbiguousCode,
} from '../lib/catalog'
import Seo from '../components/Seo'
import { archiveUrl, partner } from '../config'
import { productDescription, productTitle } from '../lib/seo'
import { breadcrumbs, graph, product as productLd } from '../lib/jsonLd'
import type { Product as ProductType } from '../lib/types'

function tabsFor(product: ProductType) {
  return [
    { id: 'overview', label: 'Overview', when: Boolean(product.description || product.summary) },
    { id: 'performance', label: 'Performance', when: product.features.length > 0 },
    { id: 'specification', label: 'Specification', when: Boolean(product.specs) },
    { id: 'drawings', label: 'Drawings', when: Boolean(product.drawing || product.comparisonChart) },
    { id: 'documents', label: 'Documents', when: product.documents.length > 0 },
  ].filter((tab) => tab.when)
}

export default function Product() {
  const { categorySlug, productSlug } = useParams()
  const product = findProduct(categorySlug, productSlug)
  const category = findCategory(categorySlug)

  const tabs = product ? tabsFor(product) : []
  const [active, setActive] = useState(tabs[0]?.id ?? 'overview')

  if (!product) return <NotFound />

  const current = tabs.some((t) => t.id === active) ? active : (tabs[0]?.id ?? '')
  const archive = archives.find((a) => a.code === product.code)
  const path = `/products/${product.categorySlug}/${product.slug}`

  const summary = product.summary ?? product.description
  const description = summary
    ? productDescription(summary, product.code)
    : `${partner.name} ${product.code}${product.tagline ? ` — ${product.tagline}` : ''}. ` +
      'Full specifications and documentation from the official Armenian distributor.'

  return (
    <>
      <Seo
        title={productTitle(
          product.code,
          product.tagline,
          isAmbiguousCode(product) ? category?.title : undefined,
        )}
        description={description}
        path={path}
        canonicalPath={canonicalProductPath(product)}
        image={product.image}
        jsonLd={graph(
          productLd(product, path),
          breadcrumbs([
            { name: 'Products', path: '/products' },
            ...(category
              ? [{ name: category.title, path: `/products/${category.slug}` }]
              : []),
            { name: product.code, path },
          ]),
        )}
      />

      <div className="border-b border-line bg-surface">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="caps flex flex-wrap items-center gap-2 text-[11px] text-faint">
              {[
                { label: 'Products', to: '/products' },
                ...(category
                  ? [
                      {
                        label: category.title,
                        to: category.visible
                          ? `/products/${category.slug}`
                          : '/products/range',
                      },
                    ]
                  : []),
              ].map((crumb) => (
                <li key={crumb.to} className="flex items-center gap-2">
                  <Link to={crumb.to} className="transition-colors hover:text-bright">
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true" className="text-line">
                    /
                  </span>
                </li>
              ))}
              <li>{product.code}</li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16">
            <div>
              <h1 className="caps text-3xl sm:text-4xl lg:text-5xl">
                <span className="block text-xs text-faint sm:text-sm">{partner.name}</span>
                {product.code}
              </h1>
              {product.tagline && (
                <p className="mt-5 text-lg text-muted sm:text-xl">{product.tagline}</p>
              )}
              {product.summary && (
                <p className="mt-7 max-w-xl text-[15px] leading-relaxed">{product.summary}</p>
              )}

              {archive && archiveUrl(archive.file) && (
                <Button href={archiveUrl(archive.file)} variant="outline" className="mt-9">
                  Download Archive
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center bg-white p-8">
              <ProductImage
                product={product}
                loading="eager"
                sizes="(min-width: 1024px) 460px, 90vw"
                className="max-h-80 w-full object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </Container>
      </div>

      {tabs.length > 0 && (
        <Container className="py-14 sm:py-20">
          <div
            role="tablist"
            aria-label="Product details"
            className="mb-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-line"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={current === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={`caps -mb-px border-b-2 pb-4 text-xs transition-colors ${
                  current === tab.id
                    ? 'border-bright text-bright'
                    : 'border-transparent text-faint hover:text-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {tabs.map((tab) => {
            const shown = current === tab.id

            return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!shown}
            tabIndex={shown ? 0 : -1}
          >
            {tab.id === 'overview' ? (
              <h2 className={product.headline ? 'mb-6 max-w-3xl text-xl sm:text-2xl' : 'sr-only'}>
                {product.headline || tab.label}
              </h2>
            ) : (
              <h2 className="sr-only">{tab.label}</h2>
            )}

            {tab.id === 'overview' && product.description && (
              <div className="max-w-3xl space-y-5 text-[15px] leading-relaxed">
                {product.description.split('\n\n').map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            )}

            {tab.id === 'performance' && (
              <ul className="grid max-w-4xl gap-x-12 gap-y-4 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-4 text-[15px] leading-relaxed">
                    <span className="mt-2 h-px w-4 shrink-0 bg-faint" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {tab.id === 'specification' && product.specs && (
              <div className="max-w-3xl">
                <SpecTable specs={product.specs} />
              </div>
            )}

            {tab.id === 'drawings' && (
              <div className="grid gap-10 lg:grid-cols-2">
                {product.drawing && (
                  <figure>
                    <figcaption className="caps mb-4 text-xs text-faint">
                      Technical Drawing
                    </figcaption>
                    <a href={product.drawing} target="_blank" rel="noreferrer">
                      <img
                        src={product.drawing}
                        alt={`${product.code} technical drawing`}
                        loading="lazy"
                        className="w-full bg-white p-4"
                      />
                    </a>
                  </figure>
                )}
                {product.comparisonChart && (
                  <figure>
                    <figcaption className="caps mb-4 text-xs text-faint">
                      Comparison Chart
                    </figcaption>
                    <a href={product.comparisonChart} target="_blank" rel="noreferrer">
                      <img
                        src={product.comparisonChart}
                        alt={`${product.code} comparison chart`}
                        loading="lazy"
                        className="w-full bg-white p-4"
                      />
                    </a>
                  </figure>
                )}
              </div>
            )}

            {tab.id === 'documents' && (
              <div className="max-w-3xl">
                <RowList>
                  {product.documents.map((doc) => (
                    <Row
                      key={doc.url}
                      label={doc.title}
                      meta={doc.url.split('.').pop()?.toUpperCase()}
                      href={doc.url}
                      icon={<DownloadIcon />}
                    />
                  ))}
                </RowList>
                <p className="mt-5 text-xs text-faint">
                  Documents are hosted by the manufacturer and always reflect the
                  current revision.
                </p>
              </div>
            )}
          </div>
            )
          })}
        </Container>
      )}
    </>
  )
}

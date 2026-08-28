import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import CategoryCard from '../components/CategoryCard'
import { listedCategories } from '../lib/catalog'
import { partner } from '../config'
import { productsSection } from '../content'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Products() {
  useDocumentTitle('Products', productsSection.intro.join(' '))

  return (
    <>
      <PageHeader
        title="Products"
        intro={
          <>
            {productsSection.intro.map((line) => (
              <p key={line} className="mt-3 first:mt-0">
                {line}
              </p>
            ))}
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
      </Container>
    </>
  )
}

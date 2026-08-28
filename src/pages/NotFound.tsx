import Container from '../components/Container'
import Button from '../components/Button'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <Container className="py-32 text-center">
      <p className="caps text-xs text-faint">Error 404</p>
      <h1 className="caps mt-5 text-3xl sm:text-4xl">Page not found</h1>
      <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed">
        That page doesn&apos;t exist. It may have moved when the site was rebuilt.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button to="/">Home</Button>
        <Button to="/products" variant="outline">
          Products
        </Button>
        <Button to="/support" variant="outline">
          Support
        </Button>
      </div>
    </Container>
  )
}

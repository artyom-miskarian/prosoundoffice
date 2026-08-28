import Container from '../components/Container'
import Button from '../components/Button'
import Logo from '../components/Logo'
import SectionHeading from '../components/SectionHeading'
import ProductCard from '../components/ProductCard'
import { featuredProducts, services } from '../lib/catalog'
import { hero, partnerSection, productsSection, servicesSection } from '../content'
import { partner, site } from '../config'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Home() {
  useDocumentTitle('', site.description)

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-black">

        <img
          src="/images/brand/sound-sphere.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-18%] w-[560px] max-w-none -translate-y-1/2 opacity-60 select-none sm:right-[-8%] lg:right-[2%] lg:w-[620px] lg:opacity-100"
        />

        <Container className="relative py-20 sm:py-28 lg:py-36">
          <Logo className="h-16 w-auto text-bright sm:h-20" />

          <h1 className="mt-10 max-w-2xl text-2xl leading-[1.25] font-medium tracking-normal sm:text-3xl lg:text-[2.6rem]">
            {hero.headline}
          </h1>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button to={hero.primaryCta.to}>{hero.primaryCta.label}</Button>
            <Button to={hero.secondaryCta.to} variant="outline">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-surface py-section">
        <Container>
          <SectionHeading title={servicesSection.title} wide>
            <p>{servicesSection.intro}</p>
          </SectionHeading>

          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.title} className="flex flex-col bg-card p-7">
                <h3 className="caps text-sm leading-snug">{service.title}</h3>
                {service.description && (
                  <p className="mt-5 text-sm leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div
        aria-hidden="true"
        className="h-40 border-b border-line bg-cover bg-center sm:h-56"
        style={{ backgroundImage: 'url(/images/brand/banner.png)' }}
      />

      <section className="border-b border-line bg-ink py-section">
        <Container>
          <SectionHeading title={productsSection.title} wide>
            {productsSection.intro.map((line) => (
              <p key={line} className="mt-3 first:mt-0">
                {line}
              </p>
            ))}
          </SectionHeading>

          <div className="mb-8 flex items-center gap-5">
            <h3 className="caps text-xs text-bright">{partner.name}</h3>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <Button to="/products" variant="outline">
              See All
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-section">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <img
                src="/images/brand/funktion-one.png"
                alt={partner.name}
                className="h-7 w-auto sm:h-9"
                loading="lazy"
              />
              <p className="mt-10 text-lg leading-relaxed text-bright sm:text-xl">
                {partnerSection.lead}
              </p>
              <p className="mt-6 text-[15px] leading-relaxed">{partnerSection.body}</p>
              <Button to={partnerSection.cta.to} variant="outline" className="mt-10">
                {partnerSection.cta.label}
              </Button>
            </div>

            <div className="order-first lg:order-last">

              <img
                src="/images/brand/tony-andrews.png"
                alt="Tony Andrews, founder of Funktion-One"
                className="mx-auto w-full max-w-[480px] lg:mr-0"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

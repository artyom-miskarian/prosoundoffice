import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import ContactForm from '../components/ContactForm'
import { RowList, Row, ArrowIcon } from '../components/RowList'
import { archives, crossovers } from '../lib/catalog'
import Seo from '../components/Seo'
import { address, contact, partner } from '../config'
import { supportSection } from '../content'
import { titles } from '../lib/seo'
import { contactPage, graph } from '../lib/jsonLd'

const DETAILS = [
  { label: 'Phone', value: contact.phone, href: `tel:${contact.phoneHref}` },
  { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  { label: 'Instagram', value: contact.instagram, href: contact.instagramUrl },
  { label: 'Based in', value: address.street ? `${address.street}, ${address.city}` : contact.location },
]

export default function Support() {
  return (
    <>
      <Seo
        title={titles.support}
        description={
          `Contact ${partner.name}'s official distributor in Armenia. Technical ` +
          'documentation, crossover settings, product archives and a direct line to ' +
          `our engineers in ${address.city}.`
        }
        path="/support"
        jsonLd={graph(contactPage('/support'))}
      />

      <PageHeader title={supportSection.title} intro={<p>{supportSection.intro}</p>} />

      <Container className="py-section">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-8">
          <div className="lg:row-span-2 lg:grid lg:grid-rows-subgrid">
            <h2 className="caps mb-6 text-2xl sm:text-3xl lg:mb-0 lg:self-baseline">
              {supportSection.formTitle}
            </h2>
            <ContactForm />
          </div>

          <aside className="lg:row-span-2 lg:grid lg:grid-rows-subgrid">
            <h2 className="caps mb-6 text-xs text-faint lg:mb-0 lg:self-baseline">
              Get in touch
            </h2>

            <div className="space-y-12">
              <dl className="space-y-5">
                {DETAILS.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs text-faint">{detail.label}</dt>
                    <dd className="mt-1 text-[15px] text-bright">
                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={detail.href.startsWith('http') ? '_blank' : undefined}
                          rel={detail.href.startsWith('http') ? 'noreferrer' : undefined}
                          className="transition-colors hover:text-muted"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div>
                <h2 className="caps mb-6 text-xs text-faint">Resources</h2>
                <RowList>
                  <Row
                    label="Downloads"
                    meta={`${archives.length} archives`}
                    to="/downloads"
                    icon={<ArrowIcon />}
                  />
                  <Row
                    label="Crossovers"
                    meta={`${crossovers.length} configs`}
                    to="/crossovers"
                    icon={<ArrowIcon />}
                  />
                </RowList>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}

import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import ContactForm from '../components/ContactForm'
import { RowList, Row, ArrowIcon } from '../components/RowList'
import { archives, crossovers } from '../lib/catalog'
import { contact } from '../config'
import { supportSection } from '../content'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const DETAILS = [
  { label: 'Phone', value: contact.phone, href: `tel:${contact.phoneHref}` },
  { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  { label: 'Instagram', value: contact.instagram, href: contact.instagramUrl },
  { label: 'Based in', value: contact.location },
]

export default function Support() {
  useDocumentTitle('Support', supportSection.intro)

  return (
    <>
      <PageHeader title={supportSection.title} intro={<p>{supportSection.intro}</p>} />

      <Container className="py-section">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-20">
          <div>
            <h2 className="caps mb-8 text-2xl sm:text-3xl">{supportSection.formTitle}</h2>
            <ContactForm />
          </div>

          <aside className="space-y-12">
            <div>
              <h2 className="caps mb-6 text-xs text-faint">Get in touch</h2>
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
            </div>

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
          </aside>
        </div>
      </Container>
    </>
  )
}

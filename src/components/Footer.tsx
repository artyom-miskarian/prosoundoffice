import { Link } from 'react-router-dom'
import Container from './Container'
import Logo from './Logo'
import { contact, nav, site } from '../config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-ink">
      <Container className="py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div>
            <h2 className="caps mb-6 text-xs text-faint">Contact</h2>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="text-bright transition-colors hover:text-muted"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-bright transition-colors hover:text-muted"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bright transition-colors hover:text-muted"
                >
                  {contact.instagram}
                </a>
              </li>
              <li className="pt-1 text-faint">{contact.location}</li>
            </ul>
          </div>

          <div>
            <h2 className="caps mb-6 text-xs text-faint">Site</h2>
            <ul className="space-y-3 text-[15px]">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition-colors hover:text-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:justify-end">
            <Link to="/" aria-label={`${site.name} home`}>
              <Logo className="h-9 w-auto text-bright" />
            </Link>
            <p className="text-sm text-faint lg:text-right">
              Copyright © {year}, {site.legalName}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

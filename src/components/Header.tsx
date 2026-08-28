import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Container from './Container'
import { nav, site } from '../config'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `caps text-xs transition-colors hover:text-bright ${
      isActive ? 'text-bright' : 'text-muted'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            className="caps text-base font-bold text-bright sm:text-lg"
            aria-label={`${site.name} home`}
          >
            {site.name}
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="-mr-2 p-2 text-bright md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4l14 14M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                />
              ) : (
                <path
                  d="M2 6h18M2 11h18M2 16h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-surface md:hidden"
          aria-label="Main"
        >
          <Container>
            <ul className="flex flex-col py-2">
              {nav.map((item) => (
                <li key={item.to} className="border-b border-line/60 last:border-0">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `caps block py-4 text-sm ${isActive ? 'text-bright' : 'text-muted'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}

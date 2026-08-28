import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Container from './Container'

export interface Crumb {
  label: string
  to?: string
}

export default function PageHeader({
  title,
  intro,
  crumbs = [],
  children,
}: {
  title: string
  intro?: ReactNode
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="py-14 sm:py-20">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="caps flex flex-wrap items-center gap-2 text-[11px] text-faint">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {crumb.to ? (
                    <Link to={crumb.to} className="transition-colors hover:text-bright">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {i < crumbs.length - 1 && (
                    <span aria-hidden="true" className="text-line">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <h1 className="caps text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{title}</h1>

        {intro && (
          <div className="mt-6 max-w-3xl text-[15px] leading-relaxed sm:text-base">
            {intro}
          </div>
        )}

        {children}
      </Container>
    </div>
  )
}

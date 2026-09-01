import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function RowList({ children }: { children: ReactNode }) {
  return <ul className="border border-line">{children}</ul>
}

interface RowProps {
  label: string
  meta?: string | null
  to?: string
  href?: string
  icon: ReactNode
  disabledNote?: string
}

const rowClass =
  'grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition-colors sm:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_auto] sm:px-7'

export function Row({ label, meta, to, href, icon, disabledNote }: RowProps) {
  const content = (
    <>
      <span className="caps text-sm text-bright">{label}</span>
      <span className="hidden text-sm text-faint sm:block">{meta}</span>
      <span className="justify-self-end text-bright">{icon}</span>
    </>
  )

  return (
    <li className="border-b border-line last:border-0 odd:bg-card even:bg-surface">
      {disabledNote ? (
        <div className={`${rowClass} cursor-not-allowed opacity-50`} title={disabledNote}>
          {content}
        </div>
      ) : to ? (
        <Link to={to} className={`${rowClass} group hover:bg-line/60`}>
          {content}
        </Link>
      ) : (
        <a
        href={href}
        target="_blank"
        rel="noopener nofollow"
        className={`${rowClass} group hover:bg-line/60`}
      >
          {content}
        </a>
      )}
    </li>
  )
}

export function RowGroupHeading({ title }: { title: string }) {
  return (
    <li className="border-b border-line bg-ink px-5 py-3 sm:px-7">
      <h2 className="caps text-[11px] text-faint">{title}</h2>
    </li>
  )
}

export const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
    <path
      d="M9 2v9m0 0 3.5-3.5M9 11 5.5 7.5M3 14.5h12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    />
  </svg>
)

export const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    aria-hidden="true"
    fill="none"
    className="transition-transform group-hover:translate-x-1"
  >
    <path
      d="M3 9h12m0 0-4.5-4.5M15 9l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    />
  </svg>
)

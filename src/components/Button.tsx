import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'solid' | 'outline'

const base =
  'caps inline-flex items-center justify-center px-7 py-3 text-xs font-semibold transition-colors'

const variants: Record<Variant, string> = {
  solid: 'bg-bright text-ink hover:bg-muted',
  outline: 'border border-bright text-bright hover:bg-bright hover:text-ink',
}

interface Props {
  children: ReactNode
  to?: string
  href?: string
  variant?: Variant
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export default function Button({
  children,
  to,
  href,
  variant = 'solid',
  className = '',
  type = 'button',
  disabled,
  onClick,
}: Props) {
  const classes = `${base} ${variants[variant]} ${
    disabled ? 'pointer-events-none opacity-50' : ''
  } ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

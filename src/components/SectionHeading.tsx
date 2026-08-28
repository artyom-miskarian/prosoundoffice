import type { ReactNode } from 'react'

export default function SectionHeading({
  title,
  children,
  id,
  wide = false,
}: {
  title: string
  children?: ReactNode
  id?: string
  wide?: boolean
}) {
  return (
    <div className="mb-12">
      <h2 id={id} className="caps text-2xl sm:text-3xl">
        {title}
      </h2>
      {children && (
        <div
          className={`mt-6 text-[15px] leading-relaxed ${wide ? '' : 'max-w-3xl'}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

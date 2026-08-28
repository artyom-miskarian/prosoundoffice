import type { Specs } from '../lib/types'

const ROWS: { label: string; key: keyof Specs }[] = [
  { label: 'Driver', key: 'driver' },
  { label: 'Operating Band', key: 'operatingBand' },
  { label: 'Bandwidth (-3dB)', key: 'bandwidth' },
  { label: 'Sensitivity 1m', key: 'sensitivity' },
  { label: 'Power', key: 'power' },
  { label: 'Nominal Impedance', key: 'impedance' },
  { label: 'Nominal Dispersion', key: 'dispersion' },
  { label: 'Connectors', key: 'connectors' },
  { label: 'Weight', key: 'weight' },
]

export default function SpecTable({ specs }: { specs: Specs }) {
  const rows = ROWS.filter(({ key }) => specs[key])
  if (!rows.length) return null

  return (
    <dl className="border border-line">
      {rows.map(({ label, key }, i) => (
        <div
          key={key}
          className={`grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-6 sm:px-7 ${
            i % 2 === 0 ? 'bg-card' : 'bg-surface'
          } ${i < rows.length - 1 ? 'border-b border-line' : ''}`}
        >
          <dt className="caps text-[11px] text-faint">{label}</dt>
          <dd className="text-sm text-bright">{specs[key]}</dd>
        </div>
      ))}
    </dl>
  )
}

import { useParams } from 'react-router-dom'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import NotFound from './NotFound'
import Seo from '../components/Seo'
import { findCrossover } from '../lib/catalog'
import { partner } from '../config'
import { crossoverTitle } from '../lib/seo'
import { breadcrumbs, crossoverPage, graph } from '../lib/jsonLd'
import type { CrossoverRow } from '../lib/types'

const COLUMNS: { key: keyof CrossoverRow; label: string; short: string }[] = [
  { key: 'component', label: 'Component', short: 'Component' },
  { key: 'polarity', label: 'Polarity', short: 'Pol.' },
  { key: 'delay', label: 'Delay (ms)', short: 'Delay' },
  { key: 'hpf', label: 'HPF (Hz)', short: 'HPF' },
  { key: 'hpt', label: 'HP Slope', short: 'HPT' },
  { key: 'lpf', label: 'LPF (Hz)', short: 'LPF' },
  { key: 'lpt', label: 'LP Slope', short: 'LPT' },
  { key: 'gain', label: 'Gain (dB)', short: 'Gain' },
]

export default function CrossoverDetail() {
  const { slug } = useParams()
  const crossover = findCrossover(slug)

  if (!crossover) return <NotFound />

  const path = `/crossovers/${crossover.slug}`
  const bands = crossover.rows.length
  const components = [...new Set(crossover.rows.map((row) => row.component))].filter(Boolean)

  const intro =
    `Recommended ${partner.name} processor settings for ${crossover.title}: ` +
    `crossover points, slopes, delay, polarity and gain across ${bands} ` +
    `${bands === 1 ? 'band' : 'bands'}` +
    (components.length ? ` (${components.join(', ')}).` : '.')

  return (
    <>
      <Seo
        title={crossoverTitle(crossover.title)}
        description={intro}
        path={path}
        type="article"
        jsonLd={graph(
          crossoverPage(crossover, path),
          breadcrumbs([
            { name: 'Crossover Settings', path: '/crossovers' },
            { name: crossover.title, path },
          ]),
        )}
      />

      <PageHeader
        title={crossover.title}
        crumbs={[
          { label: 'Crossovers', to: '/crossovers' },
          ...(crossover.categoryTitle ? [{ label: crossover.categoryTitle }] : []),
        ]}
        intro={<p>{intro}</p>}
      />

      <Container className="py-section">
        <h2 className="caps mb-8 text-xs text-bright">
          {bands} {bands === 1 ? 'Band' : 'Bands'}
        </h2>

        <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border border-line text-left">
            <thead>
              <tr className="bg-ink">
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="caps border-b border-line px-4 py-4 text-[11px] font-semibold text-faint"
                  >
                    <span className="hidden lg:inline">{column.label}</span>
                    <span className="lg:hidden">{column.short}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crossover.rows.map((row, i) => (
                <tr
                  key={`${row.component}-${row.hpf}-${i}`}
                  className={`border-b border-line last:border-0 ${
                    i % 2 === 0 ? 'bg-card' : 'bg-surface'
                  }`}
                >
                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 text-sm ${
                        column.key === 'component'
                          ? 'font-semibold whitespace-nowrap text-bright'
                          : 'text-muted'
                      }`}
                    >
                      {row[column.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-faint">
          Rows run from the lowest band upwards. Slope values are the filter type and
          order. For example, 24dB LR is a fourth-order Linkwitz-Riley.
        </p>
      </Container>
    </>
  )
}

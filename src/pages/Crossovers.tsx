import { Fragment } from 'react'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import { RowList, Row, RowGroupHeading, ArrowIcon } from '../components/RowList'
import Seo from '../components/Seo'
import { crossovers, groupByCategory } from '../lib/catalog'
import { partner } from '../config'
import { titles } from '../lib/seo'
import { collection, graph } from '../lib/jsonLd'

const INTRO =
  'Recommended processor settings for each system configuration: crossover points, slopes, delay, polarity and gain.'

export default function Crossovers() {
  const groups = groupByCategory(crossovers)

  return (
    <>
      <Seo
        title={titles.crossovers}
        description={
          `Recommended DSP and crossover settings for ${crossovers.length} ` +
          `${partner.name} system configurations — crossover points, slopes, delay, ` +
          'polarity and gain for each band.'
        }
        path="/crossovers"
        jsonLd={graph(
          collection(titles.crossovers, '/crossovers', crossovers.map((c) => ({
            path: `/crossovers/${c.slug}`,
          }))),
        )}
      />

      <PageHeader title="Crossover Settings" intro={<p>{INTRO}</p>} />

      <Container className="py-section">
        <RowList>
          {groups.map((group) => (
            <Fragment key={group.title}>
              <RowGroupHeading title={group.title} />
              {group.rows.map((crossover) => (
                <Row
                  key={crossover.slug}
                  label={crossover.title}
                  meta={`${crossover.rows.length} ${
                    crossover.rows.length === 1 ? 'band' : 'bands'
                  }`}
                  to={`/crossovers/${crossover.slug}`}
                  icon={<ArrowIcon />}
                />
              ))}
            </Fragment>
          ))}
        </RowList>

        <p className="mt-6 text-xs text-faint">
          {crossovers.length} configurations across {groups.length} ranges.
        </p>
      </Container>
    </>
  )
}

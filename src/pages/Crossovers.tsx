import { Fragment } from 'react'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import { RowList, Row, RowGroupHeading, ArrowIcon } from '../components/RowList'
import { crossovers, groupByCategory } from '../lib/catalog'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const INTRO =
  'Recommended processor settings for each system configuration: crossover points, slopes, delay, polarity and gain.'

export default function Crossovers() {
  useDocumentTitle('Crossover Settings', INTRO)

  const groups = groupByCategory(crossovers)

  return (
    <>
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

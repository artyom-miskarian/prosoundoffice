import { Fragment } from 'react'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import { RowList, Row, RowGroupHeading, DownloadIcon } from '../components/RowList'
import { archives, groupByCategory } from '../lib/catalog'
import Seo from '../components/Seo'
import { archiveUrl, downloadsBaseUrl, partner } from '../config'
import { titles } from '../lib/seo'
import { graph } from '../lib/jsonLd'

const INTRO =
  'Each archive bundles the full document set for one enclosure: specification sheets, CAD, drawings and rigging information.'

export default function Downloads() {
  const groups = groupByCategory(archives)

  return (
    <>
      <Seo
        title={titles.downloads}
        description={
          `Download the full ${partner.name} document set for any enclosure: ` +
          'specification sheets, CAD drawings, rigging information and manuals, ' +
          `${archives.length} archives in all.`
        }
        path="/downloads"
        jsonLd={graph()}
      />

      <PageHeader title="Downloads" intro={<p>{INTRO}</p>} />

      <Container className="py-section">
        {!downloadsBaseUrl && (
          <div className="mb-10 border border-line bg-card p-6">
            <h2 className="caps text-sm">Archive location not configured</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Set <code className="text-bright">VITE_DOWNLOADS_BASE_URL</code> to the
              public URL of the bucket folder holding the{' '}
              <code className="text-bright">.zip</code> files. See the README.
            </p>
          </div>
        )}

        <RowList>
          {groups.map((group) => (
            <Fragment key={group.title}>
              <RowGroupHeading title={group.title} />
              {group.rows.map((archive) => (
                <Row
                  key={archive.code}
                  label={archive.code}
                  meta={archive.file}
                  href={archiveUrl(archive.file)}
                  icon={<DownloadIcon />}
                  disabledNote={
                    downloadsBaseUrl ? undefined : 'Archives are not published yet'
                  }
                />
              ))}
            </Fragment>
          ))}
        </RowList>

        <p className="mt-6 text-xs text-faint">
          {archives.length} archives across {groups.length} ranges.
        </p>
      </Container>
    </>
  )
}

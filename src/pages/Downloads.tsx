import { Fragment } from 'react'
import Container from '../components/Container'
import PageHeader from '../components/PageHeader'
import { RowList, Row, RowGroupHeading, DownloadIcon } from '../components/RowList'
import { archives, groupByCategory } from '../lib/catalog'
import { archiveUrl, downloadsBaseUrl } from '../config'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const INTRO =
  'Each archive bundles the full document set for one enclosure: specification sheets, CAD, drawings and rigging information.'

export default function Downloads() {
  useDocumentTitle('Downloads', INTRO)

  const groups = groupByCategory(archives)

  return (
    <>
      <PageHeader title="Downloads" intro={<p>{INTRO}</p>} />

      <Container className="py-section">
        {!downloadsBaseUrl && (
          <div className="mb-10 border border-line bg-card p-6">
            <h2 className="caps text-sm">Archives not published yet</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Set <code className="text-bright">VITE_DOWNLOADS_BASE_URL</code> to the
              GitHub Release that holds the <code className="text-bright">.zip</code>{' '}
              files. Run <code className="text-bright">npm run upload-downloads</code>{' '}
              to publish them. See the README.
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

import { site } from '../config'
import { OG_IMAGE, SITE_URL, absoluteUrl, pageTitle, truncate } from '../lib/seo'

type Props = {
  title?: string
  description: string
  path: string
  canonicalPath?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: unknown
}

export default function Seo({
  title,
  description,
  path,
  canonicalPath,
  image = OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}: Props) {
  const url = absoluteUrl(path)
  const canonical = absoluteUrl(canonicalPath ?? path)
  const full = pageTitle(title)
  const summary = truncate(description)
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <>
      <title>{full}</title>
      <meta name="description" content={summary} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large" />
      )}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={summary} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={summary} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  )
}

import type { Metadata } from 'next'
import { siteConfig } from './config'

interface BuildMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
  type?: 'website' | 'article'
}

const BASE_KEYWORDS = [
  'brasileños Barcelona', 'comunidad brasileña Barcelona',
  'brasileños España', 'BrasilBCN',
]

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
  keywords = [],
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const canonical = `${siteConfig.url}${path}`
  // When no explicit image is given, leave `images` undefined instead of
  // guessing a URL — Next.js automatically resolves it from a colocated
  // opengraph-image/twitter-image file convention (which may have a hashed
  // filename we can't predict), falling back to the root app/opengraph-image.png.
  const ogImages = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined

  return {
    title,
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: ogImages,
      locale: 'pt_BR',
      alternateLocale: 'es_ES',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

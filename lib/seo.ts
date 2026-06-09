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
  const ogImage = image ?? '/opengraph-image'

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'pt_BR',
      alternateLocale: 'es_ES',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

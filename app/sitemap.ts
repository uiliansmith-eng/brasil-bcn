import type { MetadataRoute } from 'next'
import { createBrowserClient } from '@supabase/ssr'
import { siteConfig } from '@/lib/config'

const BASE = siteConfig.url

const STATIC: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE}/empleos`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  { url: `${BASE}/empresas`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE}/eventos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE}/guia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/compraventa`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createBrowserClient<any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const [jobs, companies, events, guides, listings] = await Promise.all([
      supabase
        .from('jobs')
        .select('id, updated_at')
        .eq('is_active', true)
        .eq('is_approved', true)
        .gt('expires_at', new Date().toISOString()),
      supabase
        .from('companies')
        .select('slug, updated_at')
        .eq('is_active', true)
        .eq('is_approved', true),
      supabase
        .from('events')
        .select('slug, updated_at')
        .eq('is_active', true)
        .eq('is_approved', true),
      supabase
        .from('guides')
        .select('slug, updated_at')
        .eq('is_published', true),
      supabase
        .from('listings')
        .select('id, updated_at')
        .eq('is_active', true)
        .eq('is_approved', true)
        .eq('is_sold', false),
    ])

    const jobUrls: MetadataRoute.Sitemap = (jobs.data ?? []).map((j) => ({
      url: `${BASE}/empleos/${j.id}`,
      lastModified: new Date(j.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const companyUrls: MetadataRoute.Sitemap = (companies.data ?? []).map((c) => ({
      url: `${BASE}/empresas/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const eventUrls: MetadataRoute.Sitemap = (events.data ?? []).map((e) => ({
      url: `${BASE}/eventos/${e.slug}`,
      lastModified: new Date(e.updated_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    const guideUrls: MetadataRoute.Sitemap = (guides.data ?? []).map((g) => ({
      url: `${BASE}/guia/${g.slug}`,
      lastModified: new Date(g.updated_at),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    const listingUrls: MetadataRoute.Sitemap = (listings.data ?? []).map((l) => ({
      url: `${BASE}/compraventa/${l.id}`,
      lastModified: new Date(l.updated_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...STATIC, ...jobUrls, ...companyUrls, ...eventUrls, ...guideUrls, ...listingUrls]
  } catch {
    return STATIC
  }
}

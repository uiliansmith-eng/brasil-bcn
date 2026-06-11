'use server'

import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export interface BrazilNewsItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
  source: string
  published_at: string
  article_url: string
}

// brazil_news is publicly readable — no cookies needed, safe inside unstable_cache
const fetchNews = unstable_cache(
  async (limit: number): Promise<BrazilNewsItem[]> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('brazil_news')
      .select('id, title, description, image_url, source, published_at, article_url')
      .order('published_at', { ascending: false })
      .limit(limit)
    return (data ?? []) as BrazilNewsItem[]
  },
  ['brazil-news'],
  { revalidate: 1800, tags: ['brazil-news'] },
)

export async function getLatestNews(limit = 5): Promise<BrazilNewsItem[]> {
  return fetchNews(limit)
}

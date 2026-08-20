'use server'

import { createClient as createPublicClient } from '@supabase/supabase-js'

export interface BrazilNewsItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
  source: string
  published_at: string
  article_url: string
}

// Reads from the `brazil_news` table, populated by the daily
// /api/cron/fetch-news job. Keeps the homepage request path free of
// live RSS fetches, which are slow/unreliable from serverless regions.
export async function getLatestNews(limit = 6): Promise<BrazilNewsItem[]> {
  try {
    const supabase = createPublicClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase
      .from('brazil_news')
      .select('id, title, description, image_url, source, published_at, article_url')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

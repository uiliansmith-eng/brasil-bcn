'use server'

import { unstable_noStore as noStore } from 'next/cache'
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

export async function getLatestNews(limit = 5): Promise<BrazilNewsItem[]> {
  noStore()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data, error } = await supabase
      .from('brazil_news')
      .select('id, title, description, image_url, source, published_at, article_url')
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) { console.error('[news]', error.message); return [] }
    return (data ?? []) as BrazilNewsItem[]
  } catch (e) {
    console.error('[news] fetch failed', e)
    return []
  }
}

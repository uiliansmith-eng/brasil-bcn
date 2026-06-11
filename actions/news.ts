'use server'

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
  try {
    const url = new URL(
      `/rest/v1/brazil_news`,
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    )
    url.searchParams.set('select', 'id,title,description,image_url,source,published_at,article_url')
    url.searchParams.set('order', 'published_at.desc.nullslast')
    url.searchParams.set('limit', String(limit))

    const res = await fetch(url.toString(), {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[news] REST error', res.status, body)
      return []
    }

    const data = await res.json()
    return (data ?? []) as BrazilNewsItem[]
  } catch (e) {
    console.error('[news] fetch failed', e)
    return []
  }
}

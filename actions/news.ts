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

const SOURCES = [
  { name: 'BBC Brasil',     url: 'https://feeds.bbci.co.uk/portuguese/rss.xml' },
  { name: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml' },
  { name: 'G1 Brasil',      url: 'https://g1.globo.com/rss/g1/brasil/' },
]

function cleanCDATA(s: string) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function getTagContent(xml: string, name: string) {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i')
  const m = xml.match(re)
  return m ? cleanCDATA(m[1].trim()) : ''
}

function stripHtml(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 280)
}

function decodeEntities(s: string) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

function findImage(item: string): string | null {
  const mt = item.match(/media:thumbnail[^>]+url="([^"]+)"/i)
  if (mt) return mt[1]
  const mc = item.match(/media:content[^>]+url="([^"]+)"/i)
  if (mc) return mc[1]
  const enc = item.match(/enclosure[^>]+url="([^"]+)"[^>]+type="image/i)
  if (enc) return enc[1]
  const enc2 = item.match(/enclosure[^>]+type="image[^"]*"[^>]+url="([^"]+)"/i)
  if (enc2) return enc2[1]
  const img = item.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)
  if (img) return img[1]
  return null
}

function parseItems(xml: string, sourceName: string): BrazilNewsItem[] {
  const rows: BrazilNewsItem[] = []
  const re = /<item>([\s\S]*?)<\/item>/gi
  let m: RegExpExecArray | null
  let idx = 0

  while ((m = re.exec(xml)) !== null) {
    const raw = m[1]
    const title = cleanCDATA(getTagContent(raw, 'title'))
    if (!title) continue

    let link = decodeEntities(getTagContent(raw, 'link'))
    if (!link || !link.startsWith('http')) {
      const guid = decodeEntities(getTagContent(raw, 'guid'))
      if (guid.startsWith('http')) link = guid
    }
    if (!link || !link.startsWith('http')) continue

    const description = stripHtml(getTagContent(raw, 'description')) || null
    const pubDate = getTagContent(raw, 'pubDate')
    let published: Date
    try {
      published = pubDate ? new Date(pubDate) : new Date()
      if (isNaN(published.getTime())) published = new Date()
    } catch {
      published = new Date()
    }

    rows.push({
      id: `${sourceName}-${idx++}`,
      title: title.slice(0, 255),
      description: description ? description.slice(0, 280) : null,
      image_url: findImage(raw),
      source: sourceName,
      article_url: link,
      published_at: published.toISOString(),
    })
  }

  return rows
}

async function fetchFeed(url: string, sourceName: string): Promise<BrazilNewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrasilBCN/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 1800 }, // Next.js cache: refresh every 30 min
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseItems(xml, sourceName)
  } catch {
    return []
  }
}

export async function getLatestNews(limit = 6): Promise<BrazilNewsItem[]> {
  // Fetch all sources in parallel, each cached independently for 30 min
  const results = await Promise.all(
    SOURCES.map((s) => fetchFeed(s.url, s.name))
  )

  return results
    .flat()
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit)
}

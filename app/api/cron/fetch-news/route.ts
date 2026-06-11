import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ─── RSS sources ──────────────────────────────────────────────────────────────
const SOURCES = [
  { name: 'BBC Brasil',     url: 'https://feeds.bbci.co.uk/portuguese/rss.xml' },
  { name: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml' },
  { name: 'G1 Brasil',      url: 'https://g1.globo.com/rss/g1/brasil/' },
]

// ─── RSS parser ───────────────────────────────────────────────────────────────
function cleanCDATA(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function getTagContent(xml: string, name: string): string {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i')
  const m = xml.match(re)
  return m ? cleanCDATA(m[1].trim()) : ''
}

function getAttr(xml: string, attrName: string): string {
  const m = xml.match(new RegExp(`${attrName}="([^"]+)"`, 'i'))
  return m ? m[1] : ''
}

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 280)
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function findImage(item: string): string | null {
  // media:thumbnail (BBC Brasil uses this)
  const mt = item.match(/media:thumbnail[^>]+url="([^"]+)"/i)
  if (mt) return mt[1]
  // media:content
  const mc = item.match(/media:content[^>]+url="([^"]+)"/i)
  if (mc) return mc[1]
  // enclosure with image type
  const enc = item.match(/enclosure[^>]+url="([^"]+)"[^>]+type="image/i)
  if (enc) return enc[1]
  // <enclosure url="..." type="image..."> (different order)
  const enc2 = item.match(/enclosure[^>]+type="image[^"]*"[^>]+url="([^"]+)"/i)
  if (enc2) return enc2[1]
  // img src in description
  const img = item.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)
  if (img) return img[1]
  return null
}

interface RSSRow {
  title: string
  description: string | null
  image_url: string | null
  source: string
  article_url: string
  published_at: string
}

function parseItems(xml: string, sourceName: string): RSSRow[] {
  const rows: RSSRow[] = []
  const re = /<item>([\s\S]*?)<\/item>/gi
  let m: RegExpExecArray | null

  while ((m = re.exec(xml)) !== null) {
    const raw = m[1]

    const title = cleanCDATA(getTagContent(raw, 'title'))
    if (!title) continue

    let link = decodeEntities(getTagContent(raw, 'link'))
    // If <link> is empty (self-closing or whitespace-only), try <guid>
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

// ─── Fetch one feed ───────────────────────────────────────────────────────────
async function fetchFeed(url: string, sourceName: string): Promise<{ rows: RSSRow[]; error: string | null }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrasilBCN/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      cache: 'no-store',
    })
    if (!res.ok) return { rows: [], error: `HTTP ${res.status}` }
    const xml = await res.text()
    const rows = parseItems(xml, sourceName)
    return { rows, error: null }
  } catch (e) {
    return { rows: [], error: String(e) }
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const log: Record<string, unknown> = {}
  let totalInserted = 0

  for (const source of SOURCES) {
    const { rows, error: fetchError } = await fetchFeed(source.url, source.name)
    log[source.name] = { fetched: rows.length, fetchError }

    if (rows.length === 0) continue

    const { data: inserted, error: dbError } = await supabase
      .rpc('upsert_news_batch', { items: rows })

    log[source.name] = { ...log[source.name] as object, dbInserted: inserted, dbError: dbError?.message }
    if (!dbError) totalInserted += (inserted ?? 0)
  }

  // Cleanup: keep only 100 most recent
  try {
    await supabase.rpc('cleanup_old_news')
  } catch { /* non-critical */ }

  return NextResponse.json({ ok: true, inserted: totalInserted, log })
}

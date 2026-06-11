import Link from 'next/link'
import { Newspaper, Clock, ExternalLink, ArrowRight } from 'lucide-react'
import { getLatestNews } from '@/actions/news'
import type { BrazilNewsItem } from '@/actions/news'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 60) return `Hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  return `Hace ${d}d`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const SOURCE_COLORS: Record<string, string> = {
  'BBC Brasil': 'bg-red-600',
  'Agência Brasil': 'bg-[#002776]',
  'G1 Brasil': 'bg-orange-500',
}

function SourceBadge({ source }: { source: string }) {
  const bg = SOURCE_COLORS[source] ?? 'bg-gray-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide ${bg}`}>
      {source}
    </span>
  )
}

// ─── Featured card (large) ────────────────────────────────────────────────────
function FeaturedCard({ item }: { item: BrazilNewsItem }) {
  return (
    <a
      href={item.article_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 sm:h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-16 h-16 text-gray-300" />
          </div>
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Source badge over image */}
        <div className="absolute top-3 left-3">
          <SourceBadge source={item.source} />
        </div>
        {/* Time */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          <Clock className="w-3 h-3" />
          {timeAgo(item.published_at)}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-black text-gray-900 text-lg sm:text-xl leading-tight mb-3 group-hover:text-[#009C3B] transition-colors line-clamp-3">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <span className="text-xs text-gray-400">{formatDate(item.published_at)}</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#009C3B] group-hover:translate-x-0.5 transition-transform">
            Leer más <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  )
}

// ─── Small card ───────────────────────────────────────────────────────────────
function SmallCard({ item }: { item: BrazilNewsItem }) {
  return (
    <a
      href={item.article_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-3"
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-7 h-7 text-gray-300" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <SourceBadge source={item.source} />
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />{timeAgo(item.published_at)}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#009C3B] transition-colors">
            {item.title}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#009C3B] mt-1.5">
          Leer más <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </a>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Newspaper className="w-8 h-8 text-gray-300" />
      </div>
      <p className="font-semibold text-gray-500 text-sm">Las noticias se cargarán en breve</p>
      <p className="text-gray-400 text-xs mt-1">El sistema actualiza automáticamente cada 30 minutos</p>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export async function BrazilNewsSection() {
  const news = await getLatestNews(5)

  const [featured, ...rest] = news

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#009C3B]/10 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-[#009C3B]" />
              </div>
              <span className="text-[#009C3B] font-semibold text-sm uppercase tracking-wider">
                Atualizado automaticamente
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Últimas noticias
              <span className="block text-[#009C3B]">de Brasil</span>
            </h2>
          </div>
          {/* Fonte info */}
          <div className="flex items-center gap-2 flex-wrap">
            {['BBC Brasil', 'Agência Brasil', 'G1 Brasil'].map((s) => (
              <SourceBadge key={s} source={s} />
            ))}
          </div>
        </div>

        {/* Grid */}
        {news.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Featured — spans 1 col on mobile, 1 col on desktop (left) */}
            {featured && (
              <div className="lg:col-span-1">
                <FeaturedCard item={featured} />
              </div>
            )}

            {/* 4 small cards stacked on right */}
            {rest.length > 0 && (
              <div className="lg:col-span-2 flex flex-col gap-3">
                {rest.map((item) => (
                  <SmallCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <Clock className="w-3 h-3" />
          Noticias actualizadas cada 30 minutos · Fuentes: BBC Brasil, Agência Brasil, G1
        </p>

      </div>
    </section>
  )
}

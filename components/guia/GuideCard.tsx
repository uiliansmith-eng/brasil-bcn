import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'
import { GUIDE_CATEGORY_LABELS, GUIDE_CATEGORY_EMOJI, GUIDE_CATEGORY_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { GuideCategory } from '@/types'

interface GuideCardProps {
  guide: {
    id: string
    slug: string
    title: string
    excerpt: string | null
    category: GuideCategory
    cover_url: string | null
    reading_time: number
    published_at: string | null
    views?: number
  }
}

function formatPublishedDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function GuideCard({ guide }: GuideCardProps) {
  const catLabel = GUIDE_CATEGORY_LABELS[guide.category] ?? guide.category
  const catEmoji = GUIDE_CATEGORY_EMOJI[guide.category] ?? '📋'
  const catColor = GUIDE_CATEGORY_COLORS[guide.category] ?? GUIDE_CATEGORY_COLORS.otro

  return (
    <Link
      href={`/guia/${guide.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 hover:border-[#002776]/20"
    >
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-br from-[#002776]/5 to-[#002776]/10 flex items-center justify-center overflow-hidden">
        {guide.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={guide.cover_url} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-6xl opacity-60">{catEmoji}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <span className={cn('self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3', catColor)}>
          {catLabel}
        </span>

        <h3 className="font-bold text-gray-900 group-hover:text-[#002776] transition-colors leading-tight mb-2 line-clamp-2">
          {guide.title}
        </h3>

        {guide.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {guide.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {guide.reading_time} min
            </span>
            {guide.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {guide.views}
              </span>
            )}
          </div>
          {guide.published_at && (
            <span className="text-gray-400 text-xs">{formatPublishedDate(guide.published_at)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

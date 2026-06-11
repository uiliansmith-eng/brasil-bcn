import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, Eye, Calendar, ChevronRight, BookOpen } from 'lucide-react'
import { getGuideBySlug, getGuidesByCategory } from '@/actions/guides'
import { GUIDE_CATEGORY_LABELS, GUIDE_CATEGORY_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { GuideCategory } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuideBySlug(slug)
  if (!guide) return { title: 'Guía no encontrada' }

  return {
    title: `${guide.title} — BrasilBCN`,
    description: guide.excerpt ?? guide.content.slice(0, 160),
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function renderContent(content: string) {
  return content.split('\n\n').filter(Boolean).map((para, i) => (
    <p key={i} className="text-gray-700 leading-relaxed">
      {para.trim()}
    </p>
  ))
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params
  const guide = await getGuideBySlug(slug)
  if (!guide) notFound()

  const related = await getGuidesByCategory(guide.category as GuideCategory, slug)

  const catLabel = GUIDE_CATEGORY_LABELS[guide.category as GuideCategory] ?? guide.category
  const catColor = GUIDE_CATEGORY_COLORS[guide.category as GuideCategory] ?? GUIDE_CATEGORY_COLORS.otro
  const author = guide.author as { full_name?: string } | null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/guia" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a la guía
        </Link>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* Article */}
          <article>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

              {/* Cover */}
              {guide.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={guide.cover_url} alt={guide.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#002776]/10 to-[#002776]/5 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#002776]/20" />
                </div>
              )}

              <div className="p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <Link
                    href={`/guia?categoria=${guide.category}`}
                    className={cn('text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity', catColor)}
                  >
                    {catLabel}
                  </Link>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" /> {guide.reading_time} min de lectura
                  </span>
                  {guide.published_at && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" /> {formatDate(guide.published_at)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="w-3 h-3" /> {guide.views} lecturas
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
                  {guide.title}
                </h1>

                {guide.excerpt && (
                  <p className="text-lg text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100">
                    {guide.excerpt}
                  </p>
                )}

                {/* Content */}
                <div className="space-y-4">
                  {renderContent(guide.content)}
                </div>

                {/* Author */}
                {author?.full_name && (
                  <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#002776]/10 flex items-center justify-center text-sm font-bold text-[#002776]">
                      {author.full_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{author.full_name}</p>
                      <p className="text-xs text-gray-400">Equipo BrasilBCN</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="font-black text-gray-900 text-base mb-4">Más sobre {catLabel}</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/guia/${r.slug}`}
                      className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-xl transition-colors -mx-2"
                    >
                      <BookOpen className="w-4 h-4 text-[#002776]/40 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-[#002776] transition-colors line-clamp-2 leading-snug">
                          {r.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {r.reading_time} min
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#002776] shrink-0 mt-1 transition-colors" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/guia?categoria=${guide.category}`}
                  className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-medium text-[#002776] hover:text-[#001a5c] transition-colors"
                >
                  Ver todas las guías de {catLabel}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* All categories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 text-base mb-4">Explorar temas</h3>
              <div className="space-y-1">
                {(Object.entries(GUIDE_CATEGORY_LABELS) as [GuideCategory, string][]).map(([cat, label]) => (
                  <Link
                    key={cat}
                    href={`/guia?categoria=${cat}`}
                    className={cn(
                      'flex items-center gap-2.5 text-sm font-medium px-3 py-2 rounded-xl transition-all',
                      cat === guide.category
                        ? 'bg-[#002776] text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#002776]'
                    )}
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.excerpt,
            datePublished: guide.published_at,
            dateModified: guide.updated_at,
            author: {
              '@type': 'Person',
              name: author?.full_name ?? 'BrasilBCN',
            },
            publisher: {
              '@type': 'Organization',
              name: 'BrasilBCN',
            },
            image: guide.cover_url,
            timeRequired: `PT${guide.reading_time}M`,
          }),
        }}
      />
    </div>
  )
}

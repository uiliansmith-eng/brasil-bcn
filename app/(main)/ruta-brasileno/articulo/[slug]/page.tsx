import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Clock, HelpCircle, ArrowLeft, CalendarCheck } from 'lucide-react'
import { getArticleBySlug } from '@/actions/ruta'
import { ArticleContent } from './ArticleContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Artículo no encontrado' }
  return {
    title: article.seo_title ?? `${article.title} — Brasil BCN`,
    description: article.seo_description ?? article.excerpt ?? '',
    openGraph: {
      title: article.seo_title ?? article.title,
      description: article.seo_description ?? article.excerpt ?? '',
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('guide_articles')
    .select('slug')
    .eq('published', true)
  return (data ?? []).map((a: { slug: string }) => ({ slug: a.slug }))
}

export const revalidate = 3600

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const step = article.step
  const stage = step.stage

  const lastVerified = article.last_verified_at
    ? new Date(article.last_verified_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/ruta-brasileno" className="hover:text-[#002776] transition-colors flex items-center gap-1">
              <span>🗺️</span> Ruta del Brasileño
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link
              href={`/ruta-brasileno/${step.slug}`}
              className="hover:text-[#002776] transition-colors"
            >
              {step.icon} {step.title}
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_260px] gap-8">

          {/* Main */}
          <main>
            {/* Article header */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
              <div className="h-2 bg-[#002776]" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-400">
                  <span className="font-bold uppercase tracking-wider">{stage.icon} {stage.title}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span>{step.icon}</span> {step.title}
                  </span>
                  {step.estimated_time && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.estimated_time}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 leading-tight">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-gray-600 leading-relaxed text-base">
                    {article.excerpt}
                  </p>
                )}
                {lastVerified && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[#009C3B]">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Información verificada en {lastVerified}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Article body */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6">
              <ArticleContent content={article.content} />
            </div>

            {/* FAQs */}
            {article.faqs && article.faqs.length > 0 && (
              <section>
                <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#FFDF00]" /> Preguntas frecuentes
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl border border-gray-100 p-5">
                      <p className="font-semibold text-gray-900 text-sm mb-2">❓ {faq.question}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-4">

            {/* Step card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: stage.color }} />
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Este artículo pertenece a</p>
                <Link
                  href={`/ruta-brasileno/${step.slug}`}
                  className="group flex items-center gap-2 hover:text-[#002776] transition-colors"
                >
                  <span className="text-2xl">{step.icon}</span>
                  <span className="font-bold text-gray-900 text-sm group-hover:text-[#002776] leading-tight">{step.title}</span>
                </Link>
                {step.short_description && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{step.short_description}</p>
                )}
                <Link
                  href={`/ruta-brasileno/${step.slug}`}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#002776] bg-[#002776]/8 hover:bg-[#002776]/15 rounded-xl py-2 transition-colors"
                >
                  Ver todos los recursos <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Back to route */}
            <Link
              href="/ruta-brasileno"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#002776] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Ver toda la ruta
            </Link>
          </aside>

        </div>
      </div>
    </div>
  )
}

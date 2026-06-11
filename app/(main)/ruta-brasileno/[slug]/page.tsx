import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, Building2, ChevronRight, ExternalLink, HelpCircle, FileText, BookOpen } from 'lucide-react'
import { getStepBySlug, getStages } from '@/actions/ruta'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

const DIFFICULTY_LABELS = { facil: 'Fácil', medio: 'Nivel medio', dificil: 'Avanzado' }
const DIFFICULTY_COLORS = {
  facil:   'bg-green-50 text-green-700 border border-green-200',
  medio:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  dificil: 'bg-red-50 text-red-700 border border-red-200',
}
const RESOURCE_ICONS: Record<string, string> = {
  web_oficial:  '🏛️',
  formulario:   '📝',
  pdf:          '📄',
  video:        '🎬',
  herramienta:  '🔧',
}
const COMPANY_LABELS: Record<string, string> = {
  abogados:      'Abogados',
  gestores:      'Gestorías',
  contables:     'Contables',
  inmobiliarias: 'Inmobiliarias',
  bancos:        'Bancos',
  academias:     'Academias',
  agencias_empleo: 'Agencias de empleo',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const step = await getStepBySlug(slug)
  if (!step) return { title: 'Paso no encontrado' }
  return {
    title: `${step.title} — Ruta del Brasileño | Brasil BCN`,
    description: step.short_description ?? `Guía completa sobre ${step.title} para brasileños en España.`,
    openGraph: {
      title: `${step.title} — Brasil BCN`,
      description: step.short_description ?? '',
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
  const { data } = await supabase.from('route_steps').select('slug')
  return (data ?? []).map((s: { slug: string }) => ({ slug: s.slug }))
}

export const revalidate = 3600

export default async function StepPage({ params }: PageProps) {
  const { slug } = await params
  const [step, stages] = await Promise.all([getStepBySlug(slug), getStages()])
  if (!step) notFound()

  const stage = step.stage
  const allStepsInStage = stages.find(s => s.id === stage.id)
  const stepNumber = (stage.position - 1) * 4 + step.position

  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/ruta-brasileno" className="hover:text-[#002776] transition-colors flex items-center gap-1">
              <span>🗺️</span> Ruta del Brasileño
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-gray-400">{stage.icon} {stage.title}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-gray-900 font-medium">{step.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* ── Main content ── */}
          <main>
            {/* Step header */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
              <div className="h-2" style={{ backgroundColor: stage.color }} />
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: `${stage.color}15` }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Paso {stepNumber}
                      </span>
                      {step.difficulty && (
                        <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', DIFFICULTY_COLORS[step.difficulty])}>
                          {DIFFICULTY_LABELS[step.difficulty]}
                        </span>
                      )}
                      {step.estimated_time && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" /> {step.estimated_time}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">{step.title}</h1>
                    {step.short_description && (
                      <p className="text-gray-600 leading-relaxed">{step.short_description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Articles */}
            {step.articles && step.articles.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#002776]" /> Artículos
                </h2>
                <div className="space-y-3">
                  {step.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/ruta-brasileno/articulo/${article.slug}`}
                      className="group flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:border-[#002776]/25 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#002776] transition-colors">
                        <FileText className="w-5 h-5 text-[#002776] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#002776] transition-colors mb-1">
                          {article.title}
                        </p>
                        {article.excerpt && (
                          <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#002776] shrink-0 mt-1 transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* No articles placeholder */}
            {(!step.articles || step.articles.length === 0) && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6 text-center">
                <BookOpen className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <p className="text-blue-700 font-semibold text-sm mb-1">Artículos en preparación</p>
                <p className="text-blue-500 text-xs">Estamos preparando contenido verificado para este paso. Vuelve pronto.</p>
              </div>
            )}

            {/* Resources */}
            {step.resources && step.resources.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-[#009C3B]" /> Recursos útiles
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {step.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-[#009C3B]/30 hover:shadow-sm transition-all"
                    >
                      <span className="text-xl">{RESOURCE_ICONS[res.type] ?? '🔗'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#009C3B] transition-colors">
                          {res.title}
                        </p>
                        {res.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{res.description}</p>
                        )}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#009C3B] shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {step.faqs && step.faqs.length > 0 && (
              <section>
                <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#FFDF00]" /> Preguntas frecuentes
                </h2>
                <div className="space-y-3">
                  {step.faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl border border-gray-100 p-5">
                      <p className="font-semibold text-gray-900 text-sm mb-2">❓ {faq.question}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* ── Sidebar ── */}
          <aside className="space-y-4">

            {/* Stage info */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: stage.color }} />
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Etapa {stage.position}</p>
                <Link href="/ruta-brasileno" className="group flex items-center gap-2 hover:text-[#002776] transition-colors">
                  <span className="text-xl">{stage.icon}</span>
                  <span className="font-bold text-gray-900 text-sm group-hover:text-[#002776]">{stage.title}</span>
                </Link>
                {stage.description && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{stage.description}</p>
                )}
              </div>
            </div>

            {/* Related companies */}
            {step.company_categories && step.company_categories.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-[#002776]" />
                  <p className="font-bold text-gray-900 text-sm">Empresas que pueden ayudarte</p>
                </div>
                <div className="space-y-2">
                  {step.company_categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/empresas?categoria=${cat}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#002776] hover:text-white group transition-all"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors">
                        {COMPANY_LABELS[cat] ?? cat}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white/70 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back */}
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

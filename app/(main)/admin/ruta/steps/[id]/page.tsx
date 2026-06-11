import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, BookOpen, ExternalLink, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Admin · Editar paso' }

export default async function AdminStepDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: step } = await supabase
    .from('route_steps')
    .select('*, stage:route_stages(*), articles:guide_articles(*), resources:guide_resources(*), faqs:faq_items(*)')
    .eq('id', id)
    .single()

  if (!step) notFound()

  const articles = (step.articles ?? []) as { id: string; title: string; published: boolean; updated_at: string }[]
  const resources = (step.resources ?? []) as { id: string; title: string; url: string; type: string }[]
  const faqs = (step.faqs ?? []) as { id: string; question: string }[]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">

      <Link href="/admin/ruta" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#002776] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a la Ruta
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{step.icon}</span>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Paso · {step.stage?.title}</p>
            <h1 className="text-xl font-black text-gray-900">{step.title}</h1>
            {step.short_description && <p className="text-gray-500 text-sm mt-1">{step.short_description}</p>}
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-400">
          <span>⏱ {step.estimated_time ?? '—'}</span>
          <span>🎯 {step.difficulty ?? '—'}</span>
          <span>🔗 /ruta-brasileno/{step.slug}</span>
        </div>
      </div>

      {/* Articles */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#002776]" /> Artículos ({articles.length})
          </h2>
          <Link
            href={`/admin/ruta/articulos/nueva?step=${id}`}
            className="flex items-center gap-1 text-xs bg-[#002776] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#001a5c] transition-colors"
          >
            <Plus className="w-3 h-3" /> Nuevo
          </Link>
        </div>
        {articles.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-sm">
            Sin artículos. Añade el primero.
          </div>
        ) : (
          <div className="space-y-2">
            {articles.map((a) => (
              <div key={a.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-400">Actualizado: {new Date(a.updated_at).toLocaleDateString('es-ES')}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resources */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#009C3B]" /> Recursos ({resources.length})
          </h2>
        </div>
        {resources.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-sm">
            Sin recursos. Los recursos se añaden desde la base de datos por ahora.
          </div>
        ) : (
          <div className="space-y-2">
            {resources.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                <span className="text-xs text-gray-400">{r.type}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAQs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#FFDF00]" /> FAQs ({faqs.length})
          </h2>
        </div>
        {faqs.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-sm">
            Sin FAQs todavía.
          </div>
        ) : (
          <div className="space-y-2">
            {faqs.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">❓ {f.question}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

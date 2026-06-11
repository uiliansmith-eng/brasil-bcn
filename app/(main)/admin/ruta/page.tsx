import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, BookOpen, HelpCircle, ExternalLink, ChevronRight, GripVertical } from 'lucide-react'
import { getStagesWithSteps } from '@/actions/ruta'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Admin · Ruta del Brasileño' }

async function getStats() {
  const supabase = await createClient()
  const [{ count: articles }, { count: resources }, { count: faqs }] = await Promise.all([
    supabase.from('guide_articles').select('*', { count: 'exact', head: true }),
    supabase.from('guide_resources').select('*', { count: 'exact', head: true }),
    supabase.from('faq_items').select('*', { count: 'exact', head: true }),
  ])
  return { articles: articles ?? 0, resources: resources ?? 0, faqs: faqs ?? 0 }
}

export default async function AdminRutaPage() {
  const [stages, stats] = await Promise.all([getStagesWithSteps(), getStats()])

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Ruta del Brasileño</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona etapas, pasos, artículos, recursos y FAQs.</p>
        </div>
        <Link
          href="/admin/ruta/articulos/nueva"
          className="flex items-center gap-2 bg-[#002776] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#001a5c] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Artículos', value: stats.articles, icon: BookOpen, color: 'text-[#002776] bg-blue-50' },
          { label: 'Recursos', value: stats.resources, icon: ExternalLink, color: 'text-[#009C3B] bg-green-50' },
          { label: 'FAQs', value: stats.faqs, icon: HelpCircle, color: 'text-[#FFDF00] bg-yellow-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Stages & Steps */}
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Stage header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
              <span className="text-xl">{stage.icon}</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Etapa {stage.position}</p>
                <p className="font-bold text-gray-900">{stage.title}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                {stage.steps?.length ?? 0} pasos
              </span>
            </div>

            {/* Steps */}
            <div className="divide-y divide-gray-50">
              {(stage.steps ?? []).map((step) => (
                <Link
                  key={step.id}
                  href={`/admin/ruta/steps/${step.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <GripVertical className="w-4 h-4 text-gray-200 shrink-0" />
                  <span className="text-base">{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#002776] transition-colors">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{step.short_description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#002776] shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

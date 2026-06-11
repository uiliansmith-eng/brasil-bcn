import type { Metadata } from 'next'
import Link from 'next/link'
import { Map, ArrowRight, Users, Clock } from 'lucide-react'
import { getStagesWithSteps } from '@/actions/ruta'
import { RutaTimeline } from '@/components/ruta/RutaTimeline'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Ruta del Brasileño en España — Guía Paso a Paso',
  description: 'La guía completa para brasileños en Barcelona: desde el primer día hasta estabilizarte en España. NIE, empadronamiento, trabajo, vivienda y mucho más.',
  path: '/ruta-brasileno',
  keywords: ['guia brasileños barcelona', 'nie españa brasileños', 'vivir barcelona brasil', 'trámites brasil españa'],
})

export const revalidate = 3600

export default async function RutaBrasilenoPage() {
  const stages = await getStagesWithSteps()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative bg-[#002776] overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#009C3B]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FFDF00]/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Map className="w-3.5 h-3.5 text-[#FFDF00]" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">Guía oficial Brasil BCN</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Ruta del Brasileño{' '}
              <span className="text-[#FFDF00]">en España</span>
            </h1>
            <p className="text-blue-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              La guía de referencia para brasileños en Barcelona.
              Desde el primer día hasta estabilizarte — paso a paso, sin perderte nada importante.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🗺️</div>
                <span>{stages.length} etapas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">✅</div>
                <span>{stages.reduce((n, s) => n + (s.steps?.length ?? 0), 0)} pasos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🇧🇷</div>
                <span>Para brasileños en BCN</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 10C1200 35 960 5 720 20C480 35 240 5 0 20Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* ── Timeline interactive ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <RutaTimeline stages={stages} />
        </div>
      </section>

      {/* ── All steps grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Todos los pasos</h2>
          <p className="text-gray-500">Accede directamente al paso que necesitas ahora mismo.</p>
        </div>
        <div className="space-y-10">
          {stages.map((stage) => (
            <div key={stage.id}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ backgroundColor: `${stage.color}20` }}
                >
                  {stage.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Etapa {stage.position}</p>
                  <h3 className="font-black text-gray-900 text-lg leading-tight">{stage.title}</h3>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(stage.steps ?? []).map((step, idx) => (
                  <Link
                    key={step.id}
                    href={`/ruta-brasileno/${step.slug}`}
                    className="group bg-white rounded-xl border border-gray-100 p-4 hover:border-[#002776]/25 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-xs text-gray-300 font-bold">
                        {(stage.position - 1) * 4 + idx + 1}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#002776] transition-colors">
                      {step.title}
                    </p>
                    {step.estimated_time && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-gray-300" />
                        <span className="text-xs text-gray-400">{step.estimated_time}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

import type { Metadata } from 'next'
import { RouteHero } from '@/components/ruta/RouteHero'
import { RouteTimeline } from '@/components/ruta/RouteTimeline'
import { getStage1Steps, getStagesWithSteps } from '@/actions/ruta'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Ruta del Brasileño en Barcelona — Guía Paso a Paso',
  description: 'Guía paso a paso para brasileños que acaban de llegar a Barcelona y necesitan organizar su vida en España.',
  path: '/ruta-brasileno',
  keywords: ['guia brasileños barcelona', 'acabo de llegar barcelona', 'trámites brasileños españa', 'nie empadronamiento barcelona'],
})

export const revalidate = 3600

export default async function RutaBrasilenoPage() {
  const [steps, stages] = await Promise.all([
    getStage1Steps(),
    getStagesWithSteps(),
  ])

  const otherStages = stages.slice(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <RouteHero totalSteps={steps.length} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-14">

        {/* Stage 1 header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#002776]/8 border border-[#002776]/15 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#009C3B] animate-pulse" />
            <span className="text-[#002776] text-xs font-bold uppercase tracking-wider">Etapa 1 · Acabo de llegar</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Tus primeros pasos</h2>
          <p className="text-gray-500 text-sm mt-1">
            Completa cada paso en orden. Marca cuando hayas terminado para llevar el control.
          </p>
        </div>

        {/* Vertical timeline */}
        <RouteTimeline steps={steps} />

        {/* Other stages */}
        {otherStages.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h3 className="font-black text-lg text-gray-900 mb-1">Próximas etapas</h3>
            <p className="text-gray-400 text-sm mb-5">
              Más contenido se publicará próximamente conforme amplíes tu vida en España.
            </p>
            <div className="space-y-2">
              {otherStages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 opacity-50"
                >
                  <span className="text-xl">{stage.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Etapa {stage.position}</p>
                    <p className="font-semibold text-gray-700 text-sm">{stage.title}</p>
                  </div>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                    Próximamente
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { RouteHero } from '@/components/ruta/RouteHero'
import { AllStagesTimeline } from '@/components/ruta/AllStagesTimeline'
import { getStagesWithSteps } from '@/actions/ruta'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Ruta del Brasileño en Barcelona — Guía Paso a Paso',
  description: 'Guía paso a paso para brasileños que acaban de llegar a Barcelona y necesitan organizar su vida en España.',
  path: '/ruta-brasileno',
  keywords: ['guia brasileños barcelona', 'acabo de llegar barcelona', 'trámites brasileños españa', 'nie empadronamiento barcelona'],
})

export const revalidate = 3600

export default async function RutaBrasilenoPage() {
  const stages = await getStagesWithSteps()
  const totalSteps = stages.reduce((sum, s) => sum + (s.steps?.length ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <RouteHero totalSteps={totalSteps} totalStages={stages.length} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <AllStagesTimeline stages={stages} />
      </div>
    </div>
  )
}

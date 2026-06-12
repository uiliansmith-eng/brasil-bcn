import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/empleos/JobCard'
import { JobFilters } from '@/components/empleos/JobFilters'
import { Pagination } from '@/components/shared/Pagination'
import { getJobs, getJobSourceCounts } from '@/actions/jobs'
import { buildMetadata } from '@/lib/seo'
import { AdSlot } from '@/components/ads/AdSlot'
import type { JobCategory, JobType } from '@/types'

export const metadata: Metadata = buildMetadata({
  title: 'Empleos para brasileños en Barcelona | BrasilBCN',
  description: 'Encuentra trabajo en Barcelona y Cataluña. Cientos de ofertas verificadas para la comunidad brasileña: hostelería, construcción, limpieza, tecnología y más. Actualizado diariamente.',
  path: '/empleos',
  keywords: ['ofertas trabajo Barcelona', 'empleo brasileños Barcelona', 'trabajo hostelería Barcelona', 'empleo Cataluña', 'trabajo Barcelona brasileños', 'empleo extranjeros Barcelona'],
})

interface PageProps {
  searchParams: Promise<{
    categoria?: string
    tipo?: string
    ciudad?: string
    q?: string
    page?: string
    salarioMin?: string
    source?: string
    publicado?: string
  }>
}

export default async function EmpleosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const salarioMin = params.salarioMin ? Number(params.salarioMin) : undefined

  const [{ jobs, total, pages }, sourceCounts] = await Promise.all([
    getJobs({
      categoria: params.categoria as JobCategory | undefined,
      tipo: params.tipo as JobType | undefined,
      ciudad: params.ciudad,
      q: params.q,
      page,
      salarioMin,
      source: params.source as 'brasil_bcn' | 'adzuna' | 'jooble' | 'importados' | undefined,
    }),
    getJobSourceCounts(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] to-[#003a99] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-200 text-sm font-medium">Empleos · Barcelona</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Ofertas de empleo
              </h1>
              <p className="text-blue-200 mb-3">
                <span className="text-[#FFDF00] font-bold">{total.toLocaleString('es-ES')}</span> ofertas activas para brasileños en Cataluña
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-[#009C3B] animate-pulse" />
                  <span className="text-xs text-white font-semibold">{sourceCounts.brasil_bcn} verificadas BrasilBCN</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                  <span className="text-xs text-blue-200 font-medium">{sourceCounts.imported} importadas de portales</span>
                </div>
              </div>
            </div>
            <Link href="/empleos/publicar">
              <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold shadow-lg gap-2">
                <Plus className="w-4 h-4" /> Publicar empleo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Success banner */}
        {params.publicado && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#009C3B] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Empleo publicado!</p>
              <p className="text-green-700 text-sm">Tu oferta está siendo revisada y aparecerá en breve.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar filters */}
          <aside>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-bold text-gray-900">Filtrar</h2>
              </div>
              <Suspense>
                <JobFilters />
              </Suspense>
            </div>
          </aside>

          {/* Job listings */}
          <div>
            <AdSlot position="jobs_top" className="mb-5" />
            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">No hay empleos</h3>
                <p className="text-gray-500 text-sm mb-6">
                  No encontramos empleos con los filtros seleccionados.
                </p>
                <Link href="/empleos">
                  <Button variant="outline">Ver todos los empleos</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm">
                    {total.toLocaleString('es-ES')} resultado{total !== 1 ? 's' : ''}
                    {page > 1 && ` · Página ${page} de ${pages}`}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <JobCard key={job.id} job={job as any} />
                  ))}
                </div>

                {/* CTA contratar */}
                <Link href="/empleos/publicar" className="group block mt-6">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002776] to-[#003a99] px-7 py-7 flex flex-col sm:flex-row items-center justify-between gap-5 hover:shadow-xl transition-shadow duration-300">
                    {/* Accents */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#009C3B]/20 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#FFDF00]/10 blur-2xl pointer-events-none" />
                    <div className="relative text-center sm:text-left">
                      <p className="text-[#FFDF00] text-xs font-bold uppercase tracking-widest mb-1">Para empresas</p>
                      <h3 className="text-white font-black text-xl sm:text-2xl leading-tight mb-1.5">
                        ¿Necesitas contratar?
                      </h3>
                      <p className="text-blue-200 text-sm">
                        Publica tu oferta y encuentra candidatos rápidamente.
                      </p>
                    </div>
                    <div className="relative shrink-0">
                      <span className="inline-flex items-center gap-2 bg-[#009C3B] group-hover:bg-[#007a2f] text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 text-sm whitespace-nowrap shadow-lg">
                        <Plus className="w-4 h-4" />
                        Publicar empleo
                      </span>
                    </div>
                  </div>
                </Link>

                <Suspense>
                  <Pagination currentPage={page} totalPages={pages} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanyCard } from '@/components/empresas/CompanyCard'
import { CompanyFilters } from '@/components/empresas/CompanyFilters'
import { Pagination } from '@/components/shared/Pagination'
import { getCompanies } from '@/actions/companies'
import { buildMetadata } from '@/lib/seo'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Company, CompanyCategory } from '@/types'

export const metadata: Metadata = buildMetadata({
  title: 'Directorio de empresas brasileñas en Barcelona',
  description: 'Encuentra empresas y negocios brasileños en Barcelona: restaurantes, abogados, peluquerías, construcción, contables y más.',
  path: '/empresas',
  keywords: ['empresas brasileñas Barcelona', 'negocios brasileños España', 'restaurante brasileño Barcelona', 'directorio brasileños'],
})

interface PageProps {
  searchParams: Promise<{
    categoria?: string
    ciudad?: string
    q?: string
    page?: string
    registrada?: string
  }>
}

export default async function EmpresasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)

  const { companies, total, pages } = await getCompanies({
    categoria: params.categoria as CompanyCategory | undefined,
    ciudad: params.ciudad,
    q: params.q,
    page,
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] to-[#001a5c] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-200 text-sm font-medium">Empresas · Directorio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Directorio de empresas
              </h1>
              <p className="text-blue-200">
                <span className="text-[#FFDF00] font-bold">{total.toLocaleString('es-ES')}</span> empresas brasileñas en Cataluña
              </p>
            </div>
            <Link href="/empresas/registrar">
              <Button className="bg-[#FFDF00] hover:bg-[#e6ca00] text-[#002776] font-bold shadow-lg gap-2">
                <Plus className="w-4 h-4" /> Registrar empresa
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Success banner */}
        {params.registrada && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#009C3B] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Empresa registrada!</p>
              <p className="text-green-700 text-sm">Tu empresa está siendo revisada y aparecerá en breve.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-5">Filtrar</h2>
              <Suspense>
                <CompanyFilters />
              </Suspense>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <AdSlot position="companies_top" className="mb-5" />
            {companies.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">No hay empresas</h3>
                <p className="text-gray-500 text-sm mb-6">No encontramos empresas con esos filtros.</p>
                <Link href="/empresas">
                  <Button variant="outline">Ver todas las empresas</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm">
                    {total.toLocaleString('es-ES')} empresa{total !== 1 ? 's' : ''}
                    {page > 1 && ` · Página ${page} de ${pages}`}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {companies.map((company) => (
                    <CompanyCard key={company.id} company={company as Company} />
                  ))}
                </div>
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

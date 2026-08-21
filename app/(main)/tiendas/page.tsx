import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Store, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanyCard } from '@/components/empresas/CompanyCard'
import { CompanyFilters } from '@/components/empresas/CompanyFilters'
import { Pagination } from '@/components/shared/Pagination'
import { getStores } from '@/actions/stores'
import { getFeaturedStoreIds } from '@/actions/promotions'
import { buildMetadata } from '@/lib/seo'
import type { Company, CompanyCategory } from '@/types'

export const metadata: Metadata = buildMetadata({
  title: 'Tiendas — negocios brasileños con catálogo y cupones',
  description: 'Descubre tiendas, restaurantes, barberías y servicios de la comunidad brasileña en Barcelona con catálogo, precios y cupones de descuento.',
  path: '/tiendas',
  keywords: ['tiendas brasileñas Barcelona', 'cupones brasileños Barcelona', 'catálogo negocios brasileños'],
})

interface PageProps {
  searchParams: Promise<{
    categoria?: string
    ciudad?: string
    q?: string
    page?: string
  }>
}

export default async function TiendasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)

  const [{ stores, total, pages }, featuredIds] = await Promise.all([
    getStores({
      categoria: params.categoria as CompanyCategory | undefined,
      ciudad: params.ciudad,
      q: params.q,
      page,
    }),
    getFeaturedStoreIds(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] to-[#001a5c] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-200 text-sm font-medium">Brasil BCN · Tiendas</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Tiendas de la comunidad
              </h1>
              <p className="text-blue-200">
                <span className="text-[#FFDF00] font-bold">{total.toLocaleString('es-ES')}</span> tiendas con catálogo y cupones
              </p>
            </div>
            <Link href="/tiendas/crear">
              <Button className="bg-[#FFDF00] hover:bg-[#e6ca00] text-[#002776] font-bold shadow-lg gap-2">
                <Plus className="w-4 h-4" /> Crear mi tienda
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {stores.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Todavía no hay tiendas</h3>
                <p className="text-gray-500 text-sm mb-6">Sé el primero en abrir tu tienda dentro de Brasil BCN.</p>
                <Link href="/tiendas/crear">
                  <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white gap-2">
                    <Plus className="w-4 h-4" /> Crear mi tienda
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm">
                    {total.toLocaleString('es-ES')} tienda{total !== 1 ? 's' : ''}
                    {page > 1 && ` · Página ${page} de ${pages}`}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stores.map((store) => (
                    <CompanyCard key={store.id} company={store as Company} basePath="/tiendas" featured={featuredIds.has(store.id)} />
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

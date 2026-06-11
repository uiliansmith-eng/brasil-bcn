import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/compraventa/ListingCard'
import { ListingFilters } from '@/components/compraventa/ListingFilters'
import { getListings } from '@/actions/listings'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Compra y Venta — BrasilBCN',
  description: 'Compra y vende artículos de segunda mano entre la comunidad brasileña en Barcelona. Electrónica, muebles, ropa y más.',
  path: '/compraventa',
  keywords: ['compra venta barcelona brasileños', 'segunda mano barcelona', 'artículos usados barcelona'],
})

interface PageProps {
  searchParams: Promise<{ categoria?: string; condicion?: string; ciudad?: string; q?: string; page?: string }>
}

export default async function CompraventaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = params.page ? parseInt(params.page) : 1

  const { listings, total, pageSize } = await getListings({
    categoria: params.categoria,
    condicion: params.condicion,
    ciudad: params.ciudad,
    q: params.q,
    page: currentPage,
  })

  const totalPages = Math.ceil(total / pageSize)
  const hasFilters = !!(params.categoria || params.condicion || params.ciudad || params.q)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#009C3B] via-[#009C3B] to-[#007a2f] pt-24 pb-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-green-100 text-sm font-medium">Compra & Venta · BrasilBCN</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Compra y Venta
              </h1>
              <p className="text-green-100 text-lg">
                {total > 0 ? `${total.toLocaleString('es-ES')} artículos disponibles` : 'Artículos de segunda mano entre la comunidad'}
              </p>
            </div>
            <Link href="/compraventa/publicar">
              <Button className="bg-white hover:bg-gray-50 text-[#009C3B] font-bold px-6 h-11 shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Publicar anuncio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar filters */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ListingFilters />
          </div>

          {/* Listings grid */}
          <div>
            {hasFilters && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  {total} resultado{total !== 1 ? 's' : ''}
                </p>
                <Link href="/compraventa" className="text-sm font-medium text-[#009C3B] hover:underline">
                  Limpiar filtros
                </Link>
              </div>
            )}

            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No hay anuncios</h3>
                <p className="text-gray-500 mb-6">
                  {hasFilters ? 'Prueba con otros filtros.' : 'Sé el primero en publicar un anuncio.'}
                </p>
                <Link href="/compraventa/publicar">
                  <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold">
                    Publicar anuncio
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {currentPage > 1 && (
                      <Link
                        href={`/compraventa?${new URLSearchParams({ ...params, page: String(currentPage - 1) }).toString()}`}
                        className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Anterior
                      </Link>
                    )}
                    <span className="px-4 py-2 text-sm text-gray-500">
                      Página {currentPage} de {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <Link
                        href={`/compraventa?${new URLSearchParams({ ...params, page: String(currentPage + 1) }).toString()}`}
                        className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Siguiente
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GuideCard } from '@/components/guia/GuideCard'
import { GuideFilters } from '@/components/guia/GuideFilters'
import { Pagination } from '@/components/shared/Pagination'
import { getGuides } from '@/actions/guides'
import { GUIDE_CATEGORY_LABELS } from '@/lib/constants'
import { buildMetadata } from '@/lib/seo'
import type { GuideCategory } from '@/types'

export const metadata: Metadata = buildMetadata({
  title: 'Guía del Brasileño en Barcelona',
  description: 'Todo lo que necesitas saber para vivir en España: NIE, empadronamiento, autónomos, Seguridad Social, bancos y más.',
  path: '/guia',
  keywords: ['NIE España brasileños', 'empadronamiento Barcelona', 'autónomos Brasil España', 'guia vivir España'],
})

interface PageProps {
  searchParams: Promise<{
    categoria?: string
    q?: string
    page?: string
  }>
}

const CATEGORY_KEYS = Object.keys(GUIDE_CATEGORY_LABELS) as GuideCategory[]

export default async function GuiaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)

  const { guides, total, pages } = await getGuides({
    categoria: params.categoria as GuideCategory | undefined,
    q: params.q,
    page,
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] to-[#001a5c] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-medium">Guía · Recursos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Guía del Brasileño
          </h1>
          <p className="text-blue-200 max-w-xl">
            Todo lo que necesitas saber para vivir en España.
            {total > 0 && <> <span className="text-[#FFDF00] font-bold">{total}</span> guías disponibles.</>}
          </p>
        </div>
      </div>

      {/* Category quick links */}
      {!params.categoria && !params.q && page === 1 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORY_KEYS.map((cat) => (
                <Link
                  key={cat}
                  href={`/guia?categoria=${cat}`}
                  className="shrink-0 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:border-[#002776] hover:text-[#002776] text-gray-600 transition-all whitespace-nowrap"
                >
                  {GUIDE_CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-5">Explorar</h2>
              <Suspense>
                <GuideFilters />
              </Suspense>
            </div>
          </aside>

          {/* Grid */}
          <div>
            {guides.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">No hay guías</h3>
                <p className="text-gray-500 text-sm mb-6">No encontramos guías con esos filtros.</p>
                <Link href="/guia">
                  <Button variant="outline">Ver todas las guías</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-500 text-sm">
                    {total.toLocaleString('es-ES')} guía{total !== 1 ? 's' : ''}
                    {params.categoria && ` de ${GUIDE_CATEGORY_LABELS[params.categoria as GuideCategory]}`}
                    {page > 1 && ` · Página ${page} de ${pages}`}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {guides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide as Parameters<typeof GuideCard>[0]['guide']} />
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Heart, Store } from 'lucide-react'
import { getMyFavoriteStores } from '@/actions/favorites'
import { COMPANY_CATEGORY_LABELS } from '@/lib/constants'
import type { CompanyCategory } from '@/types'

export const metadata: Metadata = { title: 'Mis favoritos — Brasil BCN' }

export default async function MisFavoritosPage() {
  const favorites = await getMyFavoriteStores()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-8">Mis favoritos</h1>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Todavía no guardaste ninguna tienda</p>
          <p className="text-gray-400 text-sm">Explora el directorio de tiendas de Brasil BCN.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => {
            const company = fav.company as unknown as { id: string; name: string; slug: string; logo_url: string | null; city: string; category: string } | null
            if (!company) return null
            return (
              <Link
                key={fav.id}
                href={`/tiendas/${company.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#009C3B]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#002776]/10 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-[#002776]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{company.name}</p>
                  <p className="text-xs text-gray-400">
                    {COMPANY_CATEGORY_LABELS[company.category as CompanyCategory] ?? company.category} · {company.city}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

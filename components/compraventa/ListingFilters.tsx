'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { LISTING_CATEGORY_LABELS, LISTING_CONDITION_LABELS, CITIES } from '@/lib/constants'

export function ListingFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const categoria = searchParams.get('categoria') ?? ''
  const condicion = searchParams.get('condicion') ?? ''
  const ciudad = searchParams.get('ciudad') ?? ''
  const q = searchParams.get('q') ?? ''

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal className="w-4 h-4 text-gray-400" />
        <span className="font-semibold text-gray-700 text-sm">Filtros</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar artículos..."
          defaultValue={q}
          onChange={(e) => update('q', e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B]"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Categoría</label>
        <select
          value={categoria}
          onChange={(e) => update('categoria', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B] bg-white"
        >
          <option value="">Todas las categorías</option>
          {Object.entries(LISTING_CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado</label>
        <select
          value={condicion}
          onChange={(e) => update('condicion', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B] bg-white"
        >
          <option value="">Cualquier estado</option>
          {Object.entries(LISTING_CONDITION_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ciudad</label>
        <select
          value={ciudad}
          onChange={(e) => update('ciudad', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B] bg-white"
        >
          <option value="">Todas las ciudades</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

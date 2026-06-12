'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { COMPANY_CATEGORY_LABELS } from '@/lib/constants'
import { CitySelect } from '@/components/shared/CitySelect'
import { cn } from '@/lib/utils'
import type { CompanyCategory } from '@/types'

const CATEGORIES = Object.entries(COMPANY_CATEGORY_LABELS) as [CompanyCategory, string][]

export function CompanyFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('categoria') as CompanyCategory | null
  const currentCity = searchParams.get('ciudad')
  const currentQ = searchParams.get('q') ?? ''
  const hasFilters = currentCategory || currentCity || currentQ

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set(key, value) } else { params.delete(key) }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const clearAll = () => router.push(pathname, { scroll: false })

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar empresa..."
          defaultValue={currentQ}
          onChange={(e) => {
            const value = e.target.value
            const t = setTimeout(() => updateParam('q', value || null), 400)
            return () => clearTimeout(t)
          }}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20 transition-colors"
        />
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Filtros activos</p>
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
            <X className="w-3 h-3" /> Limpiar
          </button>
        </div>
      )}

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Sector</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              onClick={() => updateParam('categoria', currentCategory === value ? null : value)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                currentCategory === value
                  ? 'bg-[#009C3B] text-white border-[#009C3B]'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-[#009C3B] hover:text-[#009C3B]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Ciudad</p>
        <CitySelect
          value={currentCity ?? ''}
          onChange={(v) => updateParam('ciudad', v || null)}
          className="h-10"
        />
      </div>
    </div>
  )
}

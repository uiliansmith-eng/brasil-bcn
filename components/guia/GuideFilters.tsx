'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X, BookOpen } from 'lucide-react'
import { GUIDE_CATEGORY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { GuideCategory } from '@/types'

const CATEGORIES = Object.entries(GUIDE_CATEGORY_LABELS) as [GuideCategory, string][]

export function GuideFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('categoria') as GuideCategory | null
  const currentQ = searchParams.get('q') ?? ''
  const hasFilters = currentCategory || currentQ

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
          placeholder="Buscar guía..."
          defaultValue={currentQ}
          onChange={(e) => {
            const value = e.target.value
            const t = setTimeout(() => updateParam('q', value || null), 400)
            return () => clearTimeout(t)
          }}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#002776] focus:ring-2 focus:ring-[#002776]/20 transition-colors"
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

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Tema</p>
        <div className="space-y-1">
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              onClick={() => updateParam('categoria', currentCategory === value ? null : value)}
              className={cn(
                'w-full flex items-center gap-2.5 text-sm font-medium px-3 py-2 rounded-xl transition-all text-left',
                currentCategory === value
                  ? 'bg-[#002776] text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#002776]'
              )}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

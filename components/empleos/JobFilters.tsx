'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { JOB_CATEGORY_LABELS, JOB_TYPE_LABELS } from '@/lib/constants'
import { CitySelect } from '@/components/shared/CitySelect'
import { cn } from '@/lib/utils'
import type { JobCategory, JobType } from '@/types'

const CATEGORIES = Object.entries(JOB_CATEGORY_LABELS) as [JobCategory, string][]
const TYPES = Object.entries(JOB_TYPE_LABELS) as [JobType, string][]

const SALARY_OPTIONS = [
  { label: 'Más de 1.000€', value: '1000' },
  { label: 'Más de 1.500€', value: '1500' },
  { label: 'Más de 2.000€', value: '2000' },
  { label: 'Más de 2.500€', value: '2500' },
]

const SOURCE_OPTIONS: { label: string; value: string | null }[] = [
  { label: 'Todos', value: null },
  { label: 'BrasilBCN', value: 'brasil_bcn' },
  { label: 'Importados', value: 'importados' },
]

export function JobFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('categoria') as JobCategory | null
  const currentType = searchParams.get('tipo') as JobType | null
  const currentCity = searchParams.get('ciudad')
  const currentQ = searchParams.get('q') ?? ''
  const currentSalario = searchParams.get('salarioMin')
  const currentSource = searchParams.get('source')
  const hasFilters = !!(currentCategory || currentType || currentCity || currentQ || currentSalario || currentSource)

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const clearAll = () => router.push(pathname, { scroll: false })

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por título..."
          defaultValue={currentQ}
          onChange={(e) => {
            const value = e.target.value
            const timeout = setTimeout(() => updateParam('q', value || null), 400)
            return () => clearTimeout(timeout)
          }}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20 transition-colors"
        />
      </div>

      {/* Active filters + clear */}
      {hasFilters && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Filtros activos</p>
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <X className="w-3 h-3" /> Limpiar filtros
          </button>
        </div>
      )}

      {/* Source filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Fuente</p>
        <div className="flex gap-2">
          {SOURCE_OPTIONS.map(({ label, value }) => {
            const isActive = value === null ? !currentSource : currentSource === value
            return (
              <button
                key={label}
                onClick={() => updateParam('source', value === null || currentSource === value ? null : value)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                  isActive
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Salary filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Salario mínimo</p>
        <div className="flex flex-wrap gap-2">
          {SALARY_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => updateParam('salarioMin', currentSalario === value ? null : value)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                currentSalario === value
                  ? 'bg-[#009C3B] text-white border-[#009C3B]'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-[#009C3B] hover:text-[#009C3B]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Categoría</p>
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

      {/* Type filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Tipo de jornada</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(([value, label]) => (
            <button
              key={value}
              onClick={() => updateParam('tipo', currentType === value ? null : value)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                currentType === value
                  ? 'bg-[#002776] text-white border-[#002776]'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-[#002776] hover:text-[#002776]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* City filter */}
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

'use client'

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { getStoreCategories } from '@/actions/stores'
import { cn } from '@/lib/utils'
import type { StoreCategory, StoreSubcategory } from '@/types'

type CategoryWithSubs = StoreCategory & { subcategories: StoreSubcategory[] }

interface StoreCategoryPickerProps {
  categoryId?: string
  subcategoryId?: string
  onChange: (categoryId: string, subcategoryId: string) => void
}

export function StoreCategoryPicker({ categoryId, subcategoryId, onChange }: StoreCategoryPickerProps) {
  const [categories, setCategories] = useState<CategoryWithSubs[]>([])

  useEffect(() => {
    getStoreCategories().then((data) => setCategories(data as CategoryWithSubs[]))
  }, [])

  const selected = categories.find((c) => c.id === categoryId)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Rubro de la tienda</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id, '')}
              className={cn(
                'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
                categoryId === cat.id
                  ? 'bg-[#002776] text-white border-[#002776]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#002776]'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">Define el rubro específico dentro del directorio de Tiendas.</p>
      </div>

      {selected && selected.subcategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Subcategoría</Label>
          <div className="flex flex-wrap gap-2">
            {selected.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => onChange(selected.id, sub.id)}
                className={cn(
                  'text-sm font-medium px-3 py-1.5 rounded-lg border transition-all',
                  subcategoryId === sub.id
                    ? 'bg-[#009C3B] text-white border-[#009C3B]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#009C3B]'
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

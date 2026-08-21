'use client'

import { useTransition } from 'react'
import { Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import { toggleStoreModuleAction } from '@/actions/stores'
import { STORE_MODULE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { StoreModule, StoreModuleKey } from '@/types'

const MODULE_ORDER: StoreModuleKey[] = [
  'products', 'services', 'bookings', 'payments', 'coupons', 'qr',
  'gallery', 'reviews', 'promotions', 'delivery', 'pickup',
]

interface StoreModulesManagerProps {
  companyId: string
  modules: StoreModule[]
}

export function StoreModulesManager({ companyId, modules }: StoreModulesManagerProps) {
  const [isPending, startTransition] = useTransition()
  const byKey = new Map(modules.map((m) => [m.module_key, m]))

  const handleToggle = (moduleKey: StoreModuleKey, currentlyActive: boolean) => {
    const formData = new FormData()
    formData.set('company_id', companyId)
    formData.set('module_key', moduleKey)
    formData.set('is_active', String(currentlyActive))
    startTransition(() => { toggleStoreModuleAction(formData) })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-gray-900 text-lg">Módulos de la tienda</h2>
        {isPending && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
      </div>
      <p className="text-gray-400 text-sm mb-5">Activa o desactiva funciones según lo que necesite tu negocio.</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {MODULE_ORDER.map((key) => {
          const mod = byKey.get(key)
          const isActive = mod?.is_active ?? false
          return (
            <button
              key={key}
              type="button"
              disabled={isPending || !mod}
              onClick={() => handleToggle(key, isActive)}
              className={cn(
                'flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left',
                isActive ? 'border-[#009C3B]/30 bg-[#009C3B]/5 text-gray-900' : 'border-gray-100 text-gray-400'
              )}
            >
              {STORE_MODULE_LABELS[key]}
              {isActive ? (
                <ToggleRight className="w-5 h-5 text-[#009C3B] shrink-0" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-300 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

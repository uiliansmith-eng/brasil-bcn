'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { createPromotionAction, togglePromotionActiveAction, deletePromotionAction } from '@/actions/promotions'
import { promotionSchema, type PromotionInput } from '@/lib/validations/promotions'
import type { Promotion, StoreItem, PromotionScope } from '@/types'

interface PromotionsManagerProps {
  companyId: string
  promotions: Promotion[]
  items: StoreItem[]
  moduleActive: boolean
}

export function PromotionsManager({ companyId, promotions, items, moduleActive }: PromotionsManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [scope, setScope] = useState<PromotionScope>('store')
  const [storeItemId, setStoreItemId] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromotionInput>({
    resolver: zodResolver(promotionSchema),
    defaultValues: { is_active: true },
  })

  const onSubmit = async (data: PromotionInput) => {
    setServerError(null)
    const result = await createPromotionAction(companyId, scope, data, scope === 'product' ? storeItemId : undefined)
    if ('error' in result) { setServerError(result.error); return }
    reset({ is_active: true, title: '', image_url: '', link_url: '', starts_at: '', ends_at: '' })
    setShowForm(false)
  }

  if (!moduleActive) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <h2 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#009C3B]" /> Promociones
        </h2>
        <p className="text-gray-400 text-sm">Activa el módulo &quot;Promociones&quot; arriba para destacar tu tienda o un producto.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#009C3B]" /> Promociones
        </h2>
        {!showForm && (
          <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]">
            <Plus className="w-4 h-4" /> Nueva
          </button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-5">Destaca tu tienda en el directorio o resalta un producto.</p>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 p-4 bg-gray-50 rounded-xl space-y-3">
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={() => setScope('store')} className={`text-sm font-medium px-3 py-1.5 rounded-lg border ${scope === 'store' ? 'bg-[#002776] text-white border-[#002776]' : 'bg-white text-gray-600 border-gray-200'}`}>
              Destacar tienda
            </button>
            <button type="button" onClick={() => setScope('product')} className={`text-sm font-medium px-3 py-1.5 rounded-lg border ${scope === 'product' ? 'bg-[#002776] text-white border-[#002776]' : 'bg-white text-gray-600 border-gray-200'}`}>
              Destacar producto
            </button>
          </div>

          {scope === 'product' && (
            <select
              value={storeItemId}
              onChange={(e) => setStoreItemId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm"
            >
              <option value="">Elige un producto...</option>
              {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          )}

          <FormField label="Título *" placeholder="Ej: 2x1 en camisetas" error={errors.title?.message} {...register('title')} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Desde (opcional)" type="date" {...register('starts_at')} />
            <FormField label="Hasta (opcional)" type="date" {...register('ends_at')} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} size="sm" className="bg-[#009C3B] hover:bg-[#007a2f] text-white">
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Crear'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {promotions.length === 0 ? (
        <p className="text-gray-400 text-sm">Todavía no creaste ninguna promoción.</p>
      ) : (
        <div className="space-y-2">
          {promotions.map((promo) => (
            <div key={promo.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{promo.title}</p>
                <p className="text-xs text-gray-400">{promo.scope === 'store' ? 'Tienda destacada' : 'Producto destacado'}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${promo.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {promo.is_active ? 'Activa' : 'Pausada'}
              </span>
              <form action={togglePromotionActiveAction}>
                <input type="hidden" name="id" value={promo.id} />
                <input type="hidden" name="is_active" value={String(promo.is_active)} />
                <button type="submit" className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  {promo.is_active ? 'Pausar' : 'Activar'}
                </button>
              </form>
              <form action={deletePromotionAction}>
                <input type="hidden" name="id" value={promo.id} />
                <button type="submit" className="text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

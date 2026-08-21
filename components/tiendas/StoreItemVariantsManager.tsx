'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import {
  getStoreItemVariants,
  createStoreItemVariantAction,
  deleteStoreItemVariantAction,
} from '@/actions/stores'
import { storeItemVariantSchema, type StoreItemVariantInput } from '@/lib/validations/stores'
import type { StoreItemVariant } from '@/types'

interface StoreItemVariantsManagerProps {
  storeItemId: string
}

export function StoreItemVariantsManager({ storeItemId }: StoreItemVariantsManagerProps) {
  const [variants, setVariants] = useState<StoreItemVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    getStoreItemVariants(storeItemId).then((data) => {
      setVariants(data as StoreItemVariant[])
      setLoading(false)
    })
  }

  useEffect(load, [storeItemId])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StoreItemVariantInput>({
    resolver: zodResolver(storeItemVariantSchema),
    defaultValues: { is_active: true },
  })

  const onSubmit = async (data: StoreItemVariantInput) => {
    const result = await createStoreItemVariantAction(storeItemId, data)
    if ('ok' in result) {
      reset({ is_active: true, name: '', sku: '', price_override: null, stock: null })
      setShowForm(false)
      load()
    }
  }

  const handleRemove = async (formData: FormData) => {
    await deleteStoreItemVariantAction(formData)
    load()
  }

  if (loading) return <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />

  return (
    <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-2">
      {variants.map((v) => (
        <div key={v.id} className="flex items-center gap-3 text-sm">
          <span className="font-medium text-gray-700 flex-1 truncate">{v.name}</span>
          {v.sku && <span className="text-xs text-gray-400 font-mono">{v.sku}</span>}
          {v.price_override !== null && <span className="text-xs text-gray-500">{v.price_override}€</span>}
          {v.stock !== null && <span className="text-xs text-gray-400">{v.stock} uds</span>}
          <form action={handleRemove}>
            <input type="hidden" name="id" value={v.id} />
            <button type="submit" className="text-gray-300 hover:text-red-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-2 pt-1">
          <FormField label="Nombre" placeholder="Talla M / Azul" error={errors.name?.message} {...register('name')} className="w-36" />
          <FormField label="SKU" placeholder="SKU" {...register('sku')} className="w-24" />
          <FormField label="Precio" type="number" step="0.01" placeholder="€" {...register('price_override')} className="w-20" />
          <FormField label="Stock" type="number" placeholder="0" {...register('stock')} className="w-20" />
          <Button type="submit" disabled={isSubmitting} size="sm" className="bg-[#009C3B] hover:bg-[#007a2f] text-white h-9">
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Añadir'}
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => setShowForm(false)}>
            Cancelar
          </Button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-xs font-semibold text-[#009C3B] hover:text-[#007a2f] pt-1"
        >
          <Plus className="w-3 h-3" /> Añadir variante
        </button>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createStoreItemAction, updateStoreItemAction } from '@/actions/stores'
import { storeItemSchema, type StoreItemInput } from '@/lib/validations/stores'
import { STORE_ITEM_TYPE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { StoreItem } from '@/types'

interface StoreItemFormProps {
  companyId: string
  item?: StoreItem
  onDone: () => void
}

export function StoreItemForm({ companyId, item, onDone }: StoreItemFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_url ?? null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StoreItemInput>({
    resolver: zodResolver(storeItemSchema),
    defaultValues: item ? {
      item_type: item.item_type,
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      category: item.category ?? '',
      duration_min: item.duration_min,
      is_active: item.is_active,
      sku: item.sku ?? '',
      track_stock: item.track_stock,
      stock: item.stock,
    } : {
      item_type: 'product',
      is_active: true,
      track_stock: false,
    },
  })

  const itemType = watch('item_type')
  const isActive = watch('is_active')
  const trackStock = watch('track_stock')

  const onSubmit = async (data: StoreItemInput) => {
    setServerError(null)
    const payload = { ...data, image_url: imageUrl ?? undefined }
    const result = item
      ? await updateStoreItemAction(item.id, payload)
      : await createStoreItemAction(companyId, payload)

    if ('error' in result) { setServerError(result.error); return }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <div className="flex gap-2">
        {(['product', 'service'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setValue('item_type', type)}
            className={cn(
              'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
              itemType === type
                ? 'bg-[#009C3B] text-white border-[#009C3B]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#009C3B]'
            )}
          >
            {STORE_ITEM_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <ImageUpload
        bucket="companies"
        value={imageUrl}
        onChange={setImageUrl}
        label="Foto"
        aspectRatio="square"
        className="[&>div]:max-w-[120px]"
      />

      <FormField
        label="Nombre *"
        placeholder={itemType === 'service' ? 'Ej: Corte de pelo' : 'Ej: Camiseta oficial'}
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">Descripción</Label>
        <Textarea
          rows={3}
          className="rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none bg-white"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Precio (€)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
        {itemType === 'service' && (
          <FormField
            label="Duración (min)"
            type="number"
            placeholder="30"
            error={errors.duration_min?.message}
            {...register('duration_min')}
          />
        )}
      </div>

      <FormField
        label="Categoría interna"
        placeholder="Ej: Cortes, Entrantes, Camisetas..."
        error={errors.category?.message}
        {...register('category')}
      />

      {itemType === 'product' && (
        <>
          <FormField
            label="SKU / referencia"
            placeholder="Ej: CAM-AZUL-M"
            error={errors.sku?.message}
            {...register('sku')}
          />
          <div className="flex items-center gap-2.5">
            <Checkbox id="track_stock" checked={trackStock} onCheckedChange={(v) => setValue('track_stock', v === true)} />
            <label htmlFor="track_stock" className="text-sm text-gray-700 cursor-pointer">Controlar stock</label>
          </div>
          {trackStock && (
            <FormField
              label="Unidades en stock"
              type="number"
              placeholder="0"
              error={errors.stock?.message}
              {...register('stock')}
            />
          )}
        </>
      )}

      <div className="flex items-center gap-2.5">
        <Checkbox id="item_active" checked={isActive} onCheckedChange={(v) => setValue('is_active', v === true)} />
        <label htmlFor="item_active" className="text-sm text-gray-700 cursor-pointer">Visible en la tienda</label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-10 bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : item ? 'Guardar cambios' : 'Añadir'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

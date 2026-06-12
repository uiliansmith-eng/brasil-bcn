'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MultiImageUpload } from '@/components/ui/ImageUpload'
import { createListingSchema, type CreateListingInput, LISTING_CATEGORIES, LISTING_CONDITIONS } from '@/lib/validations/listings'
import { createListingAction } from '@/actions/listings'
import { LISTING_CATEGORY_LABELS, LISTING_CONDITION_LABELS, CITIES_BY_PROVINCE } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function PublishListingForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      price_negotiable: false,
      category: undefined,
      condition: undefined,
      city: 'Barcelona',
      whatsapp: '',
    },
  })

  const selectedCategory = watch('category')
  const selectedCondition = watch('condition')
  const isNegotiable = watch('price_negotiable')

  async function onSubmit(data: CreateListingInput) {
    setServerError(null)
    try {
      const result = await createListingAction({ ...data, images })
      if (result && 'error' in result) { setServerError(result.error); return }
      if (result && 'ok' in result) router.push(result.redirectTo)
    } catch (e) {
      setServerError('Error inesperado. Por favor recarga la página e inténtalo de nuevo.')
      console.error('[PublishListingForm] unexpected error:', e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex gap-3">
          <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
          <div>
            <p className="font-semibold text-red-700 text-sm">Error al publicar</p>
            <p className="text-red-600 text-sm mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Images */}
      <MultiImageUpload
        bucket="listings"
        value={images}
        onChange={setImages}
        max={5}
        label="Fotos del artículo"
      />

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Título del anuncio <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          placeholder="Ej: iPhone 14 Pro Max 256GB en perfecto estado"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B]"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={5}
          placeholder="Describe el artículo con detalle: características, motivo de venta, posibilidad de entrega..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B] resize-none"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Categoría <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {LISTING_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setValue('category', cat, { shouldValidate: true })}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                selectedCategory === cat
                  ? 'border-[#009C3B] bg-[#009C3B]/5 text-[#009C3B]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {LISTING_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Estado del artículo <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LISTING_CONDITIONS.map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => setValue('condition', cond, { shouldValidate: true })}
              className={cn(
                'py-3 px-4 rounded-xl border text-sm font-medium transition-all',
                selectedCondition === cond
                  ? 'border-[#009C3B] bg-[#009C3B]/5 text-[#009C3B]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {LISTING_CONDITION_LABELS[cond]}
            </button>
          ))}
        </div>
        {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
      </div>

      {/* Price */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Precio (€) <span className="text-gray-400 font-normal">— deja vacío si es gratis</span>
          </label>
          <input
            {...register('price')}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B]"
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                {...register('price_negotiable')}
                className="sr-only peer"
              />
              <div className={cn(
                'w-11 h-6 rounded-full border-2 transition-all',
                isNegotiable ? 'bg-[#009C3B] border-[#009C3B]' : 'bg-gray-100 border-gray-300'
              )} />
              <div className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                isNegotiable ? 'translate-x-5' : 'translate-x-0'
              )} />
            </div>
            <span className="text-sm font-medium text-gray-700">Precio negociable</span>
          </label>
        </div>
      </div>

      {/* City + WhatsApp */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
          <select
            {...register('city')}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B] bg-white"
          >
            {CITIES_BY_PROVINCE.map(({ region, cities }) => (
              <optgroup key={region} label={region}>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WhatsApp <span className="text-gray-400 font-normal">— opcional</span>
          </label>
          <input
            {...register('whatsapp')}
            type="tel"
            placeholder="+34 600 000 000"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009C3B]/20 focus:border-[#009C3B]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold text-base"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publicando...</>
        ) : (
          'Publicar anuncio'
        )}
      </Button>
    </form>
  )
}

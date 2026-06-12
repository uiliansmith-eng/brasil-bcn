'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createEventAction } from '@/actions/events'
import { createEventSchema, type CreateEventInput } from '@/lib/validations/events'
import { EVENT_CATEGORY_LABELS, CITIES_BY_PROVINCE } from '@/lib/constants'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.entries(EVENT_CATEGORY_LABELS) as [string, string][]

export function PublishEventForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      city: 'Barcelona',
      price_visible: true,
    },
  })

  const selectedCategory = watch('category')
  const priceVisible = watch('price_visible')

  const onSubmit = async (data: CreateEventInput) => {
    setServerError(null)
    try {
      const result = await createEventAction({ ...data, image_url: imageUrl ?? undefined })
      if (result && 'error' in result) { setServerError(result.error); return }
      if (result && 'ok' in result) router.push(result.redirectTo)
    } catch (e) {
      setServerError('Error inesperado. Por favor recarga la página e inténtalo de nuevo.')
      console.error('[PublishEventForm] unexpected error:', e)
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

      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Información del evento</h2>
        <div className="space-y-5">

          <ImageUpload
            bucket="events"
            value={imageUrl}
            onChange={setImageUrl}
            label="Imagen del evento"
            hint="Recomendado: formato apaisado, mínimo 800×400px"
            aspectRatio="wide"
          />

          <FormField
            label="Nombre del evento *"
            placeholder="Ej: Festa Junina Barcelona 2025"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Descripción *
            </Label>
            <Textarea
              placeholder="Describe el evento: qué ocurrirá, quién puede venir, qué incluye... (mínimo 30 caracteres)"
              rows={5}
              className={cn(
                'rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none',
                errors.description && 'border-red-400'
              )}
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Tipo de evento *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('category', value as CreateEventInput['category'])}
                  className={cn(
                    'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
                    selectedCategory === value
                      ? 'bg-[#009C3B] text-white border-[#009C3B]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#009C3B]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>
        </div>
      </section>

      {/* Date & Location */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Fecha y lugar</h2>
        <div className="space-y-5">

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Fecha y hora de inicio *"
              type="datetime-local"
              error={errors.date_start?.message}
              {...register('date_start')}
            />
            <FormField
              label="Fecha y hora de fin (opcional)"
              type="datetime-local"
              error={errors.date_end?.message}
              {...register('date_end')}
            />
          </div>

          <FormField
            label="Nombre del lugar *"
            placeholder="Ej: Sala Apolo, Parc de la Ciutadella..."
            error={errors.location?.message}
            {...register('location')}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Dirección"
              placeholder="Ej: Carrer Nou de la Rambla, 113"
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Ciudad</Label>
              <select
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20 transition-colors"
                {...register('city')}
              >
                {CITIES_BY_PROVINCE.map(({ region, cities }) => (
                  <optgroup key={region} label={region}>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets & Price */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Entradas y precio</h2>
        <div className="space-y-5">

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="price_visible"
                checked={priceVisible}
                onCheckedChange={(v) => setValue('price_visible', v === true)}
              />
              <label htmlFor="price_visible" className="text-sm font-medium text-gray-700 cursor-pointer">
                Evento con precio de entrada
              </label>
            </div>

            {priceVisible && (
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  label="Precio (€)"
                  type="number"
                  placeholder="0 para gratis"
                  hint="Pon 0 si es gratuito"
                  error={errors.price?.message}
                  {...register('price')}
                />
                <FormField
                  label="Aforo máximo (opcional)"
                  type="number"
                  placeholder="Ej: 200"
                  error={errors.capacity?.message}
                  {...register('capacity')}
                />
              </div>
            )}
          </div>

          <FormField
            label="URL de entradas (opcional)"
            type="url"
            placeholder="https://entradas.com/mi-evento"
            hint="Enlace externo donde comprar entradas"
            error={errors.url?.message}
            {...register('url')}
          />
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-2">Contacto (opcional)</h2>
        <p className="text-gray-500 text-sm mb-6">Para que los asistentes puedan contactar con el organizador.</p>
        <FormField
          label="WhatsApp"
          type="tel"
          placeholder="+34 600 000 000"
          hint="Con prefijo internacional"
          error={errors.whatsapp?.message}
          {...register('whatsapp')}
        />
      </section>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Tu evento será revisado por el equipo de BrasilBCN antes de publicarse. Normalmente tardamos menos de 24h.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold text-base rounded-xl"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publicando...</>
        ) : (
          'Publicar evento'
        )}
      </Button>
    </form>
  )
}

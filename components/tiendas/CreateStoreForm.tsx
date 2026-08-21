'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createStoreAction } from '@/actions/stores'
import { createStoreSchema, type CreateStoreInput } from '@/lib/validations/stores'
import { COMPANY_CATEGORY_LABELS, CITIES_BY_PROVINCE } from '@/lib/constants'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.entries(COMPANY_CATEGORY_LABELS) as [string, string][]
const LANGUAGES: [string, string][] = [['pt', 'Português'], ['es', 'Español'], ['en', 'English']]

export function CreateStoreForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { city: 'Barcelona', language: 'pt' },
  })

  const selectedCategory = watch('category')
  const selectedLanguage = watch('language')

  const onSubmit = async (data: CreateStoreInput) => {
    setServerError(null)
    try {
      const result = await createStoreAction({ ...data, logo_url: logoUrl ?? undefined })
      if ('error' in result) { setServerError(result.error); return }
      router.push(`/tiendas/${result.slug}?creada=true`)
    } catch (e) {
      setServerError('Error inesperado. Por favor recarga la página e inténtalo de nuevo.')
      console.error('[CreateStoreForm] unexpected error:', e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {serverError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex gap-3">
          <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
          <div>
            <p className="font-semibold text-red-700 text-sm">Error al crear la tienda</p>
            <p className="text-red-600 text-sm mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Información del negocio</h2>
        <div className="space-y-5">

          <ImageUpload
            bucket="companies"
            value={logoUrl}
            onChange={setLogoUrl}
            label="Logo"
            hint="Recomendado: imagen cuadrada, mínimo 200×200px"
            aspectRatio="square"
          />

          <FormField
            label="Nombre del negocio *"
            placeholder="Ej: Barbearia do Zé"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Descripción *</Label>
            <Textarea
              placeholder="Describe tu negocio: qué ofreces, tu historia, especialidades... (mínimo 20 caracteres)"
              rows={5}
              className={cn(
                'rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none',
                errors.description && 'border-red-400'
              )}
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Categoría *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('category', value as CreateStoreInput['category'])}
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
            <p className="text-xs text-gray-400">La categoría define si tu tienda muestra &quot;Menú&quot;, &quot;Servicios&quot; o &quot;Catálogo&quot;.</p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Ubicación y horario</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Dirección"
              placeholder="Ej: Carrer de Balmes, 123"
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
          <FormField
            label="Horario"
            placeholder="Ej: Seg-Sex 9h-20h, Sáb 10h-14h"
            error={errors.business_hours?.message}
            {...register('business_hours')}
          />
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-2">Contacto</h2>
        <p className="text-gray-500 text-sm mb-6">Añade al menos una forma de contacto para que los clientes puedan encontrarte.</p>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="WhatsApp"
              type="tel"
              placeholder="+34 600 000 000"
              hint="Con prefijo internacional"
              error={errors.whatsapp?.message}
              {...register('whatsapp')}
            />
            <FormField
              label="Teléfono"
              type="tel"
              placeholder="+34 930 000 000"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Email"
              type="email"
              placeholder="info@tunegocio.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <FormField
              label="Instagram"
              placeholder="@tunegocio"
              error={errors.instagram?.message}
              {...register('instagram')}
            />
          </div>
          <FormField
            label="Sitio web"
            type="url"
            placeholder="https://tunegocio.com"
            error={errors.website?.message}
            {...register('website')}
          />
        </div>
      </section>

      {/* Extra */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Detalles adicionales</h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Idioma principal</Label>
            <div className="flex gap-2">
              {LANGUAGES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('language', value as CreateStoreInput['language'])}
                  className={cn(
                    'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
                    selectedLanguage === value
                      ? 'bg-[#002776] text-white border-[#002776]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#002776]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Información adicional</Label>
            <Textarea
              placeholder="Cualquier otra info útil: formas de pago, parking, si hace falta cita previa..."
              rows={3}
              className="rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none"
              {...register('extra_info')}
            />
          </div>
        </div>
      </section>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Tu tienda será revisada por el equipo de Brasil BCN antes de publicarse. Normalmente tardamos menos de 24h.
          Después podrás añadir productos, servicios y cupones desde tu panel.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold text-base rounded-xl"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creando tienda...</>
        ) : (
          'Crear mi tienda'
        )}
      </Button>
    </form>
  )
}

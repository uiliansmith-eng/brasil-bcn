'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Store, MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StoreCategoryPicker } from '@/components/tiendas/StoreCategoryPicker'
import { activateStoreAction } from '@/actions/stores'
import { activateStoreSchema, type ActivateStoreInput } from '@/lib/validations/stores'
import { cn } from '@/lib/utils'

const LANGUAGES: [string, string][] = [['pt', 'Português'], ['es', 'Español'], ['en', 'English']]

interface ActivateStoreFormProps {
  companyId: string
  companyName: string
  companySlug: string
  mode?: 'activate' | 'edit'
  defaultValues?: Partial<ActivateStoreInput>
  onSaved?: () => void
}

export function ActivateStoreForm({ companyId, companyName, companySlug, mode = 'activate', defaultValues, onSaved }: ActivateStoreFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivateStoreInput>({
    resolver: zodResolver(activateStoreSchema),
    defaultValues: { language: 'pt', ...defaultValues },
  })

  const selectedLanguage = watch('language')
  const selectedStoreCategoryId = watch('store_category_id')
  const selectedStoreSubcategoryId = watch('store_subcategory_id')

  const onSubmit = async (data: ActivateStoreInput) => {
    setServerError(null)
    const result = await activateStoreAction(companyId, data)
    if ('error' in result) { setServerError(result.error); return }
    if (mode === 'edit') { onSaved?.(); return }
    router.push(`/tiendas/${companySlug}?creada=true`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {mode === 'activate' && (
        <div className="bg-[#009C3B]/5 border border-[#009C3B]/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#009C3B]/10 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-[#009C3B]" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{companyName}</p>
            <p className="text-gray-500 text-sm">Vamos a activar la tienda sobre tu empresa ya registrada.</p>
          </div>
        </div>
      )}

      {serverError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
        <StoreCategoryPicker
          categoryId={selectedStoreCategoryId}
          subcategoryId={selectedStoreSubcategoryId}
          onChange={(catId, subId) => {
            setValue('store_category_id', catId)
            setValue('store_subcategory_id', subId)
          }}
        />
        <FormField
          label="Instagram"
          placeholder="@tunegocio"
          error={errors.instagram?.message}
          {...register('instagram')}
        />
        <FormField
          label="Horario"
          placeholder="Ej: Seg-Sex 9h-20h, Sáb 10h-14h"
          error={errors.business_hours?.message}
          {...register('business_hours')}
        />
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Idioma principal</Label>
          <div className="flex gap-2">
            {LANGUAGES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('language', value as ActivateStoreInput['language'])}
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
            placeholder="Formas de pago, parking, si hace falta cita previa..."
            rows={3}
            className="rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none"
            {...register('extra_info')}
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-50">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Coordenadas (opcional)
          </Label>
          <p className="text-xs text-gray-400">
            Buscá tu dirección en{' '}
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-[#009C3B] font-medium inline-flex items-center gap-0.5">
              Google Maps <ExternalLink className="w-3 h-3" />
            </a>
            , hacé clic derecho sobre el marcador y copiá las coordenadas.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Latitud" type="number" step="any" placeholder="41.3874" error={errors.latitude?.message} {...register('latitude')} />
            <FormField label="Longitud" type="number" step="any" placeholder="2.1686" error={errors.longitude?.message} {...register('longitude')} />
          </div>
        </div>
      </section>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold text-base rounded-xl"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Guardando...</>
        ) : mode === 'edit' ? (
          'Guardar cambios'
        ) : (
          'Activar mi tienda'
        )}
      </Button>
    </form>
  )
}

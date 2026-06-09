'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createAdAction } from '@/actions/advertisements'
import { createAdSchema, type CreateAdInput } from '@/lib/validations/advertisements'
import { cn } from '@/lib/utils'

const POSITIONS = [
  { value: 'home_hero', label: 'Inicio — Hero', description: 'Banner entre Hero y Stats en la portada' },
  { value: 'jobs_top', label: 'Empleos — Top', description: 'Encima del grid de empleos' },
  { value: 'companies_top', label: 'Empresas — Top', description: 'Encima del grid de empresas' },
  { value: 'sidebar', label: 'Sidebar', description: 'Panel lateral en páginas de detalle' },
  { value: 'footer', label: 'Footer', description: 'Zona inferior del sitio' },
] as const

export function CreateAdForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdInput>({
    resolver: zodResolver(createAdSchema),
  })

  const selectedPosition = watch('position')

  const onSubmit = async (data: CreateAdInput) => {
    setServerError(null)
    const result = await createAdAction(data)
    if ('error' in result) {
      setServerError(result.error)
    } else {
      router.push('/admin/publicidad')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Content */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-black text-gray-900 text-base mb-5">Contenido del anuncio</h2>
        <div className="space-y-4">
          <FormField
            label="Título *"
            placeholder="Ej: Restaurante Sabor do Brasil — 20% descuento"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Descripción (opcional)</Label>
            <Textarea
              placeholder="Texto breve que acompaña al anuncio — máx 200 caracteres"
              rows={2}
              className="rounded-xl border-gray-200 focus:border-[#002776] focus:ring-[#002776]/20 resize-none"
              {...register('description')}
            />
          </div>
          <FormField
            label="URL de imagen *"
            type="url"
            placeholder="https://..."
            hint="Imagen del anunciante (logo o banner)"
            error={errors.image_url?.message}
            {...register('image_url')}
          />
          <FormField
            label="URL de destino *"
            type="url"
            placeholder="https://..."
            hint="Página a la que se dirige al hacer clic"
            error={errors.url?.message}
            {...register('url')}
          />
        </div>
      </section>

      {/* Position */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-black text-gray-900 text-base mb-4">Posición *</h2>
        <div className="space-y-2">
          {POSITIONS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('position', value)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                selectedPosition === value
                  ? 'border-[#002776] bg-[#002776]/5'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border-2 shrink-0',
                selectedPosition === value ? 'border-[#002776] bg-[#002776]' : 'border-gray-300'
              )} />
              <div>
                <p className={cn('text-sm font-semibold', selectedPosition === value ? 'text-[#002776]' : 'text-gray-900')}>
                  {label}
                </p>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
            </button>
          ))}
        </div>
        {errors.position && <p className="text-sm text-red-500 mt-2">{errors.position.message}</p>}
      </section>

      {/* Dates */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-black text-gray-900 text-base mb-5">Período de publicación</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Fecha de inicio *"
            type="datetime-local"
            error={errors.starts_at?.message}
            {...register('starts_at')}
          />
          <FormField
            label="Fecha de fin *"
            type="datetime-local"
            error={errors.ends_at?.message}
            {...register('ends_at')}
          />
        </div>
      </section>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#002776] hover:bg-[#001a5c] text-white font-bold text-base rounded-xl"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Guardando...</>
        ) : (
          'Crear anuncio'
        )}
      </Button>
    </form>
  )
}

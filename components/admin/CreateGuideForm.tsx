'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createGuideAction } from '@/actions/admin'
import { createGuideSchema, type CreateGuideInput } from '@/lib/validations/guides'
import { GUIDE_CATEGORY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.entries(GUIDE_CATEGORY_LABELS) as [string, string][]

export function CreateGuideForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateGuideInput>({
    resolver: zodResolver(createGuideSchema),
    defaultValues: { is_published: false },
  })

  const selectedCategory = watch('category')
  const isPublished = watch('is_published')

  const onSubmit = async (data: CreateGuideInput) => {
    setServerError(null)
    const result = await createGuideAction(data)
    if ('error' in result) {
      setServerError(result.error)
    } else {
      router.push('/admin/guias')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Title & excerpt */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-black text-gray-900 text-base mb-5">Contenido</h2>
        <div className="space-y-4">

          <FormField
            label="Título *"
            placeholder="Ej: Cómo obtener el NIE en Barcelona"
            error={errors.title?.message}
            {...register('title')}
          />

          <FormField
            label="Resumen (excerpt)"
            placeholder="Breve descripción que aparece en la tarjeta — máx 300 caracteres"
            error={errors.excerpt?.message}
            {...register('excerpt')}
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Contenido * <span className="text-gray-400 font-normal">(mínimo 100 caracteres)</span>
            </Label>
            <Textarea
              placeholder="Escribe el contenido de la guía. Separa los párrafos con líneas en blanco..."
              rows={16}
              className={cn(
                'rounded-xl border-gray-200 focus:border-[#002776] focus:ring-[#002776]/20 resize-none font-mono text-sm',
                errors.content && 'border-red-400'
              )}
              {...register('content')}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>
        </div>
      </section>

      {/* Category */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-black text-gray-900 text-base mb-4">Categoría *</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('category', value as CreateGuideInput['category'])}
              className={cn(
                'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
                selectedCategory === value
                  ? 'bg-[#002776] text-white border-[#002776]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#002776]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-sm text-red-500 mt-2">{errors.category.message}</p>}
      </section>

      {/* Cover & publish */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-black text-gray-900 text-base mb-5">Opciones</h2>
        <div className="space-y-4">
          <FormField
            label="URL de imagen de portada"
            type="url"
            placeholder="https://..."
            hint="Imagen que aparece en la tarjeta y en la cabecera del artículo"
            error={errors.cover_url?.message}
            {...register('cover_url')}
          />
          <div className="flex items-center gap-3 p-4 bg-[#002776]/5 rounded-xl border border-[#002776]/10">
            <Checkbox
              id="is_published"
              checked={isPublished}
              onCheckedChange={(v) => setValue('is_published', v === true)}
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700 cursor-pointer">
              Publicar inmediatamente
              <span className="block text-xs text-gray-400 font-normal">Si no se activa, se guardará como borrador</span>
            </label>
          </div>
        </div>
      </section>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 bg-[#002776] hover:bg-[#001a5c] text-white font-bold text-base rounded-xl"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Guardando...</>
          ) : (
            isPublished ? 'Publicar guía' : 'Guardar borrador'
          )}
        </Button>
      </div>
    </form>
  )
}

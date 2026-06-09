'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createJobAction } from '@/actions/jobs'
import { createJobSchema, type CreateJobInput } from '@/lib/validations/jobs'
import { JOB_CATEGORY_LABELS, JOB_TYPE_LABELS, CITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.entries(JOB_CATEGORY_LABELS) as [string, string][]
const TYPES = Object.entries(JOB_TYPE_LABELS) as [string, string][]

export function PublishJobForm() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      city: 'Barcelona',
      job_type: 'full_time',
      salary_visible: true,
      is_urgent: false,
    },
  })

  const salaryVisible = watch('salary_visible')
  const selectedCategory = watch('category')
  const selectedType = watch('job_type')

  const onSubmit = async (data: CreateJobInput) => {
    setServerError(null)
    const result = await createJobAction(data)
    if (result && 'error' in result) setServerError(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Información básica</h2>
        <div className="space-y-5">

          <FormField
            label="Título del puesto *"
            placeholder="Ej: Camarero/a con experiencia"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Descripción del puesto *
            </Label>
            <Textarea
              placeholder="Describe las responsabilidades, el ambiente de trabajo, horario... (mínimo 50 caracteres)"
              rows={6}
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
            <Label className="text-sm font-medium text-gray-700">Categoría *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('category', value as CreateJobInput['category'])}
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

          {/* Job type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Tipo de jornada *</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('job_type', value as CreateJobInput['job_type'])}
                  className={cn(
                    'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
                    selectedType === value
                      ? 'bg-[#002776] text-white border-[#002776]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#002776]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location & Salary */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Ubicación y salario</h2>
        <div className="space-y-5">

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Barrio / Zona"
              placeholder="Ej: Eixample, Gràcia..."
              error={errors.location?.message}
              {...register('location')}
            />
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Ciudad</Label>
              <select
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20 transition-colors"
                {...register('city')}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="salary_visible"
                checked={salaryVisible}
                onCheckedChange={(v) => setValue('salary_visible', v === true)}
              />
              <label htmlFor="salary_visible" className="text-sm font-medium text-gray-700 cursor-pointer">
                Mostrar salario en la oferta
              </label>
            </div>

            {salaryVisible && (
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  label="Salario mínimo (€/mes)"
                  type="number"
                  placeholder="1.200"
                  error={errors.salary_min?.message}
                  {...register('salary_min')}
                />
                <FormField
                  label="Salario máximo (€/mes)"
                  type="number"
                  placeholder="1.600"
                  error={errors.salary_max?.message}
                  {...register('salary_max')}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-2">Contacto</h2>
        <p className="text-gray-500 text-sm mb-6">Al menos uno de los dos es requerido para que los candidatos puedan contactarte.</p>
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
            label="Email de contacto"
            type="email"
            placeholder="empresa@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
      </section>

      {/* Extra details */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Detalles adicionales (opcional)</h2>
        <div className="space-y-5">

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Requisitos</Label>
            <Textarea
              placeholder="Experiencia requerida, idiomas, documentación..."
              rows={4}
              className="rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none"
              {...register('requirements')}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">¿Qué ofrecéis?</Label>
            <Textarea
              placeholder="Beneficios, horario flexible, formación..."
              rows={3}
              className="rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 resize-none"
              {...register('benefits')}
            />
          </div>

          {/* Urgent */}
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <Checkbox
              id="is_urgent"
              onCheckedChange={(v) => setValue('is_urgent', v === true)}
            />
            <div>
              <label htmlFor="is_urgent" className="text-sm font-semibold text-red-700 cursor-pointer">
                Marcar como urgente
              </label>
              <p className="text-xs text-red-500">Tu oferta aparecerá destacada en la parte superior</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Tu oferta será revisada por el equipo de BrasilBCN antes de publicarse. Normalmente tardamos menos de 24h.
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold text-base rounded-xl"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publicando...</>
        ) : (
          'Publicar oferta de empleo'
        )}
      </Button>
    </form>
  )
}

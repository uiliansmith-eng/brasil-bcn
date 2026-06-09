'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCompanyAction } from '@/actions/companies'
import { createCompanySchema, type CreateCompanyInput } from '@/lib/validations/companies'
import { COMPANY_CATEGORY_LABELS, CITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.entries(COMPANY_CATEGORY_LABELS) as [string, string][]

export function RegisterCompanyForm() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      city: 'Barcelona',
    },
  })

  const selectedCategory = watch('category')

  const onSubmit = async (data: CreateCompanyInput) => {
    setServerError(null)
    const result = await createCompanyAction(data)
    if (result && 'error' in result) setServerError(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Información básica</h2>
        <div className="space-y-5">

          <FormField
            label="Nombre de la empresa *"
            placeholder="Ej: Restaurante Sabor do Brasil"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Descripción *
            </Label>
            <Textarea
              placeholder="Describe tu empresa: qué ofreces, tu historia, especialidades... (mínimo 20 caracteres)"
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
            <Label className="text-sm font-medium text-gray-700">Sector *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('category', value as CreateCompanyInput['category'])}
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

      {/* Location */}
      <section className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="font-black text-gray-900 text-lg mb-6">Ubicación</h2>
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
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
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
              placeholder="info@tuempresa.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <FormField
              label="Sitio web"
              type="url"
              placeholder="https://tuempresa.com"
              error={errors.website?.message}
              {...register('website')}
            />
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Tu empresa será revisada por el equipo de BrasilBCN antes de publicarse. Normalmente tardamos menos de 24h.
          Podrás añadir logo, fotos y más detalles desde tu panel después de la aprobación.
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
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Registrando...</>
        ) : (
          'Registrar empresa'
        )}
      </Button>
    </form>
  )
}

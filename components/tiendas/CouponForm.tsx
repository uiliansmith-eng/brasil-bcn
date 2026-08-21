'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { createCouponAction } from '@/actions/stores'
import { couponSchema, type CouponInput } from '@/lib/validations/stores'
import { cn } from '@/lib/utils'

interface CouponFormProps {
  companyId: string
  onDone: () => void
}

export function CouponForm({ companyId, onDone }: CouponFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
    defaultValues: { discount_type: 'percentage', is_active: true },
  })

  const discountType = watch('discount_type')

  const onSubmit = async (data: CouponInput) => {
    setServerError(null)
    const result = await createCouponAction(companyId, data)
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

      <FormField
        label="Nombre del cupón *"
        placeholder="Ej: Descuento de bienvenida"
        error={errors.title?.message}
        {...register('title')}
      />

      <FormField
        label="Código *"
        placeholder="Ej: BRASIL10"
        hint="Se guarda en mayúsculas"
        error={errors.code?.message}
        {...register('code')}
      />

      <div className="flex gap-2">
        {(['percentage', 'fixed'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setValue('discount_type', type)}
            className={cn(
              'text-sm font-medium px-4 py-2 rounded-xl border transition-all',
              discountType === type
                ? 'bg-[#009C3B] text-white border-[#009C3B]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#009C3B]'
            )}
          >
            {type === 'percentage' ? '% Porcentaje' : '€ Fijo'}
          </button>
        ))}
      </div>

      <FormField
        label={discountType === 'percentage' ? 'Porcentaje de descuento *' : 'Descuento fijo (€) *'}
        type="number"
        step="0.01"
        placeholder={discountType === 'percentage' ? '10' : '5'}
        error={errors.discount_value?.message}
        {...register('discount_value')}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Desde"
          type="date"
          error={errors.starts_at?.message}
          {...register('starts_at')}
        />
        <FormField
          label="Hasta"
          type="date"
          error={errors.ends_at?.message}
          {...register('ends_at')}
        />
      </div>

      <FormField
        label="Usos máximos"
        type="number"
        placeholder="Sin límite si lo dejas vacío"
        error={errors.max_uses?.message}
        {...register('max_uses')}
      />

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-10 bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear cupón'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

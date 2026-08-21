'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getAvailableSlots, createReservationAction } from '@/actions/reservations'
import { reservationSchema, type ReservationInput } from '@/lib/validations/reservations'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  companyId: string
  storeSlug: string
  storeItemId: string
  itemName: string
  onClose: () => void
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function BookingForm({ companyId, storeSlug, storeItemId, itemName, onClose }: BookingFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { date: todayStr() },
  })

  const date = watch('date')
  const startTime = watch('start_time')

  useEffect(() => {
    if (!date) return
    setLoadingSlots(true)
    setValue('start_time', '')
    getAvailableSlots(companyId, storeItemId, date).then((data) => {
      setSlots(data)
      setLoadingSlots(false)
    })
  }, [date, companyId, storeItemId, setValue])

  const onSubmit = async (data: ReservationInput) => {
    setServerError(null)
    const result = await createReservationAction(companyId, storeItemId, data)
    if ('error' in result) { setServerError(result.error); return }
    router.push(`/tiendas/${storeSlug}/reserva/${result.reservationId}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900 text-lg">Reservar {itemName}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Fecha</Label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                min={todayStr()}
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20"
                {...register('date')}
              />
            </div>
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Horario disponible</Label>
            {loadingSlots ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-3">
                <Loader2 className="w-4 h-4 animate-spin" /> Buscando horarios...
              </div>
            ) : slots.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">No hay horarios disponibles ese día.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setValue('start_time', slot)}
                    className={cn(
                      'text-sm font-medium px-3 py-1.5 rounded-lg border transition-all',
                      startTime === slot ? 'bg-[#009C3B] text-white border-[#009C3B]' : 'bg-white text-gray-600 border-gray-200'
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
            {errors.start_time && <p className="text-sm text-red-500">{errors.start_time.message}</p>}
          </div>

          <FormField label="Nombre *" placeholder="Tu nombre" error={errors.customer_name?.message} {...register('customer_name')} />
          <FormField label="Teléfono *" type="tel" placeholder="+34 600 000 000" error={errors.customer_phone?.message} {...register('customer_phone')} />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Notas (opcional)</Label>
            <Textarea rows={2} className="rounded-xl border-gray-200 resize-none" {...register('notes')} />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !startTime}
            className="w-full h-12 bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold rounded-xl"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar reserva'}
          </Button>
        </form>
      </div>
    </div>
  )
}

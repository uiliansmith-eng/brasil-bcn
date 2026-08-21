'use client'

import { useTransition } from 'react'
import { Loader2, CalendarClock } from 'lucide-react'
import { updateReservationStatusAction } from '@/actions/reservations'
import { RESERVATION_STATUS_LABELS } from '@/lib/constants'
import type { Reservation, ReservationStatus } from '@/types'

const STATUS_FLOW: ReservationStatus[] = ['pending', 'confirmed', 'completed']

interface StoreReservationsManagerProps {
  reservations: (Reservation & { item: { name: string } | null })[]
}

export function StoreReservationsManager({ reservations }: StoreReservationsManagerProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    const formData = new FormData()
    formData.set('id', id)
    formData.set('status', status)
    startTransition(() => { updateReservationStatusAction(formData) })
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <CalendarClock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Todavía no recibiste reservas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold text-gray-900">{reservation.item?.name ?? 'Servicio'}</p>
              <p className="text-xs text-gray-400">
                {reservation.date} · {reservation.start_time} · {reservation.customer_name} · {reservation.customer_phone}
              </p>
            </div>
          </div>

          {reservation.notes && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 mb-4">{reservation.notes}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {reservation.status === 'cancelled' || reservation.status === 'no_show' ? (
              <span className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg">
                {RESERVATION_STATUS_LABELS[reservation.status]}
              </span>
            ) : (
              <>
                {STATUS_FLOW.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(reservation.id, status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      reservation.status === status
                        ? 'bg-[#009C3B] text-white border-[#009C3B]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#009C3B]'
                    }`}
                  >
                    {RESERVATION_STATUS_LABELS[status]}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(reservation.id, 'no_show')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-100 text-amber-600 hover:bg-amber-50"
                >
                  No se presentó
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                >
                  Cancelar
                </button>
              </>
            )}
            {isPending && <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
          </div>
        </div>
      ))}
    </div>
  )
}

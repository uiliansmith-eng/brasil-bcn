import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarClock, Store } from 'lucide-react'
import { getMyReservations, cancelReservationAction } from '@/actions/reservations'
import { RESERVATION_STATUS_LABELS } from '@/lib/constants'
import type { ReservationStatus } from '@/types'

export const metadata: Metadata = { title: 'Mis reservas — Brasil BCN' }

export default async function MisReservasPage() {
  const reservations = await getMyReservations()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-8">Mis reservas</h1>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <CalendarClock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Todavía no hiciste ninguna reserva</p>
          <p className="text-gray-400 text-sm">Explora los servicios de las tiendas de Brasil BCN.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => {
            const company = reservation.company as { name: string; slug: string } | null
            const item = reservation.item as { name: string } | null
            const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed'
            return (
              <div key={reservation.id} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5">
                <div className="w-10 h-10 rounded-xl bg-[#002776]/10 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-[#002776]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item?.name ?? 'Servicio'} · {company?.name}</p>
                  <p className="text-xs text-gray-400">{reservation.date} · {reservation.start_time}</p>
                </div>
                <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full shrink-0">
                  {RESERVATION_STATUS_LABELS[reservation.status as ReservationStatus]}
                </span>
                {canCancel && (
                  <form action={cancelReservationAction}>
                    <input type="hidden" name="id" value={reservation.id} />
                    <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 px-2.5 py-1.5 rounded-lg shrink-0">
                      Cancelar
                    </button>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

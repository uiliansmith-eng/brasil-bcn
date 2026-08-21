import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getReservationById } from '@/actions/reservations'
import { RESERVATION_STATUS_LABELS } from '@/lib/constants'
import type { ReservationStatus } from '@/types'

export const metadata: Metadata = { title: 'Reserva confirmada — Brasil BCN' }

interface PageProps {
  params: Promise<{ slug: string; reservationId: string }>
}

export default async function ReservationConfirmationPage({ params }: PageProps) {
  const { slug, reservationId } = await params
  const reservation = await getReservationById(reservationId)
  if (!reservation) notFound()

  const company = reservation.company as { name: string; slug: string; logo_url: string | null; whatsapp: string | null } | null
  const item = reservation.item as { name: string } | null
  const whatsappUrl = company?.whatsapp
    ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Acabo de reservar ${item?.name ?? 'un servicio'} en Brasil BCN para el ${reservation.date}.`)}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/tiendas/${slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a la tienda
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#009C3B] mx-auto mb-3" />
          <h1 className="text-xl font-black text-gray-900 mb-1">¡Reserva confirmada!</h1>
          <p className="text-gray-500 text-sm">{company?.name} recibió tu solicitud de reserva.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">{item?.name ?? 'Servicio'}</h2>
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
              {RESERVATION_STATUS_LABELS[reservation.status as ReservationStatus]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> {reservation.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {reservation.start_time}</span>
          </div>
        </div>

        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold gap-2 h-12">
              <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

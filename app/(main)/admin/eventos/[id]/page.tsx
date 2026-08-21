import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin, Calendar, Clock, Ticket, Globe, MessageCircle, ExternalLink } from 'lucide-react'
import { getEventForAdmin, approveEventAction, rejectEventAction } from '@/actions/admin'
import { EVENT_CATEGORY_LABELS } from '@/lib/constants'
import type { EventCategory } from '@/types'

export const metadata: Metadata = { title: 'Revisar evento — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export default async function AdminEventDetailPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEventForAdmin(id)
  if (!event) notFound()

  const catLabel = EVENT_CATEGORY_LABELS[event.category as EventCategory] ?? event.category
  const isFree = event.is_free || !event.price || event.price === 0
  const priceLabel = isFree ? 'Gratis' : event.price_visible ? `${event.price}€` : 'Precio a consultar'
  const organizer = event.organizer as { full_name?: string; email?: string } | null

  const whatsappUrl = event.whatsapp
    ? `https://wa.me/${event.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Vi tu evento "${event.title}" en BrasilBCN.`)}`
    : null

  return (
    <div className="space-y-6">
      <Link
        href="/admin/eventos"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a pendientes
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-56 bg-gradient-to-br from-[#002776]/10 to-[#009C3B]/10 flex items-center justify-center relative">
          {event.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <CalendarDays className="w-16 h-16 text-[#002776]/20" />
          )}
          <div className={`absolute top-4 right-4 text-sm font-bold px-3 py-1.5 rounded-full ${isFree ? 'bg-[#009C3B] text-white' : 'bg-white text-gray-900 shadow'}`}>
            {priceLabel}
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-semibold bg-[#002776]/10 text-[#002776] px-3 py-1.5 rounded-full">
              {catLabel}
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-1">{event.title}</h1>
          {organizer?.full_name && (
            <p className="text-gray-600 font-medium mb-5">
              por {organizer.full_name}{organizer.email && ` (${organizer.email})`}
            </p>
          )}

          {/* Key info grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6 p-5 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#009C3B] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Fecha</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{formatDate(event.date_start)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#009C3B] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Hora</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatTime(event.date_start)}
                  {event.date_end && ` — ${formatTime(event.date_end)}`}
                </p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#009C3B] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Lugar</p>
                  <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                  {event.address && <p className="text-xs text-gray-400">{event.address}</p>}
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Ticket className="w-4 h-4 text-[#009C3B] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Entrada</p>
                <p className="text-sm font-semibold text-gray-900">{priceLabel}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">
            {event.description}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {event.url && (
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#009C3B] hover:underline">
                <ExternalLink className="w-4 h-4" /> Enlace del evento
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:underline">
                <MessageCircle className="w-4 h-4" /> {event.whatsapp}
              </a>
            )}
            {event.url && (
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:underline">
                <Globe className="w-4 h-4" /> Web
              </a>
            )}
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
            <form action={approveEventAction}>
              <input type="hidden" name="id" value={event.id} />
              <button type="submit" className="px-5 py-2 text-sm font-semibold bg-[#009C3B] hover:bg-[#007a2f] text-white rounded-lg transition-colors">
                Aprobar evento
              </button>
            </form>
            <form action={rejectEventAction}>
              <input type="hidden" name="id" value={event.id} />
              <button type="submit" className="px-5 py-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                Rechazar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Clock, Users, Ticket, Globe, MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getEventBySlug } from '@/actions/events'
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_EMOJI } from '@/lib/constants'
import type { EventCategory } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Evento no encontrado' }

  return {
    title: `${event.title} — BrasilBCN`,
    description: event.description.slice(0, 160),
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const catLabel = EVENT_CATEGORY_LABELS[event.category as EventCategory] ?? event.category
  const catEmoji = EVENT_CATEGORY_EMOJI[event.category as EventCategory] ?? '📅'

  const isPast = new Date(event.date_start) < new Date()
  const isFree = event.is_free || !event.price || event.price === 0
  const priceLabel = isFree ? 'Gratis' : event.price_visible ? `${event.price}€` : 'Precio a consultar'

  const whatsappUrl = event.whatsapp
    ? `https://wa.me/${event.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Vi tu evento "${event.title}" en BrasilBCN.`)}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/eventos" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a eventos
        </Link>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* Main */}
          <div className="space-y-6">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Cover */}
              <div className="h-56 bg-gradient-to-br from-[#002776]/10 to-[#009C3B]/10 flex items-center justify-center relative">
                {event.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl opacity-40">{catEmoji}</span>
                )}
                {isPast && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">Evento pasado</span>
                  </div>
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

                <h1 className="text-2xl font-black text-gray-900 mb-5">{event.title}</h1>

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

                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-black text-gray-900 text-lg mb-5">Asistir</h3>

              <div className="space-y-3 mb-5">
                {event.url && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#009C3B] hover:bg-[#007a2f] text-white font-semibold gap-2">
                      <ExternalLink className="w-4 h-4" /> Comprar entradas
                    </Button>
                  </a>
                )}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 border-gray-200 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                  </a>
                )}
                {event.url && !whatsappUrl && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Globe className="w-4 h-4" /> Más info
                    </Button>
                  </a>
                )}
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-2">
                {event.capacity && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{event.attendees} / {event.capacity} asistentes</span>
                  </div>
                )}
                <p className="text-gray-400 text-xs">{event.views ?? 0} visualizaciones</p>
                <p className="text-gray-400 text-xs capitalize">{event.city}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            description: event.description,
            startDate: event.date_start,
            endDate: event.date_end,
            location: {
              '@type': 'Place',
              name: event.location,
              address: {
                '@type': 'PostalAddress',
                streetAddress: event.address,
                addressLocality: event.city,
                addressCountry: 'ES',
              },
            },
            offers: {
              '@type': 'Offer',
              price: event.price ?? 0,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: event.url,
            },
            organizer: {
              '@type': 'Person',
              name: (event.organizer as { full_name?: string } | null)?.full_name,
            },
          }),
        }}
      />
    </div>
  )
}

import Link from 'next/link'
import { MapPin, Calendar, Users, Ticket, CalendarDays } from 'lucide-react'
import { EVENT_CATEGORY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { EventCategory } from '@/types'

interface EventCardProps {
  event: {
    id: string
    slug: string
    title: string
    description: string
    category: EventCategory
    image_url: string | null
    location: string | null
    city: string
    date_start: string
    price: number | null
    price_visible: boolean
    is_free: boolean
    attendees: number
    capacity: number | null
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  fiesta: 'bg-pink-50 text-pink-700',
  cultura: 'bg-purple-50 text-purple-700',
  deporte: 'bg-green-50 text-green-700',
  networking: 'bg-blue-50 text-blue-700',
  gastronomia: 'bg-orange-50 text-orange-700',
  arte: 'bg-indigo-50 text-indigo-700',
  musica: 'bg-yellow-50 text-yellow-700',
  otro: 'bg-gray-50 text-gray-600',
}

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function EventCard({ event }: EventCardProps) {
  const catColor = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.otro
  const catLabel = EVENT_CATEGORY_LABELS[event.category as EventCategory] ?? event.category

  const priceLabel = event.is_free || !event.price
    ? 'Gratis'
    : event.price_visible
      ? `${event.price}€`
      : 'Precio a consultar'

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 hover:border-[#009C3B]/20"
    >
      {/* Image / cover */}
      <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <CalendarDays className="w-12 h-12 text-gray-300" />
        )}
        {/* Price badge */}
        <div className={cn(
          'absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full',
          event.is_free || !event.price ? 'bg-[#009C3B] text-white' : 'bg-white text-gray-900 shadow-sm'
        )}>
          {priceLabel}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <span className={cn('self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3', catColor)}>
          {catLabel}
        </span>

        <h3 className="font-bold text-gray-900 group-hover:text-[#009C3B] transition-colors leading-tight mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatEventDate(event.date_start)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.location}, {event.city}</span>
            </div>
          )}
          {event.capacity && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{event.attendees} / {event.capacity} asistentes</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Ticket className="w-3 h-3" />
            {priceLabel}
          </div>
          <span className="text-xs text-[#009C3B] font-semibold group-hover:translate-x-0.5 transition-transform">
            Ver evento →
          </span>
        </div>
      </div>
    </Link>
  )
}

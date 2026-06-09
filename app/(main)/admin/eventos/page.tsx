import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, ExternalLink } from 'lucide-react'
import { getPendingEvents, approveEventAction, rejectEventAction } from '@/actions/admin'
import { EVENT_CATEGORY_LABELS } from '@/lib/constants'

export const metadata: Metadata = { title: 'Eventos pendientes — Admin' }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminEventosPage() {
  const events = await getPendingEvents()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Eventos pendientes</h1>
        <p className="text-gray-500 text-sm mt-1">{events.length} evento{events.length !== 1 ? 's' : ''} esperando revisión</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Todo al día</p>
          <p className="text-gray-400 text-sm">No hay eventos pendientes de revisión</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const organizer = event.organizer as { full_name?: string } | null
            return (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 truncate">{event.title}</p>
                    <Link href={`/eventos/${event.id}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 shrink-0" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400">
                    {EVENT_CATEGORY_LABELS[event.category as keyof typeof EVENT_CATEGORY_LABELS] ?? event.category}
                    {' · '}{event.city}
                    {' · '}{formatEventDate(event.date_start)}
                    {organizer?.full_name && ` · por ${organizer.full_name}`}
                    {' · '}{timeAgo(event.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form action={approveEventAction}>
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" className="px-4 py-1.5 text-sm font-semibold bg-[#009C3B] hover:bg-[#007a2f] text-white rounded-lg transition-colors">
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectEventAction}>
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" className="px-4 py-1.5 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

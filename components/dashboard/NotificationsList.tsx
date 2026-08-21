'use client'

import { useTransition } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { markNotificationReadAction, markAllNotificationsReadAction } from '@/actions/notifications'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Hace un momento'
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}

interface NotificationsListProps {
  notifications: Notification[]
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const [isPending, startTransition] = useTransition()
  const hasUnread = notifications.some((n) => !n.is_read)

  const handleMarkRead = (id: string) => {
    const formData = new FormData()
    formData.set('id', id)
    startTransition(() => { markNotificationReadAction(formData) })
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-semibold text-gray-900 mb-1">No tienes notificaciones</p>
        <p className="text-gray-400 text-sm">Aquí verás avisos de tus pedidos, reservas y reseñas.</p>
      </div>
    )
  }

  return (
    <div>
      {hasUnread && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => { markAllNotificationsReadAction() })}
            className="text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]"
          >
            Marcar todas como leídas
          </button>
        </div>
      )}
      <div className="space-y-2">
        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => !n.is_read && handleMarkRead(n.id)}
            className={cn(
              'w-full text-left flex items-start gap-3 bg-white rounded-2xl border p-4 transition-colors',
              n.is_read ? 'border-gray-100' : 'border-[#009C3B]/30 bg-[#009C3B]/5'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-[#002776]/10 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#002776]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{n.title}</p>
              {n.body && <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>}
              <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
            </div>
            {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#009C3B] shrink-0 mt-1.5" />}
          </button>
        ))}
      </div>
    </div>
  )
}

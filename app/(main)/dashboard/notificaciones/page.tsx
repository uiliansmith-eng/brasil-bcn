import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getMyNotifications } from '@/actions/notifications'
import { NotificationsList } from '@/components/dashboard/NotificationsList'

export const metadata: Metadata = { title: 'Notificaciones — Brasil BCN' }

export default async function NotificacionesPage() {
  const notifications = await getMyNotifications()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-8">Notificaciones</h1>

      <NotificationsList notifications={notifications} />
    </div>
  )
}

import type { Metadata } from 'next'
import { Store, CheckCircle2, ShoppingBag, CalendarClock, QrCode, Star } from 'lucide-react'
import { getPlatformAnalyticsSummary } from '@/actions/analytics'

export const metadata: Metadata = { title: 'Analítica — Admin' }

export default async function AdminAnaliticaPage() {
  const summary = await getPlatformAnalyticsSummary()

  if (!summary) {
    return <p className="text-gray-400 text-sm">No tienes acceso a esta sección.</p>
  }

  const cards = [
    { label: 'Tiendas totales', value: summary.totalStores, icon: Store },
    { label: 'Tiendas publicadas', value: summary.publishedStores, icon: CheckCircle2 },
    { label: 'Pedidos (30d)', value: summary.totalOrders, icon: ShoppingBag },
    { label: 'Facturado (30d)', value: `${summary.totalRevenue.toLocaleString('es-ES')}€`, icon: ShoppingBag },
    { label: 'Reservas (30d)', value: summary.totalReservations, icon: CalendarClock },
    { label: 'Cupones QR canjeados (30d)', value: summary.totalQrClaims, icon: QrCode },
    { label: 'Reseñas totales', value: summary.totalReviews, icon: Star },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analítica de la plataforma</h1>
        <p className="text-gray-500 text-sm mt-1">Métricas del motor de tiendas de Brasil BCN, últimos 30 días salvo donde se indica.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <Icon className="w-6 h-6 text-[#009C3B] mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

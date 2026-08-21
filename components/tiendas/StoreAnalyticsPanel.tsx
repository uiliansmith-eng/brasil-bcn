import { Eye, MessageCircle, QrCode, Heart, ShoppingBag, CalendarClock, Star } from 'lucide-react'
import type { StoreAnalyticsSummary } from '@/actions/analytics'

interface StoreAnalyticsPanelProps {
  summary: StoreAnalyticsSummary
}

const METRICS: { key: keyof StoreAnalyticsSummary; label: string; icon: React.ComponentType<{ className?: string }>; format?: (v: number) => string }[] = [
  { key: 'views', label: 'Visualizaciones (30d)', icon: Eye },
  { key: 'whatsappClicks', label: 'Clics a WhatsApp (30d)', icon: MessageCircle },
  { key: 'orders', label: 'Pedidos (30d)', icon: ShoppingBag },
  { key: 'revenue', label: 'Facturado (30d)', icon: ShoppingBag, format: (v) => `${v.toLocaleString('es-ES')}€` },
  { key: 'reservations', label: 'Reservas (30d)', icon: CalendarClock },
  { key: 'qrClaims', label: 'Cupones QR emitidos (30d)', icon: QrCode },
  { key: 'favorites', label: 'Favoritos', icon: Heart },
  { key: 'avgRating', label: 'Valoración media', icon: Star, format: (v) => v > 0 ? `${v.toFixed(1)}★` : '—' },
]

export function StoreAnalyticsPanel({ summary }: StoreAnalyticsPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="font-black text-gray-900 text-lg mb-1">Analítica</h2>
      <p className="text-gray-400 text-sm mb-5">Últimos 30 días, salvo donde se indica.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METRICS.map(({ key, label, icon: Icon, format }) => (
          <div key={key} className="rounded-xl border border-gray-100 p-4 text-center">
            <Icon className="w-5 h-5 text-[#009C3B] mx-auto mb-1.5" />
            <p className="text-lg font-black text-gray-900">{format ? format(summary[key]) : summary[key]}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

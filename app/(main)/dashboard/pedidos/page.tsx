import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Store } from 'lucide-react'
import { getMyOrders } from '@/actions/orders'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus, OrderItem } from '@/types'

export const metadata: Metadata = { title: 'Mis pedidos — Brasil BCN' }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}

export default async function MisPedidosPage() {
  const orders = await getMyOrders()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-8">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Todavía no hiciste ningún pedido</p>
          <p className="text-gray-400 text-sm">Explora las tiendas de Brasil BCN para empezar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const company = order.company as { name: string; slug: string; logo_url: string | null } | null
            const items = (order.items ?? []) as OrderItem[]
            return (
              <Link
                key={order.id}
                href={`/tiendas/${company?.slug}/pedido/${order.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#009C3B]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#002776]/10 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-[#002776]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{company?.name ?? 'Tienda'}</p>
                  <p className="text-xs text-gray-400">
                    {items.length} producto{items.length !== 1 ? 's' : ''} · {order.total.toLocaleString('es-ES')}€ · {timeAgo(order.created_at)}
                  </p>
                </div>
                <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full shrink-0">
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

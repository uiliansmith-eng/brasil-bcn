'use client'

import { useTransition } from 'react'
import { Loader2, ShoppingBag } from 'lucide-react'
import { updateOrderStatusAction } from '@/actions/orders'
import { ORDER_STATUS_LABELS, FULFILLMENT_METHOD_LABELS } from '@/lib/constants'
import type { Order, OrderItem, OrderStatus } from '@/types'

const STATUS_FLOW: OrderStatus[] = ['pending', 'paid', 'preparing', 'ready', 'completed']

interface StoreOrdersManagerProps {
  orders: (Order & { items: OrderItem[] })[]
}

export function StoreOrdersManager({ orders }: StoreOrdersManagerProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const formData = new FormData()
    formData.set('id', orderId)
    formData.set('status', status)
    startTransition(() => { updateOrderStatusAction(formData) })
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Todavía no recibiste pedidos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold text-gray-900">Pedido #{order.id.slice(0, 8)}</p>
              <p className="text-xs text-gray-400">
                {order.customer_name} · {order.customer_phone} · {FULFILLMENT_METHOD_LABELS[order.fulfillment_method]}
              </p>
            </div>
            <span className="font-black text-gray-900 shrink-0">{order.total.toLocaleString('es-ES')}€</span>
          </div>

          <div className="space-y-1 mb-4">
            {order.items.map((item) => (
              <p key={item.id} className="text-sm text-gray-600">{item.quantity}× {item.name_snapshot}</p>
            ))}
          </div>

          {order.customer_notes && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 mb-4">{order.customer_notes}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {order.status === 'cancelled' || order.status === 'refunded' ? (
              <span className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg">
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            ) : (
              <>
                {STATUS_FLOW.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(order.id, status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      order.status === status
                        ? 'bg-[#009C3B] text-white border-[#009C3B]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#009C3B]'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[status]}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                >
                  Cancelar
                </button>
              </>
            )}
            {isPending && <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
          </div>
        </div>
      ))}
    </div>
  )
}

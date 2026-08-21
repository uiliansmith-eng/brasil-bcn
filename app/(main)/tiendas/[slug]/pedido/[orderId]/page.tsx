import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getOrderById } from '@/actions/orders'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus, OrderItem } from '@/types'

export const metadata: Metadata = { title: 'Pedido confirmado — Brasil BCN' }

interface PageProps {
  params: Promise<{ slug: string; orderId: string }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { slug, orderId } = await params
  const order = await getOrderById(orderId)
  if (!order) notFound()

  const company = order.company as { name: string; slug: string; logo_url: string | null; whatsapp: string | null } | null
  const items = (order.items ?? []) as OrderItem[]
  const whatsappUrl = company?.whatsapp
    ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Acabo de hacer un pedido en Brasil BCN (${order.id.slice(0, 8)}).`)}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/tiendas/${slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a la tienda
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#009C3B] mx-auto mb-3" />
          <h1 className="text-xl font-black text-gray-900 mb-1">¡Pedido confirmado!</h1>
          <p className="text-gray-500 text-sm">
            {company?.name} recibió tu pedido y se pondrá en contacto contigo para coordinar el pago y la entrega.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">Pedido #{order.id.slice(0, 8)}</h2>
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
              {ORDER_STATUS_LABELS[order.status as OrderStatus]}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{item.quantity}× {item.name_snapshot}</span>
                <span className="text-gray-500">{item.subtotal.toLocaleString('es-ES')}€</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-50 pt-3 space-y-1">
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-sm text-[#009C3B]">
                <span>Descuento</span>
                <span>-{order.discount.toLocaleString('es-ES')}€</span>
              </div>
            )}
            <div className="flex items-center justify-between font-black text-gray-900">
              <span>Total</span>
              <span>{order.total.toLocaleString('es-ES')}€</span>
            </div>
          </div>
        </div>

        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold gap-2 h-12">
              <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

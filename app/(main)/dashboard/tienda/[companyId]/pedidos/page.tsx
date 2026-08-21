import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCompanyForOwner } from '@/actions/stores'
import { getStoreOrders } from '@/actions/orders'
import { StoreOrdersManager } from '@/components/tiendas/StoreOrdersManager'
import type { Order, OrderItem } from '@/types'

export const metadata: Metadata = { title: 'Pedidos — Mi tienda' }

interface PageProps {
  params: Promise<{ companyId: string }>
}

export default async function TiendaPedidosPage({ params }: PageProps) {
  const { companyId } = await params
  const company = await getCompanyForOwner(companyId)
  if (!company || !company.is_store) notFound()

  const orders = await getStoreOrders(company.id) as (Order & { items: OrderItem[] })[]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href={`/dashboard/tienda/${company.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a mi tienda
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-8">Pedidos</h1>

      <StoreOrdersManager orders={orders} />
    </div>
  )
}

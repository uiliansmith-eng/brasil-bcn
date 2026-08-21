import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCompanyForOwner } from '@/actions/stores'
import { getStoreReservations } from '@/actions/reservations'
import { StoreReservationsManager } from '@/components/tiendas/StoreReservationsManager'
import type { Reservation } from '@/types'

export const metadata: Metadata = { title: 'Reservas — Mi tienda' }

interface PageProps {
  params: Promise<{ companyId: string }>
}

export default async function TiendaReservasPage({ params }: PageProps) {
  const { companyId } = await params
  const company = await getCompanyForOwner(companyId)
  if (!company || !company.is_store) notFound()

  const reservations = await getStoreReservations(company.id) as (Reservation & { item: { name: string } | null })[]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href={`/dashboard/tienda/${company.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a mi tienda
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-8">Reservas</h1>

      <StoreReservationsManager reservations={reservations} />
    </div>
  )
}

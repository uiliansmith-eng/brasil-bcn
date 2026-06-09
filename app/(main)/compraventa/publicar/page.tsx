import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'
import { PublishListingForm } from '@/components/compraventa/PublishListingForm'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Publicar anuncio — Compra y Venta BrasilBCN',
  description: 'Vende tus artículos a la comunidad brasileña en Barcelona. Gratis y sin comisiones.',
  path: '/compraventa/publicar',
  noIndex: true,
})

export default function PublicarListingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#009C3B]/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#009C3B]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Publicar anuncio</h1>
            <p className="text-gray-500 text-sm">Gratis · Llega a toda la comunidad</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <PublishListingForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Tu anuncio será revisado antes de publicarse. Normalmente en menos de 24h.
        </p>
      </div>
    </div>
  )
}

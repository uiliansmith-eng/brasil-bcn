import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, ArrowLeft, MessageCircle, Tag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getListingById } from '@/actions/listings'
import { buildMetadata } from '@/lib/seo'
import {
  LISTING_CATEGORY_LABELS,
  LISTING_CATEGORY_EMOJI,
  LISTING_CONDITION_LABELS,
  LISTING_CONDITION_COLORS,
  formatPrice,
} from '@/lib/constants'
import type { ListingCategory, ListingCondition } from '@/types'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return {}
  return buildMetadata({
    title: `${listing.title} — Compra y Venta BrasilBCN`,
    description: listing.description.slice(0, 160),
    path: `/compraventa/${id}`,
  })
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Hace un momento'
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Ayer' : `Hace ${d}d`
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  const category = listing.category as ListingCategory
  const condition = listing.condition as ListingCondition
  const conditionColor = LISTING_CONDITION_COLORS[condition] ?? 'bg-gray-50 text-gray-600'
  const emoji = LISTING_CATEGORY_EMOJI[category] ?? '📦'
  const seller = listing.seller as { id: string; full_name: string | null; avatar_url: string | null; whatsapp: string | null } | null
  const whatsapp = listing.whatsapp ?? seller?.whatsapp
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, vi tu anuncio "${listing.title}" en BrasilBCN`)}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link href="/compraventa" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a anuncios
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* Main */}
          <div className="space-y-6">

            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {listing.images.length > 0 ? (
                <div className="grid gap-1" style={{ gridTemplateColumns: listing.images.length > 1 ? '1fr 1fr' : '1fr' }}>
                  {(listing.images as string[]).slice(0, 4).map((src: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={listing.title}
                      className={cn('w-full object-cover', i === 0 && listing.images.length > 1 ? 'row-span-2 h-80' : 'h-40')}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center bg-gray-50">
                  <span className="text-8xl">{emoji}</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {LISTING_CATEGORY_LABELS[category]}
                </span>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1', conditionColor)}>
                  <Star className="w-3 h-3" />
                  {LISTING_CONDITION_LABELS[condition]}
                </span>
              </div>

              <h1 className="text-2xl font-black text-gray-900 mb-3">{listing.title}</h1>

              <p className="text-3xl font-black text-[#009C3B] mb-4">
                {formatPrice(listing.price, listing.price_negotiable)}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{listing.city}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{timeAgo(listing.created_at)}</span>
              </div>

              <div className="border-t border-gray-50 pt-5">
                <h2 className="font-bold text-gray-900 mb-3">Descripción</h2>
                <div className="text-gray-600 text-sm leading-relaxed space-y-2">
                  {(listing.description as string).split('\n\n').map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Contactar vendedor</h2>

              {seller && (
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-[#009C3B]/10 flex items-center justify-center overflow-hidden shrink-0">
                    {seller.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-[#009C3B]">
                        {seller.full_name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{seller.full_name ?? 'Vendedor'}</p>
                    <p className="text-xs text-gray-400">Miembro de BrasilBCN</p>
                  </div>
                </div>
              )}

              {whatsappUrl ? (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contactar por WhatsApp
                  </Button>
                </a>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">
                  El vendedor no ha indicado un número de contacto.
                </p>
              )}
            </div>

            {/* Safety tips */}
            <div className="bg-[#FFDF00]/10 border border-[#FFDF00]/30 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Consejos de seguridad</h3>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li>• Queda siempre en un lugar público</li>
                <li>• Comprueba el artículo antes de pagar</li>
                <li>• Desconfía de ofertas demasiado baratas</li>
                <li>• No hagas transferencias por adelantado</li>
              </ul>
            </div>

            {/* Back link */}
            <Link href="/compraventa">
              <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                Ver más anuncios
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

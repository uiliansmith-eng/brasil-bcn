import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Globe, Phone, MessageCircle, Mail, AtSign, Clock, CheckCircle2, Store, Tag, Ticket, Images, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { AddToCartButton } from '@/components/tiendas/AddToCartButton'
import { FloatingCartButton } from '@/components/tiendas/FloatingCartButton'
import { ReserveButton } from '@/components/tiendas/ReserveButton'
import { CouponQrButton } from '@/components/tiendas/CouponQrButton'
import { FavoriteButton } from '@/components/tiendas/FavoriteButton'
import { WhatsAppTrackedLink } from '@/components/tiendas/WhatsAppTrackedLink'
import { DirectionsTrackedLink } from '@/components/tiendas/DirectionsTrackedLink'
import { ReviewsSection } from '@/components/tiendas/ReviewsSection'
import { getStoreBySlug, getActiveStoreModuleKeys } from '@/actions/stores'
import { isStoreFavorited } from '@/actions/favorites'
import { getStoreAvailability } from '@/actions/reservations'
import { isStoreOpenNow } from '@/lib/store-hours'
import { isVideoUrl } from '@/lib/media'
import { COMPANY_CATEGORY_LABELS, STORE_CATALOG_LABEL, STORE_ITEM_TYPE_LABELS } from '@/lib/constants'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { CompanyCategory, StoreItem, Coupon } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  if (!store) return { title: 'Tienda no encontrada — BrasilBCN' }

  const category = COMPANY_CATEGORY_LABELS[store.category as CompanyCategory] ?? store.category

  return buildMetadata({
    title: `${store.name} — ${category} en Barcelona`,
    description: store.description?.slice(0, 160) ?? `${store.name}, tienda brasileña en ${store.city}`,
    path: `/tiendas/${slug}`,
    image: store.logo_url ?? undefined,
    type: 'article',
    keywords: [store.name, category, store.city, 'tienda brasileña Barcelona'],
  })
}

function formatPrice(price: number | null): string | null {
  if (price === null || price === undefined) return null
  return `${price.toLocaleString('es-ES')}€`
}

function formatDiscount(coupon: Coupon): string {
  return coupon.discount_type === 'percentage'
    ? `${coupon.discount_value}% DE DESCUENTO`
    : `${coupon.discount_value}€ DE DESCUENTO`
}

export default async function StoreDetailPage({ params }: PageProps) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  if (!store) notFound()

  const catLabel = COMPANY_CATEGORY_LABELS[store.category as CompanyCategory] ?? store.category
  const catalogLabel = STORE_CATALOG_LABEL[store.category as CompanyCategory] ?? 'Catálogo'
  const businessHours = (store.business_hours as { text?: string } | null)?.text ?? null
  const whatsappGreeting = store.whatsapp_message || `Hola ${store.name}! Te encontré en Brasil BCN.`
  const whatsappUrl = store.whatsapp
    ? `https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappGreeting)}`
    : null
  const whatsappItemUrl = (itemName: string) => store.whatsapp
    ? `https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`${whatsappGreeting}\n\nMe interesa: ${itemName}`)}`
    : null
  const instagramUrl = store.instagram
    ? `https://instagram.com/${store.instagram.replace(/^@/, '')}`
    : null

  const items = ((store.items ?? []) as StoreItem[])
    .filter((i) => i.is_active)
    .sort((a, b) => a.display_order - b.display_order)
  const coupons = (store.coupons ?? []) as Coupon[]
  const modules = await getActiveStoreModuleKeys(store.id)
  const favorited = await isStoreFavorited(store.id)
  const availability = await getStoreAvailability(store.id)
  const openNow = isStoreOpenNow(availability)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/tiendas" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a tiendas
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* Main */}
          <div className="space-y-6">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-[#002776]/10 to-[#009C3B]/10 flex items-center justify-center relative">
                {store.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={store.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-14 h-14 text-[#002776]/20" />
                )}
              </div>

              <div className="px-8 pb-8">
                <div className="flex items-end gap-4 -mt-10 mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                    {store.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={store.logo_url} alt={store.name} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <Store className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  {store.is_verified && (
                    <div className="mb-2 flex items-center gap-1.5 bg-green-50 text-[#009C3B] text-sm font-semibold px-3 py-1.5 rounded-full border border-green-100">
                      <CheckCircle2 className="w-4 h-4" /> Tienda verificada
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3 mb-1">
                  <h1 className="text-2xl font-black text-gray-900">{store.name}</h1>
                  <FavoriteButton companyId={store.id} initialFavorited={favorited} />
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-sm font-semibold bg-[#002776]/10 text-[#002776] px-3 py-1.5 rounded-full">
                    {catLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {store.address ? `${store.address}, ${store.city}` : store.city}
                  </div>
                  {businessHours && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {businessHours}
                    </div>
                  )}
                  {openNow !== null && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${openNow ? 'bg-[#009C3B]/10 text-[#009C3B]' : 'bg-red-50 text-red-500'}`}>
                      {openNow ? 'Abierto ahora' : 'Cerrado ahora'}
                    </span>
                  )}
                </div>

                {store.description && (
                  <p className="text-gray-600 leading-relaxed">{store.description}</p>
                )}

                {store.extra_info && (
                  <p className="text-gray-500 text-sm leading-relaxed mt-4 pt-4 border-t border-gray-50 whitespace-pre-wrap">
                    {store.extra_info}
                  </p>
                )}
              </div>
            </div>

            {/* Cupones */}
            {coupons.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#009C3B]" /> Cupones disponibles
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="rounded-xl border-2 border-dashed border-[#009C3B]/40 bg-[#009C3B]/5 p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">{coupon.title}</p>
                      <p className="text-lg font-black text-[#009C3B] mb-2">{formatDiscount(coupon)}</p>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                          <span className="text-xs text-gray-400">Código:</span>
                          <span className="font-mono font-bold text-gray-900 text-sm">{coupon.code}</span>
                        </div>
                        {modules.has('qr') && (
                          <CouponQrButton couponId={coupon.id} couponTitle={coupon.title} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Catálogo */}
            {items.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#009C3B]" /> {catalogLabel}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 rounded-lg bg-gray-50 shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Tag className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
                          {formatPrice(item.price) && (
                            <span className="text-[#009C3B] font-bold text-sm shrink-0">{formatPrice(item.price)}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              {STORE_ITEM_TYPE_LABELS[item.item_type]}
                            </span>
                            {item.duration_min && (
                              <span className="text-[10px] text-gray-400">{item.duration_min} min</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.item_type === 'product' && item.price !== null && (!item.track_stock || (item.stock ?? 0) > 0) && (
                              <AddToCartButton
                                companyId={store.id}
                                storeItemId={item.id}
                                name={item.name}
                                price={item.price}
                                imageUrl={item.image_url}
                              />
                            )}
                            {item.item_type === 'service' && modules.has('bookings') && (
                              <ReserveButton
                                companyId={store.id}
                                storeSlug={store.slug}
                                storeItemId={item.id}
                                itemName={item.name}
                              />
                            )}
                            {whatsappItemUrl(item.name) && (
                              <WhatsAppTrackedLink
                                companyId={store.id}
                                href={whatsappItemUrl(item.name)!}
                                className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 shrink-0"
                                title="Preguntar por WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </WhatsAppTrackedLink>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Galería */}
            {modules.has('gallery') && store.gallery.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <Images className="w-5 h-5 text-[#009C3B]" /> Galería
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {(store.gallery as string[]).map((url) => (
                    <div key={url} className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-black">
                      {isVideoUrl(url) ? (
                        <video src={url} controls className="w-full h-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={store.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ReviewsSection companyId={store.id} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-black text-gray-900 text-lg mb-5">Contacto</h3>

              <div className="space-y-3 mb-5">
                {whatsappUrl && (
                  <WhatsAppTrackedLink companyId={store.id} href={whatsappUrl}>
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold gap-2">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                  </WhatsAppTrackedLink>
                )}
                {store.latitude !== null && store.longitude !== null && (
                  <DirectionsTrackedLink
                    companyId={store.id}
                    href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                  >
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Navigation className="w-4 h-4" /> Cómo llegar
                    </Button>
                  </DirectionsTrackedLink>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <AtSign className="w-4 h-4" /> Instagram
                    </Button>
                  </a>
                )}
                {store.phone && (
                  <a href={`tel:${store.phone}`}>
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Phone className="w-4 h-4" /> {store.phone}
                    </Button>
                  </a>
                )}
                {store.email && (
                  <a href={`mailto:${store.email}`}>
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Mail className="w-4 h-4" /> Email
                    </Button>
                  </a>
                )}
                {store.website && (
                  <a href={store.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 border-gray-200">
                      <Globe className="w-4 h-4" /> Web
                    </Button>
                  </a>
                )}
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-1.5">
                {[
                  `${store.views ?? 0} visualizaciones`,
                  store.address && `${store.address}, ${store.city}`,
                ].filter(Boolean).map((info) => (
                  <p key={info as string} className={cn('text-gray-400 text-xs')}>{info}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="font-bold text-gray-700 text-sm mb-3">Compartir esta tienda</p>
              <ShareButtons title={store.name} text={`${store.name} — ${catLabel} en Barcelona`} />
            </div>
          </aside>
        </div>
      </div>

      <FloatingCartButton companyId={store.id} storeSlug={store.slug} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: store.name,
            description: store.description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: store.address,
              addressLocality: store.city,
              addressCountry: 'ES',
            },
            telephone: store.phone,
            email: store.email,
            url: store.website,
            ...(store.latitude !== null && store.longitude !== null ? {
              geo: { '@type': 'GeoCoordinates', latitude: store.latitude, longitude: store.longitude },
            } : {}),
          }),
        }}
      />
    </div>
  )
}

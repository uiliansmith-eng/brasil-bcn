import { ShoppingBag, CheckCircle2, XCircle, Tag } from 'lucide-react'
import { getAdminListings, approveListingAction, rejectListingAction, markSoldListingAction } from '@/actions/listings'
import { LISTING_CATEGORY_LABELS, LISTING_CONDITION_LABELS, formatPrice } from '@/lib/constants'
import type { ListingCategory, ListingCondition } from '@/types'

export default async function AdminCompraventaPage() {
  const listings = await getAdminListings()

  const pending = listings.filter((l) => !l.is_approved && l.is_active)
  const approved = listings.filter((l) => l.is_approved && l.is_active && !l.is_sold)
  const sold = listings.filter((l) => l.is_sold)
  const rejected = listings.filter((l) => !l.is_active && !l.is_sold)

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#009C3B]/10 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-[#009C3B]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Compra y Venta</h1>
          <p className="text-gray-500 text-sm">{listings.length} anuncios en total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pendientes', count: pending.length, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Activos', count: approved.length, color: 'text-green-600 bg-green-50' },
          { label: 'Vendidos', count: sold.length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Rechazados', count: rejected.length, color: 'text-red-600 bg-red-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-black ${color.split(' ')[0]}`}>{count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            Pendientes de aprobación ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((listing) => (
              <ListingAdminRow
                key={listing.id}
                listing={listing}
                actions={
                  <>
                    <form action={approveListingAction}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-[#009C3B] hover:bg-[#007a2f] text-white text-xs font-semibold rounded-lg transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
                      </button>
                    </form>
                    <form action={rejectListingAction}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Rechazar
                      </button>
                    </form>
                  </>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Activos ({approved.length})
          </h2>
          <div className="space-y-3">
            {approved.map((listing) => (
              <ListingAdminRow
                key={listing.id}
                listing={listing}
                actions={
                  <>
                    <form action={markSoldListingAction}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors">
                        <Tag className="w-3.5 h-3.5" /> Marcar vendido
                      </button>
                    </form>
                    <form action={rejectListingAction}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Desactivar
                      </button>
                    </form>
                  </>
                }
              />
            ))}
          </div>
        </section>
      )}

      {listings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay anuncios todavía.</p>
        </div>
      )}
    </div>
  )
}

interface ListingAdminRowProps {
  listing: {
    id: string
    title: string
    price: number | null
    price_negotiable: boolean
    category: string
    condition: string
    city: string
    views: number
    created_at: string
    seller?: { full_name?: string | null } | null
  }
  actions: React.ReactNode
}

function ListingAdminRow({ listing, actions }: ListingAdminRowProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">
            {LISTING_CATEGORY_LABELS[listing.category as ListingCategory] ?? listing.category}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">
            {LISTING_CONDITION_LABELS[listing.condition as ListingCondition] ?? listing.condition}
          </span>
          <span className="text-xs text-gray-400">· {listing.city}</span>
        </div>
        <p className="font-bold text-gray-900 text-sm truncate">{listing.title}</p>
        <p className="text-sm font-semibold text-[#009C3B]">
          {formatPrice(listing.price, listing.price_negotiable)}
        </p>
        {listing.seller && (
          <p className="text-xs text-gray-400 mt-0.5">
            Por: {listing.seller.full_name ?? 'Usuario'}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {actions}
      </div>
    </div>
  )
}

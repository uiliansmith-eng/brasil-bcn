import Link from 'next/link'
import { MapPin, Clock, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LISTING_CATEGORY_LABELS,
  LISTING_CONDITION_LABELS,
  LISTING_CONDITION_COLORS,
  formatPrice,
} from '@/lib/constants'
import type { ListingCategory, ListingCondition } from '@/types'

interface ListingCardProps {
  listing: {
    id: string
    title: string
    price: number | null
    price_negotiable: boolean
    category: string
    condition: string
    images: string[]
    city: string
    created_at: string
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Hace un momento'
  if (h < 24) return `Hace ${h}h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Ayer' : `Hace ${d}d`
}

export function ListingCard({ listing }: ListingCardProps) {
  const category = listing.category as ListingCategory
  const condition = listing.condition as ListingCondition
  const conditionColor = LISTING_CONDITION_COLORS[condition] ?? 'bg-gray-50 text-gray-600'
  const image = listing.images[0]

  return (
    <Link
      href={`/compraventa/${listing.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:border-[#009C3B]/30"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <Package className="w-10 h-10 text-gray-300" />
        )}
        <div className={cn('absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-lg', conditionColor)}>
          {LISTING_CONDITION_LABELS[condition]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-medium text-gray-400 mb-1">
          {LISTING_CATEGORY_LABELS[category] ?? listing.category}
        </p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#009C3B] transition-colors">
          {listing.title}
        </h3>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <p className="text-lg font-black text-[#009C3B]">
            {formatPrice(listing.price, listing.price_negotiable)}
          </p>
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {listing.city}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {timeAgo(listing.created_at)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

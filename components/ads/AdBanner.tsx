'use client'

import { useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { trackAdImpression, trackAdClick } from '@/actions/advertisements'

interface AdData {
  id: string
  title: string
  description: string | null
  image_url: string
  url: string
}

interface AdBannerProps {
  ad: AdData
  variant?: 'banner' | 'sidebar'
}

export function AdBanner({ ad, variant = 'banner' }: AdBannerProps) {
  useEffect(() => {
    trackAdImpression(ad.id)
  }, [ad.id])

  if (variant === 'sidebar') {
    return (
      <div className="relative">
        <span className="absolute top-2 right-2 text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded z-10 border border-gray-100">
          Publicidad
        </span>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackAdClick(ad.id)}
          className="block bg-white rounded-2xl border border-[#FFDF00]/40 hover:border-[#FFDF00] hover:shadow-md transition-all overflow-hidden group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.image_url} alt={ad.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="p-4">
            <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-[#002776] transition-colors">{ad.title}</p>
            {ad.description && (
              <p className="text-xs text-gray-500 line-clamp-2">{ad.description}</p>
            )}
            <div className="flex items-center gap-1 text-xs font-semibold text-[#009C3B] mt-3">
              Ver más <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </a>
      </div>
    )
  }

  return (
    <div className="relative">
      <span className="absolute top-3 right-3 text-[10px] font-medium text-gray-400 bg-white/90 px-1.5 py-0.5 rounded z-10 border border-gray-100">
        Publicidad
      </span>
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackAdClick(ad.id)}
        className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-l-4 border-[#FFDF00] hover:shadow-lg transition-all group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image_url}
          alt={ad.title}
          className="w-16 h-16 object-contain rounded-xl shrink-0 border border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate group-hover:text-[#002776] transition-colors">
            {ad.title}
          </p>
          {ad.description && (
            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{ad.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] shrink-0 bg-[#009C3B]/5 px-3 py-2 rounded-xl group-hover:bg-[#009C3B] group-hover:text-white transition-all">
          Ver más <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </a>
    </div>
  )
}

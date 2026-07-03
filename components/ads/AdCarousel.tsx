'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdBanner } from './AdBanner'

interface AdData {
  id: string
  title: string
  description: string | null
  image_url: string
  url: string
}

interface AdCarouselProps {
  ads: AdData[]
  variant?: 'banner' | 'sidebar'
}

const DURATION = 7000

export function AdCarousel({ ads, variant }: AdCarouselProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % ads.length)
  }, [ads.length])

  useEffect(() => {
    if (ads.length <= 1) return
    const t = setInterval(next, DURATION)
    return () => clearInterval(t)
  }, [next, ads.length])

  if (ads.length === 0) return null

  const ad = ads[current]

  return (
    <div className="relative">
      <AdBanner key={ad.id} ad={ad} variant={variant} />
      {ads.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {ads.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#009C3B] w-4' : 'bg-gray-200 w-1.5'}`}
              aria-label={`Ir al anuncio ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

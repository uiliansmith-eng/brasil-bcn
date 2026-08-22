'use client'

import { useState, useEffect, useCallback } from 'react'

interface BannerData {
  id: string
  title: string
  image_url: string
  link_url: string
}

interface HomeBannerCarouselProps {
  banners: BannerData[]
}

const DURATION = 6000

export function HomeBannerCarousel({ banners }: HomeBannerCarouselProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(next, DURATION)
    return () => clearInterval(t)
  }, [next, banners.length])

  if (banners.length === 0) return null

  const banner = banners[current]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <a
        href={banner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.image_url} alt={banner.title} className="w-full h-32 sm:h-44 object-cover" />
      </a>
      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#009C3B] w-4' : 'bg-gray-200 w-1.5'}`}
              aria-label={`Ir al banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

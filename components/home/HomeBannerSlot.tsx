import { Suspense } from 'react'
import { getActiveHomeBanners } from '@/actions/promotions'
import { HomeBannerCarousel } from './HomeBannerCarousel'

async function HomeBannerSlotInner() {
  const banners = await getActiveHomeBanners()
  if (banners.length === 0) return null
  return <HomeBannerCarousel banners={banners} />
}

export function HomeBannerSlot() {
  return (
    <Suspense fallback={null}>
      <HomeBannerSlotInner />
    </Suspense>
  )
}

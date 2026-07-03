import { Suspense } from 'react'
import { getAdsByPosition } from '@/actions/advertisements'
import { AdCarousel } from './AdCarousel'
import type { AdPosition } from '@/types'

interface AdSlotProps {
  position: AdPosition
  variant?: 'banner' | 'sidebar'
  className?: string
}

async function AdSlotInner({ position, variant }: Omit<AdSlotProps, 'className'>) {
  const ads = await getAdsByPosition(position)
  if (ads.length === 0) return null
  return <AdCarousel ads={ads} variant={variant} />
}

export function AdSlot({ position, variant = 'banner', className }: AdSlotProps) {
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <AdSlotInner position={position} variant={variant} />
      </Suspense>
    </div>
  )
}

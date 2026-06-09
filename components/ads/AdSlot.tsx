import { Suspense } from 'react'
import { getAdByPosition } from '@/actions/advertisements'
import { AdBanner } from './AdBanner'
import type { AdPosition } from '@/types'

interface AdSlotProps {
  position: AdPosition
  variant?: 'banner' | 'sidebar'
  className?: string
}

async function AdSlotInner({ position, variant }: Omit<AdSlotProps, 'className'>) {
  const ad = await getAdByPosition(position)
  if (!ad) return null
  return <AdBanner ad={ad} variant={variant} />
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

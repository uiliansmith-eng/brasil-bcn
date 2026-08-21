'use client'

import type { ReactNode } from 'react'
import { trackStoreEventAction } from '@/actions/analytics'

interface DirectionsTrackedLinkProps {
  companyId: string
  href: string
  className?: string
  children: ReactNode
}

export function DirectionsTrackedLink({ companyId, href, className, children }: DirectionsTrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => { trackStoreEventAction(companyId, 'directions_click') }}
    >
      {children}
    </a>
  )
}

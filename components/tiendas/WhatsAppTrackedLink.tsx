'use client'

import type { ReactNode } from 'react'
import { trackStoreEventAction } from '@/actions/analytics'

interface WhatsAppTrackedLinkProps {
  companyId: string
  href: string
  className?: string
  title?: string
  children: ReactNode
}

export function WhatsAppTrackedLink({ companyId, href, className, title, children }: WhatsAppTrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
      onClick={() => { trackStoreEventAction(companyId, 'whatsapp_click') }}
    >
      {children}
    </a>
  )
}

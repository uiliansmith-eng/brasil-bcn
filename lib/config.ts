import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'Brasil BCN',
  description: 'Conectando brasileños en Barcelona. Empleos, empresas, eventos y comunidad para brasileños en Cataluña.',
  url: 'https://brasilbcn.com',
  ogImage: '/og.png',
  links: {
    instagram: 'https://instagram.com/brasilbcn',
    whatsapp: 'https://wa.me/34600000000',
  },
}

export const navItems = [
  { label: 'Empleos', href: '/empleos' },
  { label: 'Empresas', href: '/empresas' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Guía', href: '/guia' },
  { label: 'Ruta Brasileño', href: '/ruta-brasileno' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Compra & Venta', href: '/compraventa' },
] as const

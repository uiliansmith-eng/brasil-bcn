import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/', '/auth/', '/api/', '/dashboard/',
          '/tiendas/*/checkout', '/tiendas/*/pedido/*', '/tiendas/*/reserva/*',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}

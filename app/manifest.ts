import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BrasilBCN',
    short_name: 'BrasilBCN',
    description: 'Conectando brasileños en Barcelona',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#009C3B',
    orientation: 'portrait',
    categories: ['lifestyle', 'social'],
    lang: 'pt-BR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    screenshots: [],
  }
}

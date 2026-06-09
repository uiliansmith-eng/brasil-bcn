import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/lib/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Comunidad brasileña en Barcelona`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'brasileños Barcelona', 'comunidad brasileña España', 'brasileños Cataluña',
    'empleos Barcelona brasileños', 'empresas brasileiras Barcelona',
    'eventos brasileños Barcelona', 'guia brasileños España',
  ],
  authors: [{ name: 'BrasilBCN' }],
  creator: 'BrasilBCN',
  publisher: 'BrasilBCN',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: 'es_ES',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Comunidad brasileña en Barcelona`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Comunidad brasileña en Barcelona`,
    description: siteConfig.description,
    site: '@brasilbcn',
  },
  metadataBase: new URL(siteConfig.url),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteConfig.url },
}

export const viewport: Viewport = {
  themeColor: '#009C3B',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

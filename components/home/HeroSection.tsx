'use client'

import Link from 'next/link'
import { Briefcase, Building2, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/settings-types'

type HeroProps = {
  settings?: SiteSettings['hero']
  brand?: SiteSettings['brand']
}

export function HeroSection({ settings, brand }: HeroProps) {
  const h = settings ?? {
    badge_text: 'Comunidade brasileira em Barcelona',
    subtitle: 'Conectando brasileños en Barcelona. Empleos, empresas, eventos y comunidad para vivir mejor en Cataluña.',
    cta1_text: 'Buscar empleo',
    cta1_href: '/empleos',
    cta2_text: 'Empresas',
    cta2_href: '/empresas',
    cta3_text: 'Eventos',
    cta3_href: '/eventos',
    footnote: '✓ Acceso gratuito · Sin compromiso · Comunidade en crecimiento',
  }
  const primary = brand?.primary ?? '#002776'
  const secondary = brand?.secondary ?? '#009C3B'

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: primary }}
    >

      {/* ── Left mosaic strip (trencadís Gaudí) ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 z-20 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(to bottom,
            #003087 0px,#003087 18px,
            #8a7060 18px,#8a7060 20px,
            #FFDF00 20px,#FFDF00 38px,
            #8a7060 38px,#8a7060 40px,
            #009C3B 40px,#009C3B 58px,
            #8a7060 58px,#8a7060 60px,
            #4ECDC4 60px,#4ECDC4 78px,
            #8a7060 78px,#8a7060 80px,
            #E07B5A 80px,#E07B5A 98px,
            #8a7060 98px,#8a7060 100px,
            #F8F6F0 100px,#F8F6F0 118px,
            #8a7060 118px,#8a7060 120px,
            #0047AB 120px,#0047AB 138px,
            #8a7060 138px,#8a7060 140px,
            #9B59B6 140px,#9B59B6 158px,
            #8a7060 158px,#8a7060 160px,
            #FFDF00 160px,#FFDF00 178px,
            #8a7060 178px,#8a7060 180px
          )`
        }}
      />

      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a5c] via-[#002776] to-[#003a99]" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${primary} 70%, #000) 0%, ${primary} 50%, color-mix(in srgb, ${primary} 70%, #00f) 100%)` }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: `${secondary}33` }} />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-3xl" style={{ backgroundColor: `${secondary}26` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#FFDF00]/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="flex justify-center">

          <div className="max-w-2xl w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="text-lg" role="img" aria-label="Brasil">🇧🇷</span>
              <span className="text-white/90 text-sm font-medium">{h.badge_text}</span>
              <span className="text-lg" role="img" aria-label="Cataluña">🏴󠁥󠁳󠁣󠁴󠁿</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
              Brasil
              <span className="block" style={{ color: brand?.accent ?? '#FFDF00' }}>BCN</span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-200 font-light leading-relaxed mb-10 max-w-xl">
              {h.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href={h.cta1_href}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-white font-bold text-base px-8 py-6 rounded-xl shadow-xl transition-all duration-300 group"
                  style={{ backgroundColor: secondary }}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  {h.cta1_text}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={h.cta2_href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/60 text-white hover:bg-white/15 hover:border-white/80 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  {h.cta2_text}
                </Button>
              </Link>
              <Link href={h.cta3_href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/60 text-white hover:bg-white/15 hover:border-white/80 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {h.cta3_text}
                </Button>
              </Link>
            </div>

            <p className="text-blue-200/70 text-sm">{h.footnote}</p>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 69.3C960 69.3 1056 58.7 1152 53.3C1248 48 1344 48 1392 48H1440V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

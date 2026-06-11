'use client'

import Link from 'next/link'
import { Briefcase, Building2, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#002776]">

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
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a5c] via-[#002776] to-[#003a99]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#009C3B]/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-[#009C3B]/15 blur-3xl" />
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
              <span className="text-white/90 text-sm font-medium">Comunidade brasileira em Barcelona</span>
              <span className="text-lg" role="img" aria-label="Cataluña">🏴󠁥󠁳󠁣󠁴󠁿</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
              Brasil
              <span className="block text-[#FFDF00]">BCN</span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-200 font-light leading-relaxed mb-10 max-w-xl">
              Conectando brasileños en Barcelona.{' '}
              <span className="text-white font-medium">Empleos, empresas, eventos</span>{' '}
              y comunidad para vivir mejor en Cataluña.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/empleos">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold text-base px-8 py-6 rounded-xl shadow-xl hover:shadow-green-500/25 transition-all duration-300 group"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Buscar empleo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/empresas">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/60 text-white hover:bg-white/15 hover:border-white/80 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Empresas
                </Button>
              </Link>
              <Link href="/eventos">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/60 text-white hover:bg-white/15 hover:border-white/80 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Eventos
                </Button>
              </Link>
            </div>

            <p className="text-blue-200/70 text-sm">
              ✓ Acceso gratuito · Sin compromiso · Comunidade en crecimiento
            </p>
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

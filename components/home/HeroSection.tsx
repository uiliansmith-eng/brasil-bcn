'use client'

import Link from 'next/link'
import { Briefcase, Building2, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#002776]">
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <div>
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
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Empresas
                </Button>
              </Link>
              <Link href="/eventos">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
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

          {/* Right: Visual cards */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Floating card 1 — Jobs */}
              <div className="absolute -top-8 -left-8 z-20 bg-white rounded-2xl p-4 shadow-2xl w-64">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#009C3B]/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#009C3B]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Empleos en Barcelona</p>
                    <p className="text-gray-500 text-xs">Para la comunidade brasileña</p>
                  </div>
                </div>
                <div className="mt-1 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-[#009C3B] font-semibold">Publicar oferta gratis</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#009C3B]" />
                </div>
              </div>

              {/* Floating card 2 — Community */}
              <div className="absolute -bottom-8 -right-4 z-20 bg-white rounded-2xl p-4 shadow-2xl w-56">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#002776]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#002776]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Eventos y comunidad</p>
                    <p className="text-gray-500 text-xs">Barcelona brasileira</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#002776] font-semibold">Ver eventos</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#002776]" />
                </div>
              </div>

              {/* Center visual */}
              <div className="relative z-10 mx-8 rounded-3xl overflow-hidden bg-gradient-to-br from-[#009C3B]/30 to-[#FFDF00]/20 border border-white/20 aspect-[4/5]">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🏛️</div>
                    <div className="flex gap-2 justify-center text-5xl mb-6">
                      <span>🇧🇷</span>
                      <span>❤️</span>
                      <span>🇪🇸</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white font-bold text-lg">Barcelona</p>
                      <p className="text-white/80 text-sm">La tua nova casa</p>
                    </div>
                  </div>
                </div>

                {/* Launch badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
                    <p className="text-[#FFDF00] font-black text-sm">🚀 Plataforma recém-lançada</p>
                    <p className="text-white/80 text-xs mt-1">Sé uno de los primeros en unirte</p>
                  </div>
                </div>
              </div>
            </div>
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

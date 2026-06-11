'use client'

import { useState, useEffect, useCallback } from 'react'
import { Vote, ChevronLeft, ChevronRight, Headphones, Layers } from 'lucide-react'

const banners = [
  {
    id: 'eleicao',
    bg: 'from-[#002776] via-[#002776] to-[#001a5c]',
    accent1: 'bg-[#009C3B]/25',
    accent2: 'bg-[#FFDF00]/15',
    tag: 'Eleições 2026',
    tagColor: 'text-[#FFDF00]',
    icon: Vote,
    iconBg: 'bg-[#009C3B]',
    title: (
      <>
        Brasileiros em Barcelona —{' '}
        <span className="text-[#009C3B]">sua voz</span>{' '}
        <span className="text-[#FFDF00]">importa!</span>
      </>
    ),
    subtitle: (
      <>
        Participe das eleições.{' '}
        <span className="text-white font-bold">O futuro do Brasil está na nossa mão.</span>
      </>
    ),
    cta: 'Verificar título',
    ctaHref: 'https://www.tse.jus.br/eleitor/titulo-e-local-de-votacao/situacao-do-titulo-eleitoral',
    ctaBg: 'bg-[#009C3B] hover:bg-[#007a2f]',
    flag: '🇧🇷',
    footer: '🗳️ Voto consciente · Regularize seu título · Voto no exterior disponível',
  },
  {
    id: 'podcast',
    bg: 'from-[#1a1a2e] via-[#16213e] to-[#0f0f1a]',
    accent1: 'bg-red-600/20',
    accent2: 'bg-purple-500/15',
    tag: 'Podcast',
    tagColor: 'text-red-400',
    icon: Headphones,
    iconBg: 'bg-red-600',
    title: (
      <>
        <span className="text-red-400">Só Vai</span>{' '}
        <span className="text-white">Podcast</span>
      </>
    ),
    subtitle: (
      <>
        Histórias reais de brasileiros em Barcelona.{' '}
        <span className="text-white font-bold">Já no YouTube!</span>
      </>
    ),
    cta: 'Assistir no YouTube',
    ctaHref: 'https://www.youtube.com/@sovaipdc',
    ctaBg: 'bg-red-600 hover:bg-red-700',
    flag: '🎙️',
    footer: '▶️ Inscreva-se no canal · Novos episódios toda semana · @sovaipdc',
  },
  {
    id: 'plaminates',
    bg: 'from-[#2c1a0e] via-[#3d2512] to-[#1a0f07]',
    accent1: 'bg-amber-600/20',
    accent2: 'bg-yellow-400/10',
    tag: 'Empresa Associada',
    tagColor: 'text-amber-400',
    icon: Layers,
    iconBg: 'bg-amber-600',
    title: (
      <>
        <span className="text-amber-400">Suelos laminados</span>{' '}
        <span className="text-white">& vinílicos</span>
      </>
    ),
    subtitle: (
      <>
        Medición gratuita · Instalación profesional.{' '}
        <span className="text-white font-bold">Transforma tu hogar en Barcelona.</span>
      </>
    ),
    cta: 'Ver colección',
    ctaHref: 'https://tienda.plaminates.com',
    ctaBg: 'bg-amber-600 hover:bg-amber-700',
    flag: '🪵',
    footer: '✓ Medición gratis · ✓ Instalación incluida · ✓ Asesoramiento personalizado · plaminates.com',
  },
]

const DURATION = 7000

export function ElectionBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState<'left' | 'right' | null>(null)

  const goTo = useCallback((index: number, direction: 'left' | 'right') => {
    if (animating || banners.length <= 1) return
    setAnimating(direction)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(null)
    }, 400)
  }, [animating])

  const next = useCallback(() => {
    goTo((current + 1) % banners.length, 'left')
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length, 'right')
  }, [current, goTo])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(next, DURATION)
    return () => clearInterval(t)
  }, [next])

  const b = banners[current]
  const Icon = b.icon

  return (
    <section className={`relative overflow-hidden bg-gradient-to-r ${b.bg} py-10 sm:py-12 transition-colors duration-500`}>
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-16 -left-16 w-64 h-64 rounded-full ${b.accent1} blur-3xl`} />
        <div className={`absolute -bottom-16 -right-16 w-64 h-64 rounded-full ${b.accent2} blur-3xl`} />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg,#fff 0px,#fff 2px,transparent 2px,transparent 24px)`,
          }}
        />
      </div>

      {/* Slide content */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating === 'left'
            ? 'translateX(-40px)'
            : animating === 'right'
              ? 'translateX(40px)'
              : 'translateX(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Icon */}
          <div className={`shrink-0 w-16 h-16 rounded-2xl ${b.iconBg} flex items-center justify-center shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className={`${b.tagColor} text-xs font-bold uppercase tracking-widest`}>{b.tag}</span>
              <span className="text-lg leading-none" role="img" aria-label="Brasil">{b.flag}</span>
            </div>
            <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-1.5">
              {b.title}
            </h2>
            <p className="text-white/70 text-base sm:text-lg font-medium">{b.subtitle}</p>
          </div>

          {/* CTA */}
          <a
            href={b.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 inline-flex items-center gap-2 ${b.ctaBg} text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap`}
          >
            <Icon className="w-4 h-4" />
            {b.cta}
          </a>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/10 text-xs text-white/50 text-center sm:text-left">
          {b.footer}
        </div>
      </div>

      {/* Navigation dots + arrows — solo si hay más de 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Banner siguiente"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'left' : 'right')}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-4' : 'bg-white/40'}`}
                aria-label={`Ir al banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Progress bar */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            key={current}
            className="h-full bg-white/40"
            style={{ animation: `progress ${DURATION}ms linear forwards` }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}

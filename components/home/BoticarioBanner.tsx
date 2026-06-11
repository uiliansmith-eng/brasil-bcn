'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'

export function BoticarioBanner() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('boticario-banner-dismissed')
    if (isDismissed) return
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setVisible(false)
    setTimeout(() => {
      setDismissed(true)
      sessionStorage.setItem('boticario-banner-dismissed', '1')
    }, 350)
  }

  if (dismissed) return null

  return (
    <div
      className="fixed bottom-6 right-4 z-50 w-72 sm:w-80"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.2,0.64,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-200">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-[#4a1a6b] via-[#6b2fa0] to-[#8b3fcc] px-5 pt-5 pb-10">
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Novidade</span>
          </div>

          <p className="text-white/80 text-xs font-medium mb-1">Agora em Barcelona</p>
          <h3 className="text-white font-black text-xl leading-tight">
            Revendedora<br />
            <span className="text-yellow-300">O Boticário</span>
          </h3>
        </div>

        {/* Logo pill overlapping */}
        <div className="absolute left-5 bottom-[88px] flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-lg border border-purple-100">
          <span className="text-2xl">🌸</span>
          <div>
            <p className="text-[10px] text-gray-400 leading-none">Produtos</p>
            <p className="text-xs font-black text-[#4a1a6b] leading-tight">O Boticário</p>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-5 pt-10 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Perfumes, cosméticos e cuidados brasileiros entregues em Barcelona. 🇧🇷✨
          </p>
          <a
            href="https://wa.me/34652907178"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-gradient-to-r from-[#4a1a6b] to-[#8b3fcc] hover:from-[#3d1558] hover:to-[#7a35b5] text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-purple-200"
          >
            Encomendar agora →
          </a>
          <p className="text-center text-[10px] text-gray-400 mt-2.5">Via WhatsApp · Entrega em Barcelona</p>
        </div>
      </div>
    </div>
  )
}

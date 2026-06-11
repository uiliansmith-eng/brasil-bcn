import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Próximamente · Brasil BCN',
  description: 'Plataforma comunitária para brasileiros em Barcelona. Em breve!',
  robots: { index: false, follow: false },
}

export default function ProximamentePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002776] via-[#002776] to-[#001a5c] flex items-center justify-center px-4">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#009C3B]/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FFDF00]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg,#fff 0px,#fff 2px,transparent 2px,transparent 24px)`,
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-8 py-5 shadow-2xl shadow-black/30">
            <Image
              src="/brand/logo-oficial.png"
              alt="Brasil BCN"
              width={320}
              height={100}
              priority
              className="h-20 w-auto"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#009C3B] animate-pulse" />
          <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">Em construção</span>
        </div>

        {/* Message */}
        <p className="text-[#FFDF00] font-bold text-lg sm:text-xl mb-3">
          Próximamente
        </p>
        <p className="text-white/60 text-base leading-relaxed mb-10">
          A plataforma comunitária para brasileiros em Barcelona está a chegar.
          <br />
          Fique atento!
        </p>

        {/* Social hint */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/40 text-sm">
            Brasil BCN · Barcelona, Espanha
          </p>
          <a
            href="/auth/login"
            className="inline-block mt-6 text-white/20 hover:text-white/50 text-xs transition-colors"
          >
            Acceso admin
          </a>
        </div>
      </div>
    </div>
  )
}

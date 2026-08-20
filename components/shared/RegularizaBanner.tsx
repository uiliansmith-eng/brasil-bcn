import { ShieldCheck, ArrowUpRight } from 'lucide-react'

const REGULARIZA_URL = 'https://regulariza.appstles.com'

export function RegularizaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#111c4e] via-[#16205a] to-[#0d1640] py-10 sm:py-12">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-[#c60b1e]/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-[#ffc400]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Icon */}
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#c60b1e] flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-[#ffc400] text-xs font-bold uppercase tracking-widest">Servicio recomendado</span>
              <span className="text-lg leading-none" role="img" aria-label="España">🇪🇸</span>
            </div>
            <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-1.5">
              ¿Acabas de llegar a Barcelona o no sabes{' '}
              <span className="text-[#ffc400]">cómo regularizarte</span>?
            </h2>
            <p className="text-white/70 text-base sm:text-lg font-medium">
              Con <span className="text-white font-bold">Regulariza</span> entiendes tu situación migratoria y las vías disponibles: arraigo, NIE, residencia y más.
            </p>
          </div>

          {/* CTA */}
          <a
            href={REGULARIZA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#c60b1e] hover:bg-[#a3091a] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
          >
            Descubre cómo regularizarte
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <p className="mt-6 pt-5 border-t border-white/10 text-xs text-white/50 text-center sm:text-left">
          Regulariza es un servicio independiente de orientación migratoria · No constituye asesoramiento jurídico
        </p>
      </div>
    </section>
  )
}

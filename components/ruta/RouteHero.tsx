interface Props {
  totalSteps: number
}

export function RouteHero({ totalSteps }: Props) {
  return (
    <section className="relative bg-[#002776] overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#009C3B]/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#FFDF00]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-6xl sm:text-7xl mb-6">🇧🇷</div>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
          Acabo de llegar a{' '}
          <span className="text-[#FFDF00]">Barcelona</span>
        </h1>
        <p className="text-blue-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto">
          Te acompañamos paso a paso durante tus primeras semanas en España.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: '✅', text: `${totalSteps} pasos esenciales` },
            { icon: '⏱', text: '~2 semanas' },
            { icon: '🆓', text: 'Completamente gratuito' },
          ].map(({ icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/80"
            >
              <span>{icon}</span> {text}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full">
          <path d="M0 40L1440 40L1440 10C1200 35 960 5 720 20C480 35 240 5 0 20Z" fill="#F9FAFB" />
        </svg>
      </div>
    </section>
  )
}

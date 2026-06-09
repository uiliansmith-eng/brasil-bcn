import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#002776]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a5c] via-[#002776] to-[#003a99]" />
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-[#009C3B]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFDF00]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-white font-black text-sm">BR</span>
            </div>
            <span className="font-black text-xl text-white tracking-tight">
              Brasil<span className="text-[#FFDF00]">BCN</span>
            </span>
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8 text-5xl">🇧🇷</div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              A maior comunidade
              <span className="block text-[#FFDF00]">brasileira</span>
              <span className="block text-white/80 text-3xl font-bold">em Barcelona</span>
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-10">
              Empleos, empresas, eventos y toda la ayuda que necesitas para vivir en Cataluña.
            </p>

            {/* Features */}
            <ul className="space-y-4">
              {[
                { emoji: '💼', text: '180+ empleos activos' },
                { emoji: '🏢', text: '320+ empresas brasileñas' },
                { emoji: '🎉', text: 'Eventos cada semana' },
                { emoji: '📖', text: 'Guía completa de trámites' },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <span className="text-xl">{f.emoji}</span>
                  <span className="text-blue-100 font-medium">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <p className="text-blue-100 text-sm leading-relaxed mb-4 italic">
              &ldquo;Encontrei meu emprego aqui em duas semanas. A comunidade é incrível, sempre dispostos a ajudar.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#009C3B] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Ana Oliveira</p>
                <p className="text-blue-300 text-xs">São Paulo → Barcelona, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col min-h-screen bg-white">
        {/* Mobile logo */}
        <div className="flex items-center justify-between p-6 lg:hidden border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#009C3B] to-[#002776] flex items-center justify-center">
              <span className="text-white font-black text-xs">BR</span>
            </div>
            <span className="font-black text-lg">
              <span className="text-gray-900">Brasil</span>
              <span className="text-[#009C3B]">BCN</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} BrasilBCN ·{' '}
            <Link href="/privacidad" className="hover:text-gray-600">Privacidad</Link>
            {' · '}
            <Link href="/terminos" className="hover:text-gray-600">Términos</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

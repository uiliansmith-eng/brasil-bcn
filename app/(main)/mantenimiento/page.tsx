import Link from 'next/link'

export default function MantenimientoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002776] px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-7xl mb-8">🇧🇷</div>
        <h1 className="text-4xl font-black text-white mb-4">
          Estamos preparando<br />
          <span className="text-[#FFDF00]">algo nuevo</span>
        </h1>
        <p className="text-blue-200 text-lg leading-relaxed mb-10">
          Brasil BCN está en mantenimiento. Volvemos pronto con novedades para la comunidad brasileña en Barcelona.
        </p>
        <p className="text-blue-300/60 text-sm">
          ¿Eres del equipo?{' '}
          <Link href="/auth/login" className="text-white/70 hover:text-white underline transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

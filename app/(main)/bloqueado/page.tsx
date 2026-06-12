import Link from 'next/link'
import { ShieldBan } from 'lucide-react'

export default function BloqueadoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldBan className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Cuenta suspendida</h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Tu cuenta ha sido suspendida por incumplimiento de las normas de la comunidad.
          Si crees que es un error, contáctanos.
        </p>
        <a
          href="mailto:admin@brasilbcn.com"
          className="inline-block bg-[#002776] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#001a5c] transition-colors"
        >
          Contactar soporte
        </a>
        <p className="mt-4">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-gray-600">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

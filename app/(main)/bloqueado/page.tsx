import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Cuenta bloqueada — BrasilBCN' }

export default function BloqueadoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-2">Cuenta suspendida</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Tu cuenta ha sido suspendida por incumplimiento de las normas de la comunidad. Si crees que es un error, contáctanos.
        </p>
        <a
          href="mailto:admin@brasilbcn.com"
          className="inline-flex items-center gap-2 bg-[#002776] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#001a5c] transition-colors"
        >
          Contactar soporte
        </a>
        <div className="mt-4">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

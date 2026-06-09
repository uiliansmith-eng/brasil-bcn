import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Building2 } from 'lucide-react'
import { RegisterCompanyForm } from '@/components/empresas/RegisterCompanyForm'

export const metadata: Metadata = {
  title: 'Registrar empresa — BrasilBCN',
  description: 'Registra tu empresa o negocio brasileño en el directorio de BrasilBCN y llega a miles de brasileños en Cataluña.',
}

export default function RegisterCompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] to-[#001a5c] pt-12 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/empresas"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al directorio
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-medium">Empresas · Registro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Registra tu empresa
          </h1>
          <p className="text-blue-200 text-lg">
            Llega a miles de brasileños en Cataluña. Gratis.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <RegisterCompanyForm />
      </div>
    </div>
  )
}

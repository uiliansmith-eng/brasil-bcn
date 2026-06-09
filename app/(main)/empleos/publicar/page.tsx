import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'
import { PublishJobForm } from '@/components/empleos/PublishJobForm'

export const metadata: Metadata = {
  title: 'Publicar empleo gratis',
  description: 'Publica tu oferta de empleo gratis en BrasilBCN y llega a miles de brasileños en Barcelona.',
}

export default function PublicarEmpleoPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <Link
          href="/empleos"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a empleos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#009C3B]/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#009C3B]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Publicar empleo</h1>
              <p className="text-gray-500 text-sm">Gratis · Revisión en menos de 24h</p>
            </div>
          </div>
        </div>

        <PublishJobForm />
      </div>
    </div>
  )
}

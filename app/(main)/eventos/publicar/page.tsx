import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { PublishEventForm } from '@/components/eventos/PublishEventForm'

export const metadata: Metadata = {
  title: 'Publicar evento — BrasilBCN',
  description: 'Publica tu evento brasileño en Barcelona: fiestas, cultura, gastronomía, networking y más.',
}

export default function PublishEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#002776] to-[#001a5c] pt-12 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a eventos
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-medium">Eventos · Publicar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Publica tu evento
          </h1>
          <p className="text-blue-200 text-lg">
            Llega a toda la comunidad brasileña en Cataluña.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <PublishEventForm />
      </div>
    </div>
  )
}

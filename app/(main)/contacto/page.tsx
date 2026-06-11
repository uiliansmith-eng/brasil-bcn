import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle, MapPin, Clock, ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto — BrasilBCN',
  description: 'Ponte en contacto con el equipo de BrasilBCN',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#002776] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-black">Contacto</h1>
          <p className="text-blue-200 mt-2">Estamos aquí para ayudarte</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Email */}
          <a
            href="mailto:hola@brasilbcn.com"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#002776]/10 flex items-center justify-center shrink-0 group-hover:bg-[#002776]/20 transition-colors">
              <Mail className="w-6 h-6 text-[#002776]" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Email</p>
              <p className="text-[#009C3B] text-sm font-medium mt-0.5">hola@brasilbcn.com</p>
              <p className="text-gray-400 text-xs mt-1">Respondemos en menos de 24h</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
              <MessageCircle className="w-6 h-6 text-[#009C3B]" />
            </div>
            <div>
              <p className="font-bold text-gray-900">WhatsApp</p>
              <p className="text-[#009C3B] text-sm font-medium mt-0.5">+34 600 000 000</p>
              <p className="text-gray-400 text-xs mt-1">Lunes a viernes, 9h–18h</p>
            </div>
          </a>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#002776]" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Ubicación</p>
              <p className="text-gray-600 text-sm mt-0.5">Barcelona, Cataluña</p>
              <p className="text-gray-400 text-xs mt-1">España 🇪🇸</p>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[#002776]" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Horario</p>
              <p className="text-gray-600 text-sm mt-0.5">Lunes – Viernes</p>
              <p className="text-gray-400 text-xs mt-1">9:00 – 18:00 (CET)</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-black text-gray-900 mb-6">Preguntas frecuentes</h2>

          <div className="space-y-5">
            {[
              {
                q: '¿Cómo publico una oferta de empleo?',
                a: 'Regístrate o inicia sesión, ve a la sección Empleos y haz clic en "Publicar oferta". Tu publicación será revisada y aprobada en menos de 24 horas.',
              },
              {
                q: '¿Es gratuito usar BrasilBCN?',
                a: 'Sí, el registro y el uso básico de la plataforma son completamente gratuitos. Publicar empleos, eventos y anuncios no tiene coste.',
              },
              {
                q: '¿Cuánto tardan en aprobar mi publicación?',
                a: 'Revisamos todas las publicaciones manualmente. El tiempo habitual de aprobación es inferior a 24 horas en días laborables.',
              },
              {
                q: '¿Puedo eliminar mi cuenta?',
                a: 'Sí. Escríbenos a hola@brasilbcn.com solicitando la eliminación de tu cuenta y tus datos serán borrados en un plazo de 30 días.',
              },
              {
                q: '¿Cómo reporto contenido inapropiado?',
                a: 'Escríbenos directamente a hola@brasilbcn.com indicando la URL del contenido. Lo revisaremos a la mayor brevedad.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-900 text-sm mb-1.5">{q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 p-6 bg-[#002776] rounded-2xl text-white text-center">
          <p className="text-lg font-black mb-1">¿No encontraste lo que buscabas?</p>
          <p className="text-blue-200 text-sm mb-4">Escríbenos directamente y te respondemos en menos de 24 horas</p>
          <a
            href="mailto:hola@brasilbcn.com"
            className="inline-flex items-center gap-2 bg-[#FFDF00] text-[#002776] font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
          >
            <Mail className="w-4 h-4" /> hola@brasilbcn.com
          </a>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateAdForm } from '@/components/admin/CreateAdForm'

export const metadata: Metadata = { title: 'Nuevo anuncio — Admin' }

export default function NuevoAnuncioPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/publicidad" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a publicidad
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Nuevo anuncio</h1>
        <p className="text-gray-500 text-sm mt-1">Los anuncios se activan automáticamente al guardar</p>
      </div>
      <CreateAdForm />
    </div>
  )
}

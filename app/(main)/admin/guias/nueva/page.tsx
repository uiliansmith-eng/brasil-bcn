import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateGuideForm } from '@/components/admin/CreateGuideForm'

export const metadata: Metadata = { title: 'Nueva guía — Admin' }

export default function NuevaGuiaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/guias" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a guías
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Nueva guía</h1>
        <p className="text-gray-500 text-sm mt-1">El tiempo de lectura se calcula automáticamente</p>
      </div>
      <CreateGuideForm />
    </div>
  )
}

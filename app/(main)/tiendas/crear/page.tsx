import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateStoreForm } from '@/components/tiendas/CreateStoreForm'
import { ActivateStoreForm } from '@/components/tiendas/ActivateStoreForm'
import { getMyCompany } from '@/actions/stores'

export const metadata: Metadata = { title: 'Crear mi tienda — Brasil BCN' }

export default async function CrearTiendaPage() {
  const company = await getMyCompany()

  if (company?.is_store) {
    redirect('/dashboard/tienda')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/tiendas" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a tiendas
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            {company ? 'Activar mi tienda' : 'Crear mi tienda'}
          </h1>
          <p className="text-gray-500">
            {company
              ? 'Ya tienes una empresa registrada — solo faltan unos detalles para convertirla en tienda.'
              : 'Completa la información de tu negocio para publicarlo dentro de Brasil BCN.'}
          </p>
        </div>

        {company ? (
          <ActivateStoreForm companyId={company.id} companyName={company.name} companySlug={company.slug} />
        ) : (
          <CreateStoreForm />
        )}
      </div>
    </div>
  )
}

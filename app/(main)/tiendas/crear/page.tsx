import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateStoreForm } from '@/components/tiendas/CreateStoreForm'
import { ActivateStoreForm } from '@/components/tiendas/ActivateStoreForm'
import { getMyCompanies } from '@/actions/stores'

export const metadata: Metadata = { title: 'Crear mi tienda — Brasil BCN' }

export default async function CrearTiendaPage() {
  const companies = await getMyCompanies()
  // Empresa registrada en el directorio general (/empresas/registrar)
  // que todavía no se activó como tienda — se ofrece activarla en
  // vez de crear una tienda nueva desde cero.
  const nonStoreCompany = companies.find((c) => !c.is_store)
  const hasStores = companies.some((c) => c.is_store)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link href="/tiendas" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a tiendas
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            {nonStoreCompany ? 'Activar mi tienda' : hasStores ? 'Crear otra tienda' : 'Crear mi tienda'}
          </h1>
          <p className="text-gray-500">
            {nonStoreCompany
              ? 'Ya tienes una empresa registrada — solo faltan unos detalles para convertirla en tienda.'
              : hasStores
                ? 'Puedes tener varias tiendas en Brasil BCN. Completa los datos del nuevo negocio.'
                : 'Completa la información de tu negocio para publicarlo dentro de Brasil BCN.'}
          </p>
        </div>

        {nonStoreCompany ? (
          <ActivateStoreForm companyId={nonStoreCompany.id} companyName={nonStoreCompany.name} companySlug={nonStoreCompany.slug} />
        ) : (
          <CreateStoreForm />
        )}
      </div>
    </div>
  )
}

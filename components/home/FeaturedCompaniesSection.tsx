import Link from 'next/link'
import { MapPin, ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCompanies } from '@/actions/companies'
import { COMPANY_CATEGORY_LABELS } from '@/lib/constants'
import type { CompanyCategory } from '@/types'

const categoryColors: Record<string, string> = {
  restaurantes: 'bg-orange-50 text-orange-600',
  abogados: 'bg-blue-50 text-blue-600',
  peluquerias: 'bg-pink-50 text-pink-600',
  tiendas: 'bg-green-50 text-green-600',
  construccion: 'bg-yellow-50 text-yellow-700',
  contables: 'bg-purple-50 text-purple-600',
  transporte: 'bg-sky-50 text-sky-600',
  educacion: 'bg-teal-50 text-teal-600',
  salud: 'bg-red-50 text-red-600',
  tecnologia: 'bg-indigo-50 text-indigo-600',
  otro: 'bg-gray-50 text-gray-600',
}

type FeaturedCompany = {
  id: string
  name: string
  slug: string
  category: CompanyCategory
  city: string
  logo_url: string | null
  is_verified: boolean
}

export async function FeaturedCompaniesSection() {
  const { companies } = await getCompanies({})
  const featured = (companies as FeaturedCompany[]).slice(0, 6)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#002776] font-semibold text-sm uppercase tracking-wider mb-3">
              Directório de empresas
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Empresas destacadas
            </h2>
          </div>
          <Link href="/empresas">
            <Button variant="outline" className="group border-[#002776] text-[#002776] hover:bg-[#002776] hover:text-white transition-all">
              Ver directorio completo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-[#002776]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[#002776]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Aún no hay empresas registradas</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              ¿Tienes un negocio brasileño en Barcelona? Regístralo gratis y llega a toda la comunidad.
            </p>
            <Link href="/empresas/registrar">
              <Button className="bg-[#002776] hover:bg-[#001a5c] text-white font-semibold">
                <Building2 className="w-4 h-4 mr-2" />
                Registrar mi empresa
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((company) => (
              <Link
                key={company.id}
                href={`/empresas/${company.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#002776]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                    {company.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={company.logo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-[#002776] transition-colors">
                        {company.name}
                      </h3>
                      {company.is_verified && (
                        <span className="shrink-0 w-4 h-4 bg-[#009C3B] rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[company.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {COMPANY_CATEGORY_LABELS[company.category]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.city}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

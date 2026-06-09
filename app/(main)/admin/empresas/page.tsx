import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, ExternalLink } from 'lucide-react'
import { getPendingCompanies, approveCompanyAction, rejectCompanyAction } from '@/actions/admin'
import { COMPANY_CATEGORY_LABELS } from '@/lib/constants'

export const metadata: Metadata = { title: 'Empresas pendientes — Admin' }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}

export default async function AdminEmpresasPage() {
  const companies = await getPendingCompanies()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Empresas pendientes</h1>
        <p className="text-gray-500 text-sm mt-1">{companies.length} empresa{companies.length !== 1 ? 's' : ''} esperando revisión</p>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Todo al día</p>
          <p className="text-gray-400 text-sm">No hay empresas pendientes de revisión</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((company) => {
            const owner = company.owner as { full_name?: string } | null
            return (
              <div key={company.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#002776]/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#002776]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 truncate">{company.name}</p>
                    <Link href={`/empresas/${company.id}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 shrink-0" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400">
                    {COMPANY_CATEGORY_LABELS[company.category as keyof typeof COMPANY_CATEGORY_LABELS] ?? company.category}
                    {' · '}{company.city}
                    {owner?.full_name && ` · por ${owner.full_name}`}
                    {' · '}{timeAgo(company.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form action={approveCompanyAction}>
                    <input type="hidden" name="id" value={company.id} />
                    <button type="submit" className="px-4 py-1.5 text-sm font-semibold bg-[#009C3B] hover:bg-[#007a2f] text-white rounded-lg transition-colors">
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectCompanyAction}>
                    <input type="hidden" name="id" value={company.id} />
                    <button type="submit" className="px-4 py-1.5 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

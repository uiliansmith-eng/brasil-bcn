import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Store, Plus, CheckCircle2, Clock } from 'lucide-react'
import { getMyCompanies } from '@/actions/stores'

export const metadata: Metadata = { title: 'Mis tiendas — Brasil BCN' }

export default async function MisTiendasPage() {
  const companies = await getMyCompanies()
  const stores = companies.filter((c) => c.is_store)

  if (stores.length === 0) redirect('/tiendas/crear')
  if (stores.length === 1) redirect(`/dashboard/tienda/${stores[0].id}`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-900">Mis tiendas</h1>
        <Link
          href="/tiendas/crear"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]"
        >
          <Plus className="w-4 h-4" /> Crear otra tienda
        </Link>
      </div>

      <div className="space-y-3">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/dashboard/tienda/${store.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#009C3B]/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#002776]/10 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-[#002776]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{store.name}</p>
              <p className="text-xs text-gray-400">{store.city}</p>
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${store.is_approved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              {store.is_approved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {store.is_approved ? 'Aprobada' : 'En revisión'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

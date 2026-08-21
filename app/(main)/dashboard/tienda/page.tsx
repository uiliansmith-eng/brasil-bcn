import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Eye, Clock, CheckCircle2, ShoppingBag, CalendarClock } from 'lucide-react'
import { getMyCompany, getMyStoreItems, getMyCoupons, getMyStoreModules } from '@/actions/stores'
import { StoreInfoEditor } from '@/components/tiendas/StoreInfoEditor'
import { StoreItemsManager } from '@/components/tiendas/StoreItemsManager'
import { CouponsManager } from '@/components/tiendas/CouponsManager'
import { StoreModulesManager } from '@/components/tiendas/StoreModulesManager'
import { StoreAvailabilityManager } from '@/components/tiendas/StoreAvailabilityManager'
import { QrRedeemPanel } from '@/components/tiendas/QrRedeemPanel'

export const metadata: Metadata = { title: 'Mi tienda — Brasil BCN' }

const PLAN_LABELS: Record<string, string> = { free: 'Free', business: 'Business', premium: 'Premium' }

export default async function MiTiendaPage() {
  const company = await getMyCompany()

  if (!company || !company.is_store) {
    redirect('/tiendas/crear')
  }

  const [items, coupons, modules] = await Promise.all([
    getMyStoreItems(company.id),
    getMyCoupons(company.id),
    getMyStoreModules(company.id),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mi tienda</h1>
          <p className="text-gray-500 text-sm mt-1">{company.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/tienda/pedidos"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Pedidos
          </Link>
          <Link
            href="/dashboard/tienda/reservas"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            <CalendarClock className="w-3.5 h-3.5" /> Reservas
          </Link>
          {company.is_approved && (
            <Link
              href={`/tiendas/${company.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]"
            >
              Ver tienda pública <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          {company.is_approved ? (
            <CheckCircle2 className="w-5 h-5 text-[#009C3B] mx-auto mb-1.5" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
          )}
          <p className="text-xs font-semibold text-gray-900">{company.is_approved ? 'Aprobada' : 'En revisión'}</p>
          <p className="text-[10px] text-gray-400">Estado</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-gray-900">{company.views ?? 0}</p>
          <p className="text-[10px] text-gray-400">Visualizaciones</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <div className="w-5 h-5 rounded-full bg-[#002776]/10 text-[#002776] text-[10px] font-black flex items-center justify-center mx-auto mb-1.5">
            {(PLAN_LABELS[company.store_plan] ?? 'Free')[0]}
          </div>
          <p className="text-xs font-semibold text-gray-900">{PLAN_LABELS[company.store_plan] ?? 'Free'}</p>
          <p className="text-[10px] text-gray-400">Plan</p>
        </div>
      </div>

      {!company.is_approved && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            Tu tienda está pendiente de aprobación. Mientras tanto puedes ir preparando tu catálogo y cupones.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <StoreInfoEditor company={company} />
        <StoreModulesManager companyId={company.id} modules={modules} />
        <StoreAvailabilityManager companyId={company.id} />
        <StoreItemsManager companyId={company.id} items={items} />
        <CouponsManager companyId={company.id} coupons={coupons} />
        {modules.some((m) => m.module_key === 'qr' && m.is_active) && (
          <QrRedeemPanel companyId={company.id} />
        )}
      </div>
    </div>
  )
}

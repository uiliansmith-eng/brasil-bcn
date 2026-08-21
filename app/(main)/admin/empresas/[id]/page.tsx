import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Globe, Phone, MessageCircle, Mail, AtSign, Building2, Store, Tag, Ticket } from 'lucide-react'
import { getCompanyForAdmin, approveCompanyAction, rejectCompanyAction } from '@/actions/admin'
import { COMPANY_CATEGORY_LABELS, STORE_ITEM_TYPE_LABELS } from '@/lib/constants'
import type { CompanyCategory, StoreItem, Coupon } from '@/types'

export const metadata: Metadata = { title: 'Revisar empresa — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminCompanyDetailPage({ params }: PageProps) {
  const { id } = await params
  const company = await getCompanyForAdmin(id)
  if (!company) notFound()

  const catLabel = COMPANY_CATEGORY_LABELS[company.category as CompanyCategory] ?? company.category
  const owner = company.owner as { full_name?: string; email?: string } | null
  const items = (company.items ?? []) as StoreItem[]
  const coupons = (company.coupons ?? []) as Coupon[]

  return (
    <div className="space-y-6">
      <Link
        href="/admin/empresas"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a pendientes
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-[#002776]/10 to-[#009C3B]/10 flex items-center justify-center relative">
          {company.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.cover_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-12 h-12 text-[#002776]/20" />
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border flex items-center justify-center shrink-0 -mt-14 bg-white shadow-sm">
              {company.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{company.name}</h1>
                {company.is_store && (
                  <span className="flex items-center gap-1 text-xs font-bold bg-[#009C3B]/10 text-[#009C3B] px-2.5 py-1 rounded-full shrink-0">
                    <Store className="w-3 h-3" /> Tienda
                  </span>
                )}
              </div>
              <p className="text-gray-600 font-medium">
                {owner?.full_name && `por ${owner.full_name}`}{owner?.email && ` (${owner.email})`}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{company.address ? `${company.address}, ${company.city}` : company.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-sm font-semibold bg-[#002776]/10 text-[#002776] px-2.5 py-1 rounded-full">{catLabel}</span>
            </div>
          </div>

          {company.description && (
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{company.description}</p>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            {company.whatsapp && (
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" /> {company.whatsapp}
              </span>
            )}
            {company.phone && (
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4" /> {company.phone}
              </span>
            )}
            {company.email && (
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" /> {company.email}
              </span>
            )}
            {company.instagram && (
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <AtSign className="w-4 h-4" /> {company.instagram}
              </span>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#009C3B] hover:underline">
                <Globe className="w-4 h-4" /> Web
              </a>
            )}
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
            <form action={approveCompanyAction}>
              <input type="hidden" name="id" value={company.id} />
              <button type="submit" className="px-5 py-2 text-sm font-semibold bg-[#009C3B] hover:bg-[#007a2f] text-white rounded-lg transition-colors">
                Aprobar
              </button>
            </form>
            <form action={rejectCompanyAction}>
              <input type="hidden" name="id" value={company.id} />
              <button type="submit" className="px-5 py-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                Rechazar
              </button>
            </form>
          </div>
        </div>
      </div>

      {company.is_store && coupons.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#009C3B]" /> Cupones ({coupons.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm font-medium text-gray-700">{coupon.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="font-mono font-semibold text-gray-600">{coupon.code}</span>
                  {' · '}{coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `${coupon.discount_value}€`}
                  {!coupon.is_active && ' · pausado'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {company.is_store && items.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#009C3B]" /> Productos y servicios ({items.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {STORE_ITEM_TYPE_LABELS[item.item_type]}
                    {item.price !== null && ` · ${item.price}€`}
                    {!item.is_active && ' · oculto'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

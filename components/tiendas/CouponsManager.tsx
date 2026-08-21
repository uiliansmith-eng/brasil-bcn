'use client'

import { useState } from 'react'
import { Plus, Ticket } from 'lucide-react'
import { CouponForm } from './CouponForm'
import { deleteCouponAction, toggleCouponActiveAction } from '@/actions/stores'
import type { Coupon } from '@/types'

interface CouponsManagerProps {
  companyId: string
  coupons: Coupon[]
}

function formatDiscount(coupon: Coupon): string {
  return coupon.discount_type === 'percentage'
    ? `${coupon.discount_value}%`
    : `${coupon.discount_value}€`
}

export function CouponsManager({ companyId, coupons }: CouponsManagerProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-gray-900 text-lg">Cupones</h2>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#009C3B] hover:text-[#007a2f]"
          >
            <Plus className="w-4 h-4" /> Crear cupón
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-5">
          <CouponForm companyId={companyId} onDone={() => setShowForm(false)} />
        </div>
      )}

      {coupons.length === 0 ? (
        <div className="text-center py-10">
          <Ticket className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Todavía no creaste ningún cupón.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#009C3B]/10 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4 text-[#009C3B]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{coupon.title}</p>
                <p className="text-xs text-gray-400">
                  <span className="font-mono font-semibold text-gray-600">{coupon.code}</span>
                  {' · '}{formatDiscount(coupon)} de descuento
                  {coupon.max_uses && ` · ${coupon.used_count}/${coupon.max_uses} usos`}
                </p>
              </div>

              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${coupon.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {coupon.is_active ? 'Activo' : 'Pausado'}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <form action={toggleCouponActiveAction}>
                  <input type="hidden" name="id" value={coupon.id} />
                  <input type="hidden" name="is_active" value={String(coupon.is_active)} />
                  <button type="submit" className="px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">
                    {coupon.is_active ? 'Pausar' : 'Activar'}
                  </button>
                </form>
                <form action={deleteCouponAction}>
                  <input type="hidden" name="id" value={coupon.id} />
                  <button type="submit" className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 rounded-lg">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

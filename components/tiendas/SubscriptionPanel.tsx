'use client'

import { useState, useTransition } from 'react'
import { Loader2, CreditCard, Check } from 'lucide-react'
import { subscribeToPlanAction } from '@/actions/subscriptions'
import { cn } from '@/lib/utils'
import type { SubscriptionPlan, StorePlan } from '@/types'

interface SubscriptionPanelProps {
  companyId: string
  plans: SubscriptionPlan[]
  currentPlanKey: StorePlan
}

export function SubscriptionPanel({ companyId, plans, currentPlanKey }: SubscriptionPanelProps) {
  const [isPending, startTransition] = useTransition()
  const [selecting, setSelecting] = useState<string | null>(null)

  const handleSelect = (planKey: StorePlan) => {
    setSelecting(planKey)
    startTransition(async () => {
      await subscribeToPlanAction(companyId, planKey)
      setSelecting(null)
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#009C3B]" /> Plan de suscripción
      </h2>
      <p className="text-gray-400 text-sm mb-5">
        Brasil BCN solo cobra la suscripción de tu tienda — nunca una comisión sobre tus ventas.
      </p>

      <div className="grid sm:grid-cols-3 gap-3">
        {plans.map((plan) => {
          const isCurrent = plan.key === currentPlanKey
          const features = (plan.features ?? {}) as Record<string, unknown>
          return (
            <div key={plan.id} className={cn('rounded-xl border p-4', isCurrent ? 'border-[#009C3B] bg-[#009C3B]/5' : 'border-gray-100')}>
              <p className="font-bold text-gray-900">{plan.name}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {plan.price > 0 ? `${plan.price}€` : 'Gratis'}
                {plan.price > 0 && <span className="text-xs font-normal text-gray-400">/mes</span>}
              </p>
              <ul className="text-xs text-gray-500 mt-3 space-y-1">
                {features.items_limit !== undefined && (
                  <li>{features.items_limit === null ? 'Productos ilimitados' : `Hasta ${features.items_limit} productos`}</li>
                )}
                {features.coupons ? <li>Cupones</li> : null}
                {features.bookings ? <li>Reservas</li> : null}
                {features.qr ? <li>Cupones QR</li> : null}
                {features.promotions ? <li>Promociones</li> : null}
              </ul>
              <button
                type="button"
                disabled={isCurrent || isPending}
                onClick={() => handleSelect(plan.key as StorePlan)}
                className={cn(
                  'w-full mt-4 h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5',
                  isCurrent ? 'bg-gray-100 text-gray-400' : 'bg-[#009C3B] hover:bg-[#007a2f] text-white'
                )}
              >
                {selecting === plan.key ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isCurrent ? (
                  <><Check className="w-3.5 h-3.5" /> Plan actual</>
                ) : (
                  'Seleccionar'
                )}
              </button>
            </div>
          )
        })}
      </div>

      {currentPlanKey !== 'free' && (
        <p className="text-xs text-gray-400 mt-4">
          El cobro real de este plan se activará en cuanto Brasil BCN conecte el sistema de pagos. Mientras tanto, tu selección queda registrada.
        </p>
      )}
    </div>
  )
}

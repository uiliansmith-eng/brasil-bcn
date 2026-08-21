'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { StorePlan } from '@/types'

export async function getSubscriptionPlans() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  return data ?? []
}

export async function getMySubscription(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('*, plan:subscription_plans(*)')
    .eq('company_id', companyId)
    .maybeSingle()

  return data
}

// No hay pasarela de pago conectada todavía (falta que Brasil BCN
// conecte una cuenta Stripe): esto registra la intención real del
// dueño de cambiar de plan, no un cobro. Los planes de pago quedan
// en estado 'trialing' hasta que se active la facturación real.
export async function subscribeToPlanAction(companyId: string, planKey: StorePlan): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient()

  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('key', planKey)
    .maybeSingle()

  if (!plan) return { error: 'Plan no encontrado.' }

  const status = planKey === 'free' ? 'active' : 'trialing'

  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({ company_id: companyId, plan_id: plan.id, status }, { onConflict: 'company_id' })

  if (subError) return { error: 'Error al cambiar de plan. Inténtalo de nuevo.' }

  await supabase.from('companies').update({ store_plan: planKey }).eq('id', companyId)

  revalidatePath('/dashboard/tienda')
  return { ok: true }
}

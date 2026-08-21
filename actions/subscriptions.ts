'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/email'
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

// Plan de pago: crea una sesión de Stripe Checkout real. El estado
// definitivo de la suscripción (active/past_due/canceled) lo fija el
// webhook (app/api/webhooks/stripe/route.ts) cuando Stripe confirma
// el pago — esta acción solo abre la sesión de cobro.
export async function createCheckoutSessionAction(companyId: string, planKey: StorePlan): Promise<{ error: string } | { ok: true; url: string }> {
  if (planKey === 'free') return { error: 'El plan Free no requiere pago.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('id', companyId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!company) return { error: 'No tienes permiso sobre esta tienda.' }

  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('id, stripe_price_id')
    .eq('key', planKey)
    .maybeSingle()

  if (!plan?.stripe_price_id) return { error: 'Este plan todavía no está disponible para pago online.' }

  const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).maybeSingle()

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('company_id', companyId)
    .maybeSingle()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      customer: existingSub?.stripe_customer_id ?? undefined,
      customer_email: existingSub?.stripe_customer_id ? undefined : (profile?.email ?? undefined),
      client_reference_id: companyId,
      metadata: { company_id: companyId, plan_key: planKey },
      subscription_data: { metadata: { company_id: companyId, plan_key: planKey } },
      success_url: absoluteUrl(`/dashboard/tienda/${companyId}?checkout=success`),
      cancel_url: absoluteUrl(`/dashboard/tienda/${companyId}?checkout=cancelled`),
    })

    if (!session.url) return { error: 'Error al crear la sesión de pago. Inténtalo de nuevo.' }
    return { ok: true, url: session.url }
  } catch {
    return { error: 'Error al conectar con Stripe. Inténtalo de nuevo.' }
  }
}

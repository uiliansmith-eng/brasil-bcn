import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

// Sin sesión de usuario (Stripe llama directo, sin cookies): hace
// falta la service role para escribir sin pasar por RLS, mismo
// patrón que los crons en app/api/cron/*.
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function mapStripeStatus(status: Stripe.Subscription.Status): 'active' | 'past_due' | 'canceled' | 'trialing' {
  switch (status) {
    case 'active': return 'active'
    case 'trialing': return 'trialing'
    case 'past_due': return 'past_due'
    case 'canceled': return 'canceled'
    default: return 'past_due'
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = serviceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const companyId = session.metadata?.company_id ?? session.client_reference_id
      const planKey = session.metadata?.plan_key
      if (!companyId || !session.subscription || !session.customer) break

      const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const { data: plan } = await supabase.from('subscription_plans').select('id').eq('key', planKey).maybeSingle()
      if (!plan) break

      await supabase.from('subscriptions').upsert({
        company_id: companyId,
        plan_id: plan.id,
        status: mapStripeStatus(stripeSubscription.status),
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: session.customer as string,
        current_period_end: new Date(stripeSubscription.items.data[0].current_period_end * 1000).toISOString(),
      }, { onConflict: 'company_id' })

      if (planKey) await supabase.from('companies').update({ store_plan: planKey }).eq('id', companyId)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({
          status: mapStripeStatus(sub.status),
          current_period_end: new Date(sub.items.data[0].current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: row } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', sub.id)
        .select('company_id')
        .maybeSingle()

      if (row) await supabase.from('companies').update({ store_plan: 'free' }).eq('id', row.company_id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.parent?.subscription_details?.subscription
      if (subscriptionId) {
        const id = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id
        await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

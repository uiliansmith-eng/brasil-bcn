import Stripe from 'stripe'

// Solo se usa server-side (Server Actions, webhook route) — nunca
// se expone al cliente. La clave determina test/live automáticamente
// (sk_test_... vs sk_live_...), sin que el código necesite saberlo.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-07-29.dahlia',
})

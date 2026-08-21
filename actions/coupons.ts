'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

// ─── CLIENTE: RECLAMAR / VER MI QR ──────────────────────────────

export async function getMyQrCode(couponId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('coupon_id', couponId)
    .eq('user_id', user.id)
    .eq('status', 'issued')
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export async function claimCouponQrAction(couponId: string): Promise<{ error: string } | { ok: true; code: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para obtener el cupón QR.' }

  const withinLimit = await checkRateLimit('claim_qr', user.id, 20, 3600)
  if (!withinLimit) return { error: 'Demasiados cupones QR reclamados. Inténtalo de nuevo más tarde.' }

  const { data: coupon } = await supabase
    .from('coupons')
    .select('id, is_active, starts_at, ends_at, max_uses, used_count, company_id')
    .eq('id', couponId)
    .maybeSingle()

  if (!coupon || !coupon.is_active) return { error: 'Este cupón ya no está disponible.' }
  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) return { error: 'Este cupón todavía no está activo.' }
  if (coupon.ends_at && new Date(coupon.ends_at) < new Date()) return { error: 'Este cupón ya venció.' }
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) return { error: 'Este cupón ya alcanzó el límite de usos.' }

  const { data: moduleRow } = await supabase
    .from('store_modules')
    .select('is_active')
    .eq('company_id', coupon.company_id)
    .eq('module_key', 'qr')
    .maybeSingle()

  if (!moduleRow?.is_active) return { error: 'Esta tienda no tiene activados los cupones QR.' }

  const existing = await getMyQrCode(couponId)
  if (existing) return { ok: true, code: existing.code }

  const { data: qr, error } = await supabase
    .from('qr_codes')
    .insert({ coupon_id: couponId, user_id: user.id })
    .select('code')
    .single()

  if (error || !qr) return { error: 'Error al generar el cupón QR. Inténtalo de nuevo.' }

  await supabase.from('store_analytics_events').insert({ company_id: coupon.company_id, event_type: 'coupon_qr_claimed', user_id: user.id })

  return { ok: true, code: qr.code }
}

// ─── TIENDA: REDIMIR QR ─────────────────────────────────────────

export async function redeemQrCodeAction(
  companyId: string,
  code: string
): Promise<{ error: string } | { ok: true; couponTitle: string }> {
  const supabase = await createClient()

  const withinLimit = await checkRateLimit('redeem_qr', companyId, 60, 600)
  if (!withinLimit) return { error: 'Demasiados intentos de canje. Espera unos minutos e inténtalo de nuevo.' }

  const { data: qr } = await supabase
    .from('qr_codes')
    .select('id, status, coupon_id, coupon:coupons(id, title, company_id, used_count)')
    .eq('code', code.trim())
    .maybeSingle()

  if (!qr) return { error: 'Código QR no encontrado.' }

  const coupon = qr.coupon as unknown as { id: string; title: string; company_id: string; used_count: number } | null
  if (!coupon || coupon.company_id !== companyId) return { error: 'Este cupón no pertenece a tu tienda.' }

  // Guard atómico contra doble canje simultáneo: la condición
  // status='issued' va en el propio UPDATE, no solo en un chequeo
  // previo en la aplicación (evita condiciones de carrera).
  const { data: updated, error: updateError } = await supabase
    .from('qr_codes')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', qr.id)
    .eq('status', 'issued')
    .select('id')
    .maybeSingle()

  if (updateError) return { error: 'Error al canjear el cupón. Inténtalo de nuevo.' }
  if (!updated) return { error: 'Este cupón QR ya fue canjeado.' }

  await supabase.from('coupon_redemptions').insert({ coupon_id: coupon.id, qr_code_id: qr.id })
  await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('id', coupon.id)

  revalidatePath(`/dashboard/tienda/${companyId}`)
  return { ok: true, couponTitle: coupon.title }
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { promotionSchema, homeBannerSchema, type PromotionInput, type HomeBannerInput } from '@/lib/validations/promotions'
import { logAudit } from '@/lib/audit'
import type { PromotionScope } from '@/types'

// ─── TIENDA: PROMOCIONES (destacar tienda o producto) ───────────

export async function getMyPromotions(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('promotions')
    .select('*, store_item:store_items(name)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function createPromotionAction(
  companyId: string,
  scope: PromotionScope,
  data: PromotionInput,
  storeItemId?: string
): Promise<{ error: string } | { ok: true }> {
  const parsed = promotionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  if (scope === 'product' && !storeItemId) return { error: 'Elige un producto para destacar.' }

  const supabase = await createClient()

  const { data: moduleRow } = await supabase
    .from('store_modules')
    .select('is_active')
    .eq('company_id', companyId)
    .eq('module_key', 'promotions')
    .maybeSingle()

  if (!moduleRow?.is_active) return { error: 'Activa el módulo de promociones antes de crear una.' }

  const { error } = await supabase.from('promotions').insert({
    scope,
    company_id: companyId,
    store_item_id: scope === 'product' ? storeItemId : null,
    title: parsed.data.title,
    image_url: parsed.data.image_url || null,
    link_url: parsed.data.link_url || null,
    starts_at: parsed.data.starts_at || null,
    ends_at: parsed.data.ends_at || null,
    is_active: parsed.data.is_active,
  })

  if (error) return { error: 'Error al crear la promoción. Inténtalo de nuevo.' }

  revalidatePath('/tiendas')
  return { ok: true }
}

export async function togglePromotionActiveAction(formData: FormData) {
  const id = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('promotions').update({ is_active: !isActive }).eq('id', id)
  revalidatePath('/tiendas')
  revalidatePath('/admin/promociones')
  revalidatePath('/')
}

export async function deletePromotionAction(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('promotions').delete().eq('id', id)
  revalidatePath('/tiendas')
  revalidatePath('/admin/promociones')
  revalidatePath('/')
}

// ─── PÚBLICO: TIENDAS DESTACADAS EN EL DIRECTORIO ───────────────

export async function getFeaturedStoreIds(): Promise<Set<string>> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('promotions')
    .select('company_id')
    .eq('scope', 'store')
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)

  return new Set((data ?? []).map((p) => p.company_id).filter((id): id is string => !!id))
}

// ─── PÚBLICO: BANNER DE INICIO ───────────────────────────────────
// scope='home_banner' con company_id NULL identifica los banners
// curados por el equipo de Brasil BCN para la portada (no son
// promociones de una tienda — para eso está el AdSlot de publicidad).

export async function getActiveHomeBanners() {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('promotions')
    .select('id, title, image_url, link_url')
    .eq('scope', 'home_banner')
    .is('company_id', null)
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('created_at', { ascending: false })

  return (data ?? []).filter((b) => b.image_url && b.link_url) as {
    id: string
    title: string
    image_url: string
    link_url: string
  }[]
}

// ─── ADMIN: BANNER DE INICIO ─────────────────────────────────────

async function requirePromotionsAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') return null
  return { supabase, userId: user.id }
}

export async function getAdminHomeBanners() {
  const ctx = await requirePromotionsAdmin()
  if (!ctx) return []
  const { data } = await ctx.supabase
    .from('promotions')
    .select('*')
    .eq('scope', 'home_banner')
    .is('company_id', null)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function createHomeBannerAction(data: HomeBannerInput): Promise<{ error: string } | { ok: true }> {
  const ctx = await requirePromotionsAdmin()
  if (!ctx) return { error: 'No autorizado' }

  const parsed = homeBannerSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: banner, error } = await ctx.supabase.from('promotions').insert({
    scope: 'home_banner',
    company_id: null,
    title: parsed.data.title,
    image_url: parsed.data.image_url,
    link_url: parsed.data.link_url,
    starts_at: parsed.data.starts_at || null,
    ends_at: parsed.data.ends_at || null,
    is_active: parsed.data.is_active,
  }).select('id').single()

  if (error) return { error: 'Error al crear el banner. Inténtalo de nuevo.' }

  await logAudit(ctx.supabase, ctx.userId, 'home_banner_created', 'promotion', banner?.id)
  revalidatePath('/admin/promociones')
  revalidatePath('/')
  return { ok: true }
}

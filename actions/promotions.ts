'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { promotionSchema, type PromotionInput } from '@/lib/validations/promotions'
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
}

export async function deletePromotionAction(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('promotions').delete().eq('id', id)
  revalidatePath('/tiendas')
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

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { activateStoreSchema, createStoreSchema, storeItemSchema, couponSchema, type ActivateStoreInput, type CreateStoreInput, type StoreItemInput, type CouponInput } from '@/lib/validations/stores'
import type { CompanyCategory } from '@/types'

// ─── PUBLIC: DIRECTORY & DETAIL ───────────────────────────────

export interface StoreFilters {
  categoria?: CompanyCategory
  ciudad?: string
  q?: string
  page?: number
}

export async function getStores(filters: StoreFilters = {}) {
  const supabase = await createClient()
  const PAGE_SIZE = 12
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .eq('is_store', true)
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('is_verified', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filters.categoria) query = query.eq('category', filters.categoria)
  if (filters.ciudad) query = query.ilike('city', `%${filters.ciudad}%`)
  if (filters.q) query = query.ilike('name', `%${filters.q}%`)

  const { data, count, error } = await query
  if (error) return { stores: [], total: 0, pages: 0 }

  return {
    stores: data ?? [],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}

export async function getStoreBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*, items:store_items(*), coupons:coupons(*)')
    .eq('slug', slug)
    .eq('is_store', true)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (error || !data) return null

  await supabase.from('companies').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id)

  return data
}

// ─── OWNER: MY STORE ───────────────────────────────────────────

// Crea una empresa nueva ya activada como tienda (para quien todavía
// no tiene ninguna empresa registrada). No toca createCompanyAction.
export async function createStoreAction(data: CreateStoreInput): Promise<{ error: string } | { ok: true; slug: string }> {
  const parsed = createStoreSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { data: company, error } = await supabase
    .from('companies')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category,
      logo_url: parsed.data.logo_url || null,
      website: parsed.data.website || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      address: parsed.data.address || null,
      city: parsed.data.city,
      owner_id: user.id,
      slug: '',
      is_store: true,
      instagram: parsed.data.instagram || null,
      business_hours: parsed.data.business_hours ? { text: parsed.data.business_hours } : null,
      language: parsed.data.language,
      extra_info: parsed.data.extra_info || null,
    })
    .select('slug')
    .single()

  if (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { error: 'Ya tienes un negocio registrado con ese nombre.' }
    }
    return { error: `Error al crear la tienda: ${error.message}` }
  }

  revalidatePath('/tiendas')
  revalidatePath('/dashboard')
  return { ok: true, slug: company.slug }
}

export async function getMyCompany() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export async function activateStoreAction(companyId: string, data: ActivateStoreInput): Promise<{ error: string } | { ok: true }> {
  const parsed = activateStoreSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { error } = await supabase
    .from('companies')
    .update({
      is_store: true,
      instagram: parsed.data.instagram || null,
      business_hours: parsed.data.business_hours ? { text: parsed.data.business_hours } : null,
      language: parsed.data.language,
      extra_info: parsed.data.extra_info || null,
    })
    .eq('id', companyId)
    .eq('owner_id', user.id)

  if (error) return { error: 'Error al activar la tienda. Inténtalo de nuevo.' }

  revalidatePath('/dashboard')
  revalidatePath('/tiendas')
  return { ok: true }
}

// ─── OWNER: STORE ITEMS (productos / servicios) ────────────────

export async function getMyStoreItems(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_items')
    .select('*')
    .eq('company_id', companyId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function createStoreItemAction(companyId: string, data: StoreItemInput): Promise<{ error: string } | { ok: true }> {
  const parsed = storeItemSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { error } = await supabase.from('store_items').insert({
    company_id: companyId,
    item_type: parsed.data.item_type,
    name: parsed.data.name,
    description: parsed.data.description || null,
    image_url: parsed.data.image_url || null,
    price: parsed.data.price ?? null,
    category: parsed.data.category || null,
    duration_min: parsed.data.duration_min ?? null,
    is_active: parsed.data.is_active,
  })

  if (error) return { error: 'Error al crear el producto/servicio. Inténtalo de nuevo.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function updateStoreItemAction(itemId: string, data: StoreItemInput): Promise<{ error: string } | { ok: true }> {
  const parsed = storeItemSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('store_items')
    .update({
      item_type: parsed.data.item_type,
      name: parsed.data.name,
      description: parsed.data.description || null,
      image_url: parsed.data.image_url || null,
      price: parsed.data.price ?? null,
      category: parsed.data.category || null,
      duration_min: parsed.data.duration_min ?? null,
      is_active: parsed.data.is_active,
    })
    .eq('id', itemId)

  if (error) return { error: 'Error al guardar los cambios. Inténtalo de nuevo.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deleteStoreItemAction(formData: FormData) {
  const itemId = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('store_items').delete().eq('id', itemId)
  revalidatePath('/dashboard')
}

export async function toggleStoreItemActiveAction(formData: FormData) {
  const itemId = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('store_items').update({ is_active: !isActive }).eq('id', itemId)
  revalidatePath('/dashboard')
}

// ─── OWNER: COUPONS ─────────────────────────────────────────────

export async function getMyCoupons(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function createCouponAction(companyId: string, data: CouponInput): Promise<{ error: string } | { ok: true }> {
  const parsed = couponSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { error } = await supabase.from('coupons').insert({
    company_id: companyId,
    title: parsed.data.title,
    code: parsed.data.code,
    discount_type: parsed.data.discount_type,
    discount_value: parsed.data.discount_value,
    starts_at: parsed.data.starts_at || null,
    ends_at: parsed.data.ends_at || null,
    max_uses: parsed.data.max_uses ?? null,
    is_active: parsed.data.is_active,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe un cupón con ese código' }
    return { error: 'Error al crear el cupón. Inténtalo de nuevo.' }
  }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deleteCouponAction(formData: FormData) {
  const couponId = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('coupons').delete().eq('id', couponId)
  revalidatePath('/dashboard')
}

export async function toggleCouponActiveAction(formData: FormData) {
  const couponId = formData.get('id') as string
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase.from('coupons').update({ is_active: !isActive }).eq('id', couponId)
  revalidatePath('/dashboard')
}

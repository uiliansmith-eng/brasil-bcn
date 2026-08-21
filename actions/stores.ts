'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { activateStoreSchema, createStoreSchema, storeItemSchema, storeItemVariantSchema, couponSchema, type ActivateStoreInput, type CreateStoreInput, type StoreItemInput, type StoreItemVariantInput, type CouponInput } from '@/lib/validations/stores'
import type { CompanyCategory, StoreModuleKey, StoreEmployeeRole } from '@/types'
import { STORE_MODULE_DEFAULTS } from '@/lib/constants'

// ─── CATEGORÍAS DEL MOTOR DE TIENDAS ───────────────────────────

export async function getStoreCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_categories')
    .select('*, subcategories:store_subcategories(*)')
    .order('display_order', { ascending: true })
    .order('display_order', { ascending: true, foreignTable: 'store_subcategories' })

  return data ?? []
}

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
  await supabase.from('store_analytics_events').insert({ company_id: data.id, event_type: 'store_viewed' })

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
      store_category_id: parsed.data.store_category_id || null,
      store_subcategory_id: parsed.data.store_subcategory_id || null,
    })
    .select('id, slug')
    .single()

  if (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { error: 'Ya tienes un negocio registrado con ese nombre.' }
    }
    return { error: `Error al crear la tienda: ${error.message}` }
  }

  await seedDefaultStoreModules(supabase, company.id)

  revalidatePath('/tiendas')
  revalidatePath('/dashboard')
  return { ok: true, slug: company.slug }
}

// Crea las filas de store_modules con los valores por defecto para
// una tienda nueva. Todos los módulos quedan construidos en la base
// de datos desde el primer momento; solo cambia si is_active o no.
async function seedDefaultStoreModules(supabase: Awaited<ReturnType<typeof createClient>>, companyId: string) {
  const rows = (Object.entries(STORE_MODULE_DEFAULTS) as [StoreModuleKey, boolean][])
    .map(([module_key, is_active]) => ({ company_id: companyId, module_key, is_active }))
  await supabase.from('store_modules').insert(rows)
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
      store_category_id: parsed.data.store_category_id || null,
      store_subcategory_id: parsed.data.store_subcategory_id || null,
    })
    .eq('id', companyId)
    .eq('owner_id', user.id)

  if (error) return { error: 'Error al activar la tienda. Inténtalo de nuevo.' }

  const { count } = await supabase
    .from('store_modules')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
  if (!count) await seedDefaultStoreModules(supabase, companyId)

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
    sku: parsed.data.sku || null,
    track_stock: parsed.data.track_stock,
    stock: parsed.data.track_stock ? (parsed.data.stock ?? 0) : null,
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
      sku: parsed.data.sku || null,
      track_stock: parsed.data.track_stock,
      stock: parsed.data.track_stock ? (parsed.data.stock ?? 0) : null,
    })
    .eq('id', itemId)

  if (error) return { error: 'Error al guardar los cambios. Inténtalo de nuevo.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

// ─── OWNER: VARIANTES DE PRODUCTO ───────────────────────────────

export async function getStoreItemVariants(storeItemId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_item_variants')
    .select('*')
    .eq('store_item_id', storeItemId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  return data ?? []
}

export async function createStoreItemVariantAction(storeItemId: string, data: StoreItemVariantInput): Promise<{ error: string } | { ok: true }> {
  const parsed = storeItemVariantSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('store_item_variants').insert({
    store_item_id: storeItemId,
    name: parsed.data.name,
    sku: parsed.data.sku || null,
    price_override: parsed.data.price_override ?? null,
    stock: parsed.data.stock ?? null,
    is_active: parsed.data.is_active,
  })

  if (error) return { error: 'Error al crear la variante. Inténtalo de nuevo.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function updateStoreItemVariantAction(variantId: string, data: StoreItemVariantInput): Promise<{ error: string } | { ok: true }> {
  const parsed = storeItemVariantSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('store_item_variants')
    .update({
      name: parsed.data.name,
      sku: parsed.data.sku || null,
      price_override: parsed.data.price_override ?? null,
      stock: parsed.data.stock ?? null,
      is_active: parsed.data.is_active,
    })
    .eq('id', variantId)

  if (error) return { error: 'Error al guardar los cambios. Inténtalo de nuevo.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deleteStoreItemVariantAction(formData: FormData) {
  const variantId = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('store_item_variants').delete().eq('id', variantId)
  revalidatePath('/dashboard')
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

// ─── OWNER: MÓDULOS (feature flags por tienda) ─────────────────

export async function getActiveStoreModuleKeys(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_modules')
    .select('module_key')
    .eq('company_id', companyId)
    .eq('is_active', true)

  return new Set((data ?? []).map((m) => m.module_key as StoreModuleKey))
}

export async function getMyStoreModules(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_modules')
    .select('*')
    .eq('company_id', companyId)

  return data ?? []
}

export async function toggleStoreModuleAction(formData: FormData) {
  const companyId = formData.get('company_id') as string
  const moduleKey = formData.get('module_key') as StoreModuleKey
  const isActive = formData.get('is_active') === 'true'
  const supabase = await createClient()
  await supabase
    .from('store_modules')
    .update({ is_active: !isActive })
    .eq('company_id', companyId)
    .eq('module_key', moduleKey)
  revalidatePath('/dashboard/tienda')
}

// ─── OWNER: EMPLEADOS (multiusuario por tienda) ────────────────

export async function getMyStoreEmployees(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_employees')
    .select('*, profile:profiles(id, full_name, email, avatar_url)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function addStoreEmployeeAction(companyId: string, email: string, role: StoreEmployeeRole): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle()

  if (!profile) return { error: 'No existe ningún usuario registrado con ese email en Brasil BCN.' }

  const { error } = await supabase.from('store_employees').insert({
    company_id: companyId,
    user_id: profile.id,
    role,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Ese usuario ya es empleado de esta tienda.' }
    return { error: 'Error al añadir el empleado. Inténtalo de nuevo.' }
  }

  revalidatePath('/dashboard/tienda')
  return { ok: true }
}

export async function removeStoreEmployeeAction(formData: FormData) {
  const employeeId = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('store_employees').delete().eq('id', employeeId)
  revalidatePath('/dashboard/tienda')
}

// ─── OWNER: GALERÍA ──────────────────────────────────────────────

export async function updateStoreGalleryAction(companyId: string, gallery: string[]): Promise<{ error: string } | { ok: true }> {
  if (gallery.length > 20) return { error: 'Máximo 20 fotos en la galería.' }

  const supabase = await createClient()
  const { error } = await supabase.from('companies').update({ gallery }).eq('id', companyId)
  if (error) return { error: 'Error al guardar la galería. Inténtalo de nuevo.' }

  revalidatePath('/dashboard/tienda')
  revalidatePath('/tiendas')
  return { ok: true }
}

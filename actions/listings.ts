'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createListingSchema, type CreateListingInput } from '@/lib/validations/listings'

export interface ListingFilters {
  categoria?: string
  condicion?: string
  ciudad?: string
  q?: string
  page?: number
}

const PAGE_SIZE = 12

export async function getListings(filters: ListingFilters = {}) {
  const supabase = await createClient()
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('listings')
    .select('id, title, price, price_negotiable, category, condition, images, city, created_at', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)
    .eq('is_sold', false)

  if (filters.categoria) query = query.eq('category', filters.categoria)
  if (filters.condicion) query = query.eq('condition', filters.condicion)
  if (filters.ciudad) query = query.eq('city', filters.ciudad)
  if (filters.q) query = query.ilike('title', `%${filters.q}%`)

  const { data, count } = await query.order('created_at', { ascending: false }).range(from, to)

  return { listings: data ?? [], total: count ?? 0, page, pageSize: PAGE_SIZE }
}

export async function getListingById(id: string) {
  const supabase = await createClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('*, seller:profiles(id, full_name, avatar_url, whatsapp)')
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (listing) {
    void Promise.resolve(supabase.rpc('increment_listing_views', { p_id: id }))
  }

  return listing
}

export async function createListingAction(data: CreateListingInput): Promise<{ error: string } | never> {
  const parsed = createListingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error?.issues[0]?.message ?? 'Datos inválidos' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión' }

  const { error } = await supabase.from('listings').insert({
    ...parsed.data,
    seller_id: user.id,
    price: parsed.data.price ?? null,
  })

  if (error) return { error: error.message }

  revalidatePath('/compraventa')
  redirect('/compraventa')
}

// ---------- Admin ----------

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return { supabase }
}

export async function getAdminListings() {
  const ctx = await requireAdmin()
  if (!ctx) return []
  const { data } = await ctx.supabase
    .from('listings')
    .select('*, seller:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)
  return data ?? []
}

export async function approveListingAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('listings').update({ is_approved: true }).eq('id', id)
  revalidatePath('/admin/compraventa')
  revalidatePath('/compraventa')
}

export async function rejectListingAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('listings').update({ is_active: false }).eq('id', id)
  revalidatePath('/admin/compraventa')
  revalidatePath('/compraventa')
}

export async function markSoldListingAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('listings').update({ is_sold: true }).eq('id', id)
  revalidatePath('/admin/compraventa')
  revalidatePath('/compraventa')
}

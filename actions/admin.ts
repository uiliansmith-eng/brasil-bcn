'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createGuideSchema, type CreateGuideInput } from '@/lib/validations/guides'

// ─── AUTH GUARD ───────────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null
  return { supabase, userId: user.id }
}

// ─── STATS ────────────────────────────────────────────────────
export async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalJobs },
    { count: pendingJobs },
    { count: totalCompanies },
    { count: pendingCompanies },
    { count: totalEvents },
    { count: pendingEvents },
    { count: totalGuides },
    { count: publishedGuides },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', false),
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', false),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', false),
    supabase.from('guides').select('*', { count: 'exact', head: true }),
    supabase.from('guides').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  return {
    users: totalUsers ?? 0,
    jobs: { total: totalJobs ?? 0, pending: pendingJobs ?? 0 },
    companies: { total: totalCompanies ?? 0, pending: pendingCompanies ?? 0 },
    events: { total: totalEvents ?? 0, pending: pendingEvents ?? 0 },
    guides: { total: totalGuides ?? 0, published: publishedGuides ?? 0 },
  }
}

// ─── PENDING ITEMS ────────────────────────────────────────────
export async function getPendingJobs() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs')
    .select('id, title, category, job_type, city, created_at, poster:profiles(full_name)')
    .eq('is_active', true)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getPendingCompanies() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('id, name, category, city, created_at, owner:profiles(full_name)')
    .eq('is_active', true)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getPendingEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('id, title, category, city, date_start, created_at, organizer:profiles(full_name)')
    .eq('is_active', true)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getAdminGuides() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guides')
    .select('id, title, slug, category, is_published, published_at, reading_time, views')
    .order('created_at', { ascending: false })
  return data ?? []
}

// ─── APPROVE / REJECT ─────────────────────────────────────────
export async function approveJobAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('jobs').update({ is_approved: true }).eq('id', id)
  revalidatePath('/admin/empleos')
  revalidatePath('/empleos')
}

export async function rejectJobAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('jobs').update({ is_active: false }).eq('id', id)
  revalidatePath('/admin/empleos')
  revalidatePath('/empleos')
}

export async function approveCompanyAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('companies').update({ is_approved: true }).eq('id', id)
  revalidatePath('/admin/empresas')
  revalidatePath('/empresas')
}

export async function rejectCompanyAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('companies').update({ is_active: false }).eq('id', id)
  revalidatePath('/admin/empresas')
  revalidatePath('/empresas')
}

export async function approveEventAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('events').update({ is_approved: true }).eq('id', id)
  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
}

export async function rejectEventAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('events').update({ is_active: false }).eq('id', id)
  revalidatePath('/admin/eventos')
  revalidatePath('/eventos')
}

// ─── GUIDES MANAGEMENT ───────────────────────────────────────
export async function toggleGuidePublishAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  const current = formData.get('is_published') === 'true'
  await ctx.supabase.from('guides').update({
    is_published: !current,
    published_at: !current ? new Date().toISOString() : null,
  }).eq('id', id)
  revalidatePath('/admin/guias')
  revalidatePath('/guia')
}

export async function deleteGuideAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('guides').delete().eq('id', id)
  revalidatePath('/admin/guias')
  revalidatePath('/guia')
}

export async function createGuideAction(data: CreateGuideInput): Promise<{ error: string } | { success: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }

  const parsed = createGuideSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const wordCount = parsed.data.content.trim().split(/\s+/).length
  const reading_time = Math.max(1, Math.ceil(wordCount / 200))

  const slug = parsed.data.title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36)

  const { error } = await ctx.supabase.from('guides').insert({
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content,
    category: parsed.data.category,
    cover_url: parsed.data.cover_url || null,
    reading_time,
    is_published: parsed.data.is_published,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
    author_id: ctx.userId,
  })

  if (error) return { error: 'Error al crear la guía. Inténtalo de nuevo.' }

  revalidatePath('/admin/guias')
  revalidatePath('/guia')
  return { success: true }
}

// ─── USUARIOS ─────────────────────────────────────────────────

export async function getUsers(page = 1, search = '') {
  const supabase = await createClient()
  const perPage = 20
  const from = (page - 1) * perPage
  let query = supabase
    .from('profiles')
    .select('id, email, full_name, role, is_blocked, blocked_at, blocked_reason, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + perPage - 1)
  if (search) query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  const { data, count, error } = await query
  if (error) { console.error(error); return { users: [], total: 0 } }
  return { users: data ?? [], total: count ?? 0 }
}

export async function blockUser(userId: string, reason: string): Promise<{ error: string | null }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const { error } = await ctx.supabase
    .from('profiles')
    .update({ is_blocked: true, blocked_at: new Date().toISOString(), blocked_reason: reason || null })
    .eq('id', userId)
    .neq('role', 'admin')
  if (error) return { error: error.message }
  revalidatePath('/admin/usuarios')
  return { error: null }
}

export async function unblockUser(userId: string): Promise<{ error: string | null }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const { error } = await ctx.supabase
    .from('profiles')
    .update({ is_blocked: false, blocked_at: null, blocked_reason: null })
    .eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/usuarios')
  return { error: null }
}

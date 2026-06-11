'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createCompanySchema, type CreateCompanyInput } from '@/lib/validations/companies'
import type { CompanyCategory } from '@/types'

export interface CompanyFilters {
  categoria?: CompanyCategory
  ciudad?: string
  q?: string
  page?: number
}

// ─── GET COMPANIES ────────────────────────────────────────────
export async function getCompanies(filters: CompanyFilters = {}) {
  const supabase = await createClient()
  const PAGE_SIZE = 12
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('companies')
    .select('*, owner:profiles(id, full_name, avatar_url)', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('is_verified', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filters.categoria) query = query.eq('category', filters.categoria)
  if (filters.ciudad) query = query.ilike('city', `%${filters.ciudad}%`)
  if (filters.q) query = query.ilike('name', `%${filters.q}%`)

  const { data, count, error } = await query
  if (error) return { companies: [], total: 0, pages: 0 }

  return {
    companies: data ?? [],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}

// ─── GET COMPANY BY SLUG ──────────────────────────────────────
export async function getCompanyBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*, owner:profiles(id, full_name, avatar_url), jobs:jobs(id, title, job_type, category, salary_min, salary_max, salary_visible, is_urgent, created_at, expires_at, is_active, is_approved)')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (error || !data) return null

  await supabase.from('companies').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id)

  return data
}

// ─── CREATE COMPANY ───────────────────────────────────────────
export async function createCompanyAction(data: CreateCompanyInput): Promise<{ error: string } | { ok: true; redirectTo: string }> {
  const parsed = createCompanySchema.safeParse(data)
  if (!parsed.success) {
    const msg = parsed.error.issues[0].message
    console.error('[createCompanyAction] validation failed:', msg)
    return { error: msg }
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) console.error('[createCompanyAction] auth error:', authError.message)
  if (!user) return { error: 'Debes iniciar sesión para registrar una empresa' }

  const { error } = await supabase.from('companies').insert({
    ...parsed.data,
    owner_id: user.id,
    slug: '',
    website: parsed.data.website || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    whatsapp: parsed.data.whatsapp || null,
    address: parsed.data.address || null,
  })

  if (error) {
    console.error('[createCompanyAction] insert error:', error.message, error.code)
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { error: 'Ya tienes una empresa registrada con ese nombre.' }
    }
    return { error: `Error al registrar: ${error.message}` }
  }

  revalidatePath('/empresas')
  return { ok: true, redirectTo: '/empresas?registrada=true' }
}

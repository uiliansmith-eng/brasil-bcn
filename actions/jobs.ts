'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createJobSchema, type CreateJobInput } from '@/lib/validations/jobs'
import type { Job, JobCategory, JobType } from '@/types'

export interface JobFilters {
  categoria?: JobCategory
  tipo?: JobType
  ciudad?: string
  q?: string
  page?: number
}

// ─── GET JOBS (for listing page) ─────────────────────────────
export async function getJobs(filters: JobFilters = {}) {
  const supabase = await createClient()
  const PAGE_SIZE = 12
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('jobs')
    .select('*, company:companies(id, name, slug, logo_url, category)', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)
    .gt('expires_at', new Date().toISOString())
    .order('is_urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filters.categoria) query = query.eq('category', filters.categoria)
  if (filters.tipo) query = query.eq('job_type', filters.tipo)
  if (filters.ciudad) query = query.ilike('city', `%${filters.ciudad}%`)
  if (filters.q) query = query.ilike('title', `%${filters.q}%`)

  const { data, count, error } = await query
  if (error) return { jobs: [], total: 0, pages: 0 }

  return {
    jobs: data ?? [],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}

// ─── GET JOB BY ID ───────────────────────────────────────────
export async function getJobById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*, company:companies(id, name, slug, logo_url, category, city, whatsapp, website), poster:profiles(id, full_name, avatar_url)')
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (error || !data) return null

  // Increment views
  await supabase.from('jobs').update({ views: (data.views ?? 0) + 1 }).eq('id', id)

  return data
}

// ─── CREATE JOB ──────────────────────────────────────────────
export async function createJobAction(data: CreateJobInput): Promise<{ error: string } | never> {
  const parsed = createJobSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para publicar empleos' }

  const { error } = await supabase.from('jobs').insert({
    ...parsed.data,
    posted_by: user.id,
    salary_min: parsed.data.salary_min ?? null,
    salary_max: parsed.data.salary_max ?? null,
    email: parsed.data.email || null,
    whatsapp: parsed.data.whatsapp || null,
    requirements: parsed.data.requirements || null,
    benefits: parsed.data.benefits || null,
    location: parsed.data.location || null,
  })

  if (error) return { error: 'Error al publicar el empleo. Inténtalo de nuevo.' }

  revalidatePath('/empleos')
  redirect('/empleos?publicado=true')
}

// ─── DELETE JOB ──────────────────────────────────────────────
export async function deleteJobAction(id: string): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('jobs')
    .update({ is_active: false })
    .eq('id', id)
    .eq('posted_by', user.id)

  if (error) return { error: 'Error al eliminar el empleo' }

  revalidatePath('/empleos')
  return { success: true }
}

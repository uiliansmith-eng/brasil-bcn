'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  phone: z.string().max(20).optional().or(z.literal('')),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  bio: z.string().max(300).optional().or(z.literal('')),
  city: z.string().max(60).optional().or(z.literal('')),
  avatar_url: z.string().url().optional().or(z.literal('')),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export async function updateProfileAction(data: UpdateProfileInput): Promise<{ error: string } | { success: true }> {
  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      bio: parsed.data.bio || null,
      city: parsed.data.city || null,
      avatar_url: parsed.data.avatar_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: 'Error al guardar los cambios' }

  revalidatePath('/perfil')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getMyContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [jobs, events, listings, companies] = await Promise.all([
    supabase.from('jobs').select('id, title, is_approved, is_active, created_at, category, job_type').eq('posted_by', user.id).eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('events').select('id, title, is_approved, is_active, created_at, category, date_start').eq('organizer_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('listings').select('id, title, is_approved, is_active, is_sold, created_at, category, price').eq('seller_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('companies').select('id, name, slug, is_approved, is_active, category, is_verified').eq('owner_id', user.id).eq('is_active', true),
  ])

  return {
    jobs: jobs.data ?? [],
    events: events.data ?? [],
    listings: listings.data ?? [],
    companies: companies.data ?? [],
  }
}

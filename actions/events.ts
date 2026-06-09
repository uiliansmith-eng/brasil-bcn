'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createEventSchema, type CreateEventInput } from '@/lib/validations/events'
import type { EventCategory } from '@/types'

export interface EventFilters {
  categoria?: EventCategory
  ciudad?: string
  q?: string
  page?: number
  upcoming?: boolean
}

// ─── GET EVENTS ────────────────────────────────────────────────
export async function getEvents(filters: EventFilters = {}) {
  const supabase = await createClient()
  const PAGE_SIZE = 12
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('date_start', { ascending: true })
    .range(from, to)

  if (filters.upcoming !== false) {
    query = query.gte('date_start', new Date().toISOString())
  }
  if (filters.categoria) query = query.eq('category', filters.categoria)
  if (filters.ciudad) query = query.ilike('city', `%${filters.ciudad}%`)
  if (filters.q) query = query.ilike('title', `%${filters.q}%`)

  const { data, count, error } = await query
  if (error) return { events: [], total: 0, pages: 0 }

  return {
    events: data ?? [],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}

// ─── GET EVENT BY SLUG ─────────────────────────────────────────
export async function getEventBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*, organizer:profiles(id, full_name, avatar_url)')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (error || !data) return null

  await supabase.from('events').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id)

  return data
}

// ─── CREATE EVENT ──────────────────────────────────────────────
export async function createEventAction(data: CreateEventInput): Promise<{ error: string } | never> {
  const parsed = createEventSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para publicar un evento' }

  const { error } = await supabase.from('events').insert({
    ...parsed.data,
    organizer_id: user.id,
    slug: '',
    address: parsed.data.address || null,
    date_end: parsed.data.date_end || null,
    price: parsed.data.price ?? null,
    capacity: parsed.data.capacity ?? null,
    whatsapp: parsed.data.whatsapp || null,
    url: parsed.data.url || null,
  })

  if (error) return { error: 'Error al publicar el evento. Inténtalo de nuevo.' }

  revalidatePath('/eventos')
  redirect('/eventos?publicado=true')
}

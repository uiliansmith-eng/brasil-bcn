'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdSchema, type CreateAdInput } from '@/lib/validations/advertisements'
import type { AdPosition } from '@/types'

// ─── PUBLIC ───────────────────────────────────────────────────
export async function getAdByPosition(position: AdPosition) {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('advertisements')
    .select('id, title, description, image_url, url, position')
    .eq('position', position)
    .eq('is_active', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data ?? null
}

export async function trackAdImpression(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('advertisements')
    .select('impressions')
    .eq('id', id)
    .single()
  if (data) {
    await supabase
      .from('advertisements')
      .update({ impressions: (data.impressions ?? 0) + 1 })
      .eq('id', id)
  }
}

export async function trackAdClick(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('advertisements')
    .select('clicks')
    .eq('id', id)
    .single()
  if (data) {
    await supabase
      .from('advertisements')
      .update({ clicks: (data.clicks ?? 0) + 1 })
      .eq('id', id)
  }
}

// ─── ADMIN ────────────────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return { supabase }
}

export async function getAdminAds() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('advertisements')
    .select('id, title, position, image_url, url, is_active, starts_at, ends_at, clicks, impressions')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function createAdAction(data: CreateAdInput): Promise<{ error: string } | { success: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }

  const parsed = createAdSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase.from('advertisements').insert({
    ...parsed.data,
    description: parsed.data.description || null,
    is_active: true,
  })

  if (error) return { error: 'Error al crear el anuncio.' }

  revalidatePath('/admin/publicidad')
  return { success: true }
}

export async function toggleAdAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  const current = formData.get('is_active') === 'true'
  await ctx.supabase.from('advertisements').update({ is_active: !current }).eq('id', id)
  revalidatePath('/admin/publicidad')
}

export async function deleteAdAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('advertisements').delete().eq('id', id)
  revalidatePath('/admin/publicidad')
}

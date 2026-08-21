'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function isStoreFavorited(companyId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('company_id', companyId)
    .is('store_item_id', null)
    .maybeSingle()

  return !!data
}

export async function toggleFavoriteStoreAction(companyId: string): Promise<{ error: string } | { ok: true; favorited: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para guardar favoritos.' }

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('company_id', companyId)
    .is('store_item_id', null)
    .maybeSingle()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    revalidatePath('/dashboard/favoritos')
    return { ok: true, favorited: false }
  }

  const { error } = await supabase.from('favorites').insert({ user_id: user.id, company_id: companyId })
  if (error) return { error: 'Error al guardar el favorito. Inténtalo de nuevo.' }

  revalidatePath('/dashboard/favoritos')
  return { ok: true, favorited: true }
}

export async function getMyFavoriteStores() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('favorites')
    .select('id, created_at, company:companies(id, name, slug, logo_url, city, category)')
    .eq('user_id', user.id)
    .is('store_item_id', null)
    .order('created_at', { ascending: false })

  return data ?? []
}

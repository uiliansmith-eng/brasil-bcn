'use server'

import { createClient } from '@/lib/supabase/server'

interface PushSubscriptionInput {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export async function savePushSubscriptionAction(sub: PushSubscriptionInput): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase.from('push_subscriptions').upsert(
    { user_id: user.id, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    { onConflict: 'endpoint' }
  )

  if (error) return { error: 'No se pudo activar las notificaciones. Inténtalo de nuevo.' }
  return { ok: true }
}

export async function deletePushSubscriptionAction(endpoint: string) {
  const supabase = await createClient()
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
}

export async function hasPushSubscriptionAction(endpoint: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.from('push_subscriptions').select('id').eq('endpoint', endpoint).maybeSingle()
  return !!data
}

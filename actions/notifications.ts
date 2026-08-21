'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, wrapEmail, absoluteUrl } from '@/lib/email'

// Server-only: usado desde otras actions (orders, reservations,
// reviews) para avisar a un usuario de un evento relevante. Se
// inserta con la sesión del usuario que dispara la acción (no hay
// service role), por eso notifications tiene una política de INSERT
// abierta a cualquier autenticado — ver migración 20240022.
//
// Además del registro in-app, dispara un email real reutilizando
// lib/email.ts (Resend) — sendEmail() ya no-opea sola si falta
// RESEND_API_KEY o el destinatario, así que es seguro llamarla
// siempre sin comprobaciones adicionales aquí.
export async function notifyUser(
  userId: string,
  type: string,
  title: string,
  body?: string,
  meta?: Record<string, unknown>
) {
  const supabase = await createClient()
  await supabase.from('notifications').insert({ user_id: userId, type, title, body: body ?? null, meta: meta ?? null })

  const { data: profile } = await supabase.from('profiles').select('email').eq('id', userId).maybeSingle()
  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject: title,
      html: wrapEmail(title, body ?? '', absoluteUrl('/dashboard/notificaciones'), 'Ver en Brasil BCN'),
    })
  }
}

export async function getMyNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return data ?? []
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return count ?? 0
}

export async function markNotificationReadAction(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  revalidatePath('/dashboard/notificaciones')
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
  revalidatePath('/dashboard/notificaciones')
}

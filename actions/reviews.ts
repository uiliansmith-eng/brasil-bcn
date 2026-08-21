'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { reviewSchema, reviewReplySchema, type ReviewInput, type ReviewReplyInput } from '@/lib/validations/reviews'
import { notifyUser } from '@/actions/notifications'
import { checkRateLimit } from '@/lib/rate-limit'

export async function getStoreReviews(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*, user:profiles(full_name, avatar_url)')
    .eq('company_id', companyId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function getMyReview(companyId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('company_id', companyId)
    .eq('user_id', user.id)
    .maybeSingle()

  return data
}

export async function submitReviewAction(companyId: string, data: ReviewInput): Promise<{ error: string } | { ok: true }> {
  const parsed = reviewSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para dejar una reseña.' }

  const withinLimit = await checkRateLimit('submit_review', user.id, 10, 3600)
  if (!withinLimit) return { error: 'Demasiadas reseñas en poco tiempo. Inténtalo de nuevo más tarde.' }

  const { error } = await supabase
    .from('reviews')
    .upsert({
      company_id: companyId,
      user_id: user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    }, { onConflict: 'company_id,user_id' })

  if (error) return { error: 'Error al guardar tu reseña. Inténtalo de nuevo.' }

  const { data: company } = await supabase.from('companies').select('owner_id, name').eq('id', companyId).single()
  if (company && company.owner_id !== user.id) {
    await notifyUser(company.owner_id, 'review_received', `Nueva reseña en ${company.name}`, `${parsed.data.rating}★${parsed.data.comment ? ` — ${parsed.data.comment.slice(0, 100)}` : ''}`)
  }

  revalidatePath(`/tiendas`)
  return { ok: true }
}

export async function deleteReviewAction(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('reviews').delete().eq('id', id)
  revalidatePath('/tiendas')
}

// ─── TIENDA: RESPONDER Y MODERAR ─────────────────────────────────

export async function replyToReviewAction(reviewId: string, data: ReviewReplyInput): Promise<{ error: string } | { ok: true }> {
  const parsed = reviewReplySchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: review, error } = await supabase
    .from('reviews')
    .update({ reply: parsed.data.reply })
    .eq('id', reviewId)
    .select('company_id')
    .single()
  if (error) return { error: 'Error al enviar la respuesta. Inténtalo de nuevo.' }

  if (review) revalidatePath(`/dashboard/tienda/${review.company_id}/resenas`)
  return { ok: true }
}

export async function toggleReviewHiddenAction(formData: FormData) {
  const id = formData.get('id') as string
  const isHidden = formData.get('is_hidden') === 'true'
  const supabase = await createClient()
  const { data: review } = await supabase
    .from('reviews')
    .update({ is_hidden: !isHidden })
    .eq('id', id)
    .select('company_id')
    .single()
  if (review) revalidatePath(`/dashboard/tienda/${review.company_id}/resenas`)
}

export async function getStoreReviewsForOwner(companyId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*, user:profiles(full_name, avatar_url)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  return data ?? []
}

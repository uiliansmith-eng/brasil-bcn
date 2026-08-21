'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import { quizMetaSchema, quizResultSchema, quizQuestionSchema, quizAnswerSchema, type QuizMetaInput, type QuizResultInput, type QuizQuestionInput, type QuizAnswerInput } from '@/lib/validations/quiz'
import type { QuizWithContent, QuizEventType, QuizResult } from '@/types'

function sortContent(quiz: QuizWithContent): QuizWithContent {
  return {
    ...quiz,
    results: [...quiz.results].sort((a, b) => a.order_index - b.order_index),
    questions: [...quiz.questions]
      .sort((a, b) => a.order_index - b.order_index)
      .map((q) => ({ ...q, answers: [...q.answers].sort((a, b) => a.order_index - b.order_index) })),
  }
}

const FULL_CONTENT_SELECT = `
  *,
  results:quiz_results(*),
  questions:quiz_questions(*, answers:quiz_answers(*))
`

// ─── PUBLIC READS ───────────────────────────────────────────────
export async function getQuizOfWeek(): Promise<QuizWithContent | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('quizzes')
    .select(FULL_CONTENT_SELECT)
    .eq('status', 'published')
    .eq('is_quiz_of_week', true)
    .maybeSingle()

  if (data) return sortContent(data as unknown as QuizWithContent)

  // Fallback: no quiz explicitly marked "da semana" — use the most recently published one
  const { data: fallback } = await supabase
    .from('quizzes')
    .select(FULL_CONTENT_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return fallback ? sortContent(fallback as unknown as QuizWithContent) : null
}

export async function getQuizBySlug(slug: string): Promise<QuizWithContent | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quizzes')
    .select(FULL_CONTENT_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  return data ? sortContent(data as unknown as QuizWithContent) : null
}

export async function getResultBySlug(quizSlug: string, resultSlug: string) {
  const supabase = await createClient()
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, slug, description')
    .eq('slug', quizSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (!quiz) return null

  const { data: result } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('quiz_id', quiz.id)
    .eq('slug', resultSlug)
    .maybeSingle()

  if (!result) return null

  return { quiz, result: result as QuizResult }
}

// ─── ANALYTICS (anonymous, no PII) ───────────────────────────────
export async function logQuizEvent(input: {
  quizId: string | null
  sessionId: string
  eventType: QuizEventType
  resultId?: string | null
  questionId?: string | null
  source?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  meta?: Record<string, unknown>
}) {
  try {
    const supabase = await createClient()
    await supabase.from('quiz_events').insert({
      quiz_id: input.quizId,
      session_id: input.sessionId,
      event_type: input.eventType,
      result_id: input.resultId ?? null,
      question_id: input.questionId ?? null,
      source: input.source ?? null,
      utm_source: input.utmSource ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_campaign: input.utmCampaign ?? null,
      meta: input.meta ?? null,
    })
  } catch (e) {
    // Analytics must never break the user experience
    console.error('[logQuizEvent] failed:', e)
  }
}

// ─── ADMIN AUTH GUARD ─────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') return null
  return { supabase, userId: user.id }
}

async function uniqueQuizSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string, excludeId?: string) {
  const root = slugify(base) || 'quiz'
  let slug = root
  let i = 2
  for (;;) {
    let query = supabase.from('quizzes').select('id').eq('slug', slug)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query.maybeSingle()
    if (!data) return slug
    slug = `${root}-${i++}`
  }
}

async function uniqueResultSlug(supabase: Awaited<ReturnType<typeof createClient>>, quizId: string, base: string, excludeId?: string) {
  const root = slugify(base) || 'resultado'
  let slug = root
  let i = 2
  for (;;) {
    let query = supabase.from('quiz_results').select('id').eq('quiz_id', quizId).eq('slug', slug)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query.maybeSingle()
    if (!data) return slug
    slug = `${root}-${i++}`
  }
}

// ─── ADMIN: QUIZ CRUD ─────────────────────────────────────────
export async function getAdminQuizzes() {
  const ctx = await requireAdmin()
  if (!ctx) return []
  const { data } = await ctx.supabase
    .from('quizzes')
    .select('*, questions:quiz_questions(count), results:quiz_results(count)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getQuizForAdmin(id: string): Promise<QuizWithContent | null> {
  const ctx = await requireAdmin()
  if (!ctx) return null
  const { data } = await ctx.supabase.from('quizzes').select(FULL_CONTENT_SELECT).eq('id', id).maybeSingle()
  return data ? sortContent(data as unknown as QuizWithContent) : null
}

export async function createQuizAction(data: QuizMetaInput): Promise<{ error: string } | { ok: true; id: string }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizMetaSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const slug = await uniqueQuizSlug(ctx.supabase, parsed.data.title)
  const { data: quiz, error } = await ctx.supabase
    .from('quizzes')
    .insert({
      title: parsed.data.title,
      slug,
      description: parsed.data.description || null,
      cover_image: parsed.data.cover_image || null,
      estimated_minutes: parsed.data.estimated_minutes,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error || !quiz) return { error: 'Error al crear el quiz' }

  revalidatePath('/admin/quizzes')
  return { ok: true, id: quiz.id }
}

export async function updateQuizMetaAction(id: string, data: QuizMetaInput): Promise<{ error: string } | { ok: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizMetaSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: current } = await ctx.supabase.from('quizzes').select('title, slug').eq('id', id).single()
  const slug = current && current.title !== parsed.data.title
    ? await uniqueQuizSlug(ctx.supabase, parsed.data.title, id)
    : current?.slug

  const { error } = await ctx.supabase
    .from('quizzes')
    .update({
      title: parsed.data.title,
      slug,
      description: parsed.data.description || null,
      cover_image: parsed.data.cover_image || null,
      estimated_minutes: parsed.data.estimated_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: 'Error al guardar' }

  revalidatePath('/admin/quizzes')
  revalidatePath(`/admin/quizzes/${id}`)
  revalidatePath('/quiz')
  return { ok: true }
}

export async function deleteQuizAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('quizzes').delete().eq('id', id)
  revalidatePath('/admin/quizzes')
  revalidatePath('/quiz')
}

export async function publishQuizAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  const publish = formData.get('publish') === 'true'
  await ctx.supabase
    .from('quizzes')
    .update({ status: publish ? 'published' : 'draft', published_at: publish ? new Date().toISOString() : null })
    .eq('id', id)
  revalidatePath('/admin/quizzes')
  revalidatePath('/quiz')
}

export async function setQuizOfWeekAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  await ctx.supabase.from('quizzes').update({ is_quiz_of_week: false }).eq('is_quiz_of_week', true).neq('id', id)
  await ctx.supabase.from('quizzes').update({ is_quiz_of_week: true }).eq('id', id)
  revalidatePath('/admin/quizzes')
  revalidatePath('/quiz')
}

export async function duplicateQuizAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string

  const { data: quiz } = await ctx.supabase.from('quizzes').select(FULL_CONTENT_SELECT).eq('id', id).single()
  if (!quiz) return
  const source = quiz as unknown as QuizWithContent

  const newSlug = await uniqueQuizSlug(ctx.supabase, `${source.title} copia`)
  const { data: newQuiz } = await ctx.supabase
    .from('quizzes')
    .insert({
      title: `${source.title} (copia)`,
      slug: newSlug,
      description: source.description,
      cover_image: source.cover_image,
      estimated_minutes: source.estimated_minutes,
      status: 'draft',
    })
    .select('id')
    .single()
  if (!newQuiz) return

  const resultIdMap = new Map<string, string>()
  for (const r of source.results) {
    const { data: newResult } = await ctx.supabase
      .from('quiz_results')
      .insert({
        quiz_id: newQuiz.id,
        title: r.title,
        slug: r.slug,
        icon: r.icon,
        subtitle: r.subtitle,
        description: r.description,
        ideal_role: r.ideal_role,
        order_index: r.order_index,
      })
      .select('id')
      .single()
    if (newResult) resultIdMap.set(r.id, newResult.id)
  }

  for (const q of source.questions) {
    const { data: newQuestion } = await ctx.supabase
      .from('quiz_questions')
      .insert({ quiz_id: newQuiz.id, question: q.question, order_index: q.order_index })
      .select('id')
      .single()
    if (!newQuestion) continue

    const newAnswers = q.answers.map((a) => ({
      question_id: newQuestion.id,
      answer: a.answer,
      result_id: resultIdMap.get(a.result_id) ?? a.result_id,
      order_index: a.order_index,
    }))
    if (newAnswers.length) await ctx.supabase.from('quiz_answers').insert(newAnswers)
  }

  revalidatePath('/admin/quizzes')
}

// ─── ADMIN: RESULTS ─────────────────────────────────────────────
export async function createResultAction(quizId: string, data: QuizResultInput): Promise<{ error: string } | { ok: true; id: string }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizResultSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { count } = await ctx.supabase.from('quiz_results').select('id', { count: 'exact', head: true }).eq('quiz_id', quizId)
  const slug = await uniqueResultSlug(ctx.supabase, quizId, parsed.data.title)

  const { data: result, error } = await ctx.supabase
    .from('quiz_results')
    .insert({
      quiz_id: quizId,
      title: parsed.data.title,
      slug,
      icon: parsed.data.icon || null,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      ideal_role: parsed.data.ideal_role || null,
      order_index: count ?? 0,
    })
    .select('id')
    .single()

  if (error || !result) return { error: 'Error al crear el resultado' }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { ok: true, id: result.id }
}

export async function updateResultAction(id: string, quizId: string, data: QuizResultInput): Promise<{ error: string } | { ok: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizResultSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: current } = await ctx.supabase.from('quiz_results').select('title, slug').eq('id', id).single()
  const slug = current && current.title !== parsed.data.title
    ? await uniqueResultSlug(ctx.supabase, quizId, parsed.data.title, id)
    : current?.slug

  const { error } = await ctx.supabase
    .from('quiz_results')
    .update({
      title: parsed.data.title,
      slug,
      icon: parsed.data.icon || null,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      ideal_role: parsed.data.ideal_role || null,
    })
    .eq('id', id)

  if (error) return { error: 'Error al guardar' }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { ok: true }
}

export async function deleteResultAction(id: string, quizId: string): Promise<{ error: string } | { ok: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }

  const { count } = await ctx.supabase.from('quiz_answers').select('id', { count: 'exact', head: true }).eq('result_id', id)
  if (count && count > 0) {
    return { error: `Este resultado está asignado a ${count} respuesta${count > 1 ? 's' : ''}. Reasígnalas primero.` }
  }

  await ctx.supabase.from('quiz_results').delete().eq('id', id)
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { ok: true }
}

// ─── ADMIN: QUESTIONS + ANSWERS (fixed 4 answers per question) ──
export async function createQuestionAction(quizId: string, data: QuizQuestionInput): Promise<{ error: string } | { ok: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizQuestionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: firstResult } = await ctx.supabase.from('quiz_results').select('id').eq('quiz_id', quizId).order('order_index').limit(1).maybeSingle()
  if (!firstResult) return { error: 'Crea al menos un resultado antes de añadir preguntas' }

  const { count } = await ctx.supabase.from('quiz_questions').select('id', { count: 'exact', head: true }).eq('quiz_id', quizId)

  const { data: question, error } = await ctx.supabase
    .from('quiz_questions')
    .insert({ quiz_id: quizId, question: parsed.data.question, order_index: count ?? 0 })
    .select('id')
    .single()

  if (error || !question) return { error: 'Error al crear la pregunta' }

  await ctx.supabase.from('quiz_answers').insert(
    [0, 1, 2, 3].map((order_index) => ({
      question_id: question.id,
      answer: '',
      result_id: firstResult.id,
      order_index,
    }))
  )

  revalidatePath(`/admin/quizzes/${quizId}`)
  return { ok: true }
}

export async function updateQuestionAction(id: string, quizId: string, data: QuizQuestionInput): Promise<{ error: string } | { ok: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizQuestionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase.from('quiz_questions').update({ question: parsed.data.question }).eq('id', id)
  if (error) return { error: 'Error al guardar' }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { ok: true }
}

export async function deleteQuestionAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  const quizId = formData.get('quizId') as string
  await ctx.supabase.from('quiz_questions').delete().eq('id', id)
  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function moveQuestionAction(formData: FormData) {
  const ctx = await requireAdmin()
  if (!ctx) return
  const id = formData.get('id') as string
  const quizId = formData.get('quizId') as string
  const direction = formData.get('direction') as 'up' | 'down'

  const { data: questions } = await ctx.supabase
    .from('quiz_questions')
    .select('id, order_index')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true })
  if (!questions) return

  const idx = questions.findIndex((q) => q.id === id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (idx === -1 || swapIdx < 0 || swapIdx >= questions.length) return

  const a = questions[idx]
  const b = questions[swapIdx]
  await ctx.supabase.from('quiz_questions').update({ order_index: b.order_index }).eq('id', a.id)
  await ctx.supabase.from('quiz_questions').update({ order_index: a.order_index }).eq('id', b.id)

  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function updateAnswerAction(id: string, quizId: string, data: QuizAnswerInput): Promise<{ error: string } | { ok: true }> {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'No autorizado' }
  const parsed = quizAnswerSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase
    .from('quiz_answers')
    .update({ answer: parsed.data.answer, result_id: parsed.data.result_id })
    .eq('id', id)

  if (error) return { error: 'Error al guardar' }
  revalidatePath(`/admin/quizzes/${quizId}`)
  return { ok: true }
}

// ─── ADMIN: ANALYTICS (viral loop) ─────────────────────────────
export async function getQuizAnalytics(quizId: string) {
  const ctx = await requireAdmin()
  if (!ctx) return null

  const { data: events } = await ctx.supabase
    .from('quiz_events')
    .select('event_type, result_id, source, created_at')
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false })
    .limit(10000)

  const rows = events ?? []
  const count = (type: string) => rows.filter((e) => e.event_type === type).length

  const views = count('quiz_viewed')
  const starts = count('quiz_started')
  const completions = count('quiz_completed')
  const shareClicks = count('share_clicked')
  const instagramShares = count('instagram_share_clicked')
  const whatsappShares = count('whatsapp_share_clicked')
  const imageDownloads = count('share_image_downloaded')
  const instagramViews = rows.filter((e) => e.event_type === 'quiz_viewed' && e.source === 'instagram').length

  const byResult: Record<string, { completions: number; shares: number }> = {}
  for (const e of rows) {
    if (!e.result_id) continue
    if (e.event_type !== 'quiz_completed' && e.event_type !== 'share_clicked') continue
    byResult[e.result_id] ??= { completions: 0, shares: 0 }
    if (e.event_type === 'quiz_completed') byResult[e.result_id].completions++
    if (e.event_type === 'share_clicked') byResult[e.result_id].shares++
  }

  return {
    views,
    starts,
    completions,
    startRate: views > 0 ? starts / views : 0,
    completionRate: starts > 0 ? completions / starts : 0,
    shareClicks,
    instagramShares,
    whatsappShares,
    imageDownloads,
    instagramViews,
    byResult,
  }
}

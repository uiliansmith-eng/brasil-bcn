'use server'

import { createClient } from '@/lib/supabase/server'
import type { GuideCategory } from '@/types'

export interface GuideFilters {
  categoria?: GuideCategory
  q?: string
  page?: number
}

// ─── GET GUIDES ────────────────────────────────────────────────
export async function getGuides(filters: GuideFilters = {}) {
  const supabase = await createClient()
  const PAGE_SIZE = 12
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('guides')
    .select('id, title, slug, excerpt, category, cover_url, reading_time, published_at, views', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (filters.categoria) query = query.eq('category', filters.categoria)
  if (filters.q) query = query.ilike('title', `%${filters.q}%`)

  const { data, count, error } = await query
  if (error) return { guides: [], total: 0, pages: 0 }

  return {
    guides: data ?? [],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}

// ─── GET GUIDE BY SLUG ─────────────────────────────────────────
export async function getGuideBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guides')
    .select('*, author:profiles(id, full_name, avatar_url)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) return null

  await supabase.from('guides').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id)

  return data
}

// ─── GET GUIDES BY CATEGORY ────────────────────────────────────
export async function getGuidesByCategory(category: GuideCategory, excludeSlug?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('guides')
    .select('id, title, slug, excerpt, category, cover_url, reading_time, published_at')
    .eq('is_published', true)
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(3)

  if (excludeSlug) query = query.neq('slug', excludeSlug)

  const { data } = await query
  return data ?? []
}

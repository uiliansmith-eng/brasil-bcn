'use server'

import { createClient } from '@/lib/supabase/server'

export interface Stage {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string
  color: string
  position: number
  steps?: Step[]
}

export interface Step {
  id: string
  stage_id: string
  title: string
  slug: string
  short_description: string | null
  icon: string
  position: number
  estimated_time: string | null
  difficulty: 'facil' | 'medio' | 'dificil' | null
  company_categories: string[]
  resources?: Resource[]
  faqs?: FAQ[]
  articles?: Article[]
}

export interface Resource {
  id: string
  title: string
  url: string
  type: string
  description: string | null
  position: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  position: number
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published: boolean
  last_verified_at: string | null
  created_at: string
  updated_at: string
}

export async function getStages(): Promise<Stage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('route_stages')
    .select('*')
    .order('position')
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getStagesWithSteps(): Promise<Stage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('route_stages')
    .select(`*, steps:route_steps(*)`)
    .order('position')
  if (error) { console.error(error); return [] }
  return (data ?? []).map((s: Stage & { steps: Step[] }) => ({
    ...s,
    steps: (s.steps ?? []).sort((a, b) => a.position - b.position),
  }))
}

export async function getStepBySlug(slug: string): Promise<(Step & {
  stage: Stage
  resources: Resource[]
  faqs: FAQ[]
  articles: Article[]
}) | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('route_steps')
    .select(`
      *,
      stage:route_stages(*),
      resources:guide_resources(*),
      faqs:faq_items(*),
      articles:guide_articles(id, title, slug, excerpt, featured_image, published, last_verified_at, created_at, updated_at)
    `)
    .eq('slug', slug)
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function getStepsByStage(stageSlug: string): Promise<Step[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('route_steps')
    .select('*, stage:route_stages!inner(slug)')
    .eq('route_stages.slug', stageSlug)
    .order('position')
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getStage1Steps(): Promise<Step[]> {
  const supabase = await createClient()
  const { data: stage } = await supabase
    .from('route_stages')
    .select('id')
    .eq('position', 1)
    .single()
  if (!stage) return []
  const { data, error } = await supabase
    .from('route_steps')
    .select('*')
    .eq('stage_id', stage.id)
    .order('position')
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getArticleBySlug(slug: string): Promise<(Article & {
  step: Step & { stage: Stage }
  faqs: FAQ[]
  content: string
  seo_title: string | null
  seo_description: string | null
}) | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guide_articles')
    .select(`*, step:route_steps(*, stage:route_stages(*)), faqs:faq_items(*)`)
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) { console.error(error); return null }
  return data
}
